const Parser = require("rss-parser");
const { alerts } = require("./database");
const { createJobQueue } = require("./jobQueue");

const alertQueue = createJobQueue("alert-checker", {
  concurrency: Number(process.env.ALERT_QUEUE_CONCURRENCY || 3),
  maxQueueSize: Number(process.env.ALERT_QUEUE_MAX_SIZE || 2000),
  timeoutMs: Number(process.env.ALERT_QUEUE_TIMEOUT_MS || 120000),
});
let isAlertsSweepRunning = false;
let alertCheckerInterval = null;
const ALERT_HTTP_TIMEOUT_MS = Math.max(3000, Number(process.env.ALERT_HTTP_TIMEOUT_MS || 10000));
const YOUTUBE_CHANNEL_ID_REGEX = /^UC[\w-]{22}$/;
const YOUTUBE_REQUEST_HEADERS = {
  "User-Agent": "TON618/3.0 (YouTube Alert Checker)",
  Accept: "application/atom+xml, application/xml, text/xml;q=0.9, text/html;q=0.8, */*;q=0.5",
};

async function fetchWithTimeout(url, options = {}, timeoutMs = ALERT_HTTP_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(1000, timeoutMs));
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function normalizeYouTubePageUrl(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return null;

  if (value.startsWith("@")) {
    return `https://www.youtube.com/${value}`;
  }

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      const pathname = parsed.pathname.replace(/\/+$/, "");
      if (!pathname || pathname === "/") return null;
      return `https://www.youtube.com${pathname}`;
    } catch {
      return null;
    }
  }

  return null;
}

function buildYouTubeChannelCandidates(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return [];

  const candidates = [];
  if (YOUTUBE_CHANNEL_ID_REGEX.test(value)) {
    candidates.push({ type: "channel_id", channelId: value });
  }

  const pageUrl = normalizeYouTubePageUrl(value);
  if (pageUrl) {
    candidates.push({ type: "page", pageUrl });
  }

  return candidates;
}

function extractYouTubeChannelIdFromHtml(html) {
  const source = String(html || "");
  const patterns = [
    /"channelId":"(UC[\w-]{22})"/i,
    /<link[^>]+href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})"/i,
    /<meta[^>]+itemprop="identifier"[^>]+content="(UC[\w-]{22})"/i,
    /"externalId":"(UC[\w-]{22})"/i,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(source);
    if (match?.[1]) return match[1];
  }

  return null;
}

async function loadYouTubeFeed(channelInput) {
  const parser = new Parser();
  const candidates = buildYouTubeChannelCandidates(channelInput);
  if (!candidates.length) {
    const error = new Error(`Unsupported YouTube channel input: ${channelInput}`);
    error.code = "YOUTUBE_INVALID_INPUT";
    throw error;
  }

  let lastError = null;
  for (const candidate of candidates) {
    try {
      let resolvedChannelId = candidate.channelId || null;
      let pageUrl = candidate.pageUrl || null;

      if (!resolvedChannelId && pageUrl) {
        const pageResponse = await fetchWithTimeout(pageUrl, {
          headers: YOUTUBE_REQUEST_HEADERS,
        });
        if (!pageResponse.ok) {
          const error = new Error(`YouTube channel page request failed: ${pageResponse.status}`);
          error.status = pageResponse.status;
          error.pageUrl = pageUrl;
          throw error;
        }
        const html = await pageResponse.text();
        resolvedChannelId = extractYouTubeChannelIdFromHtml(html);
        if (!resolvedChannelId) {
          const error = new Error("Could not resolve YouTube channel ID from page HTML");
          error.pageUrl = pageUrl;
          throw error;
        }
      }

      const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${resolvedChannelId}`;
      const feedResponse = await fetchWithTimeout(feedUrl, {
        headers: YOUTUBE_REQUEST_HEADERS,
      });
      if (!feedResponse.ok) {
        const error = new Error(`YouTube feed request failed: ${feedResponse.status}`);
        error.status = feedResponse.status;
        error.feedUrl = feedUrl;
        error.channelId = resolvedChannelId;
        throw error;
      }

      const xml = await feedResponse.text();
      const feed = await parser.parseString(xml);
      return {
        feed,
        feedUrl,
        channelId: resolvedChannelId,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Could not load YouTube feed");
}

// Cache para el token de Twitch
let twitchTokenCache = {
  token: null,
  expiresAt: 0
};

// Función para obtener el token de acceso de Twitch
async function getTwitchToken() {
  const now = Date.now();

  // Si el token aún es válido, devolverlo
  if (twitchTokenCache.token && twitchTokenCache.expiresAt > now) {
    return twitchTokenCache.token;
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("[ALERT CHECKER] Twitch credentials not configured. Set TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET env vars.");
    return null;
  }

  try {
    const response = await fetchWithTimeout("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials"
      })
    });

    if (!response.ok) {
      throw new Error(`Twitch token request failed: ${response.status}`);
    }

    const data = await response.json();
    twitchTokenCache.token = data.access_token;
    twitchTokenCache.expiresAt = now + (data.expires_in * 1000) - 60000; // 1 min antes de expirar

    console.log("[ALERT CHECKER] Twitch token obtained successfully");
    return twitchTokenCache.token;
  } catch (error) {
    console.error("[ALERT CHECKER] Error getting Twitch token:", error.message);
    return null;
  }
}

// Función para comprobar alertas de YouTube
async function checkYouTubeAlert(alert, client) {
  try {
    const { feed, channelId, feedUrl } = await loadYouTubeFeed(alert.channel_id);

    if (!feed.items || feed.items.length === 0) {
      return;
    }

    // El video más reciente es el primero
    const latestVideo = feed.items[0];
    const videoId = latestVideo.id || latestVideo.link?.split("v=")[1]?.split("&")[0];

    if (!videoId) {
      console.error("[ALERT CHECKER] Could not extract video ID from feed");
      return;
    }

    // Si es un video nuevo (no coincide con el último ID conocido)
    if (alert.last_id !== videoId) {
      // Actualizar el last_id en la base de datos
      await alerts.updateLastId(alert._id.toString(), videoId);

      // Enviar notificación al canal de Discord
      const guild = client.guilds.cache.get(alert.guild_id);
      if (!guild) return;

      const channel = guild.channels.cache.get(alert.discord_channel_id);
      if (!channel) return;

      const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

      // Detectar si es un YouTube Short
      let isShort = false;
      try {
        const shortCheckResponse = await fetchWithTimeout(`https://www.youtube.com/shorts/${videoId}`, {
          method: "HEAD",
          redirect: "manual"
        });
        
        // Si devuelve 200, es un Short. Si devuelve 303 u otro código de redirección, es un video normal
        isShort = shortCheckResponse.status === 200;
      } catch (error) {
        console.log("[ALERT CHECKER] Error detecting Short, assuming normal video:", error.message);
        isShort = false;
      }

      // Formatear la fecha de publicación
      const publishDate = latestVideo.pubDate ? new Date(latestVideo.pubDate).toLocaleString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }) : "Fecha desconocida";

      const channelName = feed.title || "Canal desconocido";
      let embed;
      let content;
      let videoUrl;

      if (isShort) {
        // Diseño para YouTube Short
        content = `¡Hey @everyone! **${channelName}** acaba de subir un nuevo **Short**.`;
        videoUrl = `https://www.youtube.com/shorts/${videoId}`;

        embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle(latestVideo.title)
          .setURL(videoUrl)
          .setThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
          .addFields(
            { 
              name: "📺 Canal", 
              value: `**${channelName}**`, 
              inline: true 
            },
            { 
              name: "📅 Publicación", 
              value: publishDate, 
              inline: true 
            },
            {
              name: "🎬 Tipo",
              value: "**Short**",
              inline: true
            }
          )
          .setFooter({ 
            text: "YouTube Shorts", 
            iconURL: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png" 
          })
          .setTimestamp();
      } else {
        // Diseño para Video Normal
        content = `¡Hey @everyone! **${channelName}** acaba de subir un nuevo video.`;
        videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle(latestVideo.title)
          .setURL(videoUrl)
          .setImage(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
          .addFields(
            { 
              name: "📺 Canal", 
              value: `**${channelName}**`, 
              inline: true 
            },
            { 
              name: "📅 Publicación", 
              value: publishDate, 
              inline: true 
            }
          )
          .setFooter({ 
            text: "YouTube", 
            iconURL: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png" 
          })
          .setTimestamp();
      }

      // Crear botón/link
      const buttonRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel(isShort ? "Ver Short" : "Ver Video")
            .setStyle(ButtonStyle.Link)
            .setURL(videoUrl)
        );

      await channel.send({
        content: content,
        embeds: [embed],
        components: [buttonRow]
      });

      console.log(`[ALERT CHECKER] YouTube notification sent for video: ${videoId} (${isShort ? "Short" : "Normal"})`);
    }
  } catch (error) {
    if (error?.status === 404) {
      console.error(
        `[ALERT CHECKER] YouTube alert ${alert._id} returned 404.`,
        `input=${alert.channel_id}`,
        error.feedUrl ? `feed=${error.feedUrl}` : "",
        error.pageUrl ? `page=${error.pageUrl}` : ""
      );
      return;
    }
    console.error(`[ALERT CHECKER] Error checking YouTube alert ${alert._id}:`, error.message);
  }
}

// Función para comprobar alertas de Twitch
async function checkTwitchAlert(alert, client) {
  try {
    const username = alert.channel_id;
    const token = await getTwitchToken();

    if (!token) {
      console.error("[ALERT CHECKER] Cannot check Twitch alert - no token");
      return;
    }

    const clientId = process.env.TWITCH_CLIENT_ID;

    // Obtener información del usuario de Twitch
    const userResponse = await fetchWithTimeout(`https://api.twitch.tv/helix/users?login=${username}`, {
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${token}`
      }
    });

    if (!userResponse.ok) {
      throw new Error(`Twitch user request failed: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    if (!userData.data || userData.data.length === 0) {
      console.error(`[ALERT CHECKER] Twitch user not found: ${username}`);
      return;
    }

    const twitchUser = userData.data[0];
    const userId = twitchUser.id;

    // Comprobar si está en vivo
    const streamResponse = await fetchWithTimeout(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${token}`
      }
    });

    if (!streamResponse.ok) {
      throw new Error(`Twitch stream request failed: ${streamResponse.status}`);
    }

    const streamData = await streamResponse.json();
    const isLive = streamData.data && streamData.data.length > 0;

    if (isLive) {
      // El usuario está en vivo
      // Verificar si ya notificamos (last_id indica si ya se/notificó)
      // Usamos last_id para almacenar si ya se notificó del último "en vivo"
      const wasNotified = alert.last_id === "live";

      if (!wasNotified) {
        // Actualizar estado de notificación
        await alerts.updateLastId(alert._id.toString(), "live");

        // Enviar notificación
        const guild = client.guilds.cache.get(alert.guild_id);
        if (!guild) return;

        const channel = guild.channels.cache.get(alert.discord_channel_id);
        if (!channel) return;

        const { EmbedBuilder } = require("discord.js");

        const stream = streamData.data[0];

        // Reemplazar {width} y {height} en la URL de la miniatura
        const streamThumbnailUrl = stream.thumbnail_url
          .replace("{width}", "1280")
          .replace("{height}", "720");

        const embed = new EmbedBuilder()
          .setColor(0x9146FF)
          .setTitle(stream.title || "Stream en directo")
          .setURL(`https://twitch.tv/${username}`)
          .setImage(streamThumbnailUrl)
          .setThumbnail(twitchUser.profile_image_url)
          .addFields(
            { 
              name: "🎮 Jugando a", 
              value: stream.game_name || "Juego desconocido", 
              inline: true 
            },
            { 
              name: "👥 Espectadores", 
              value: stream.viewer_count?.toString() || "0", 
              inline: true 
            }
          )
          .setFooter({ 
            text: "Twitch", 
            iconURL: "https://cdn-icons-png.flaticon.com/512/2111/2111668.png" 
          })
          .setTimestamp();

        await channel.send({
          content: `🔴 ¡**${twitchUser.display_name}** está en directo en Twitch!`,
          embeds: [embed]
        });

        console.log(`[ALERT CHECKER] Twitch notification sent for: ${username}`);
      }
    } else {
      // No está en vivo, resetear el estado de notificación
      if (alert.last_id === "live") {
        await alerts.updateLastId(alert._id.toString(), "offline");
      }
    }
  } catch (error) {
    console.error(`[ALERT CHECKER] Error checking Twitch alert ${alert._id}:`, error.message);
  }
}

// Función principal que inicia el comprobador de alertas
async function startAlertChecker(client) {
  if (alertCheckerInterval) {
    return;
  }

  console.log("[ALERT CHECKER] Starting alert checker...");

  // Comprobar inmediatamente al iniciar
  await checkAllAlerts(client);

  // Luego comprobar cada 3 minutos (180000 ms)
  alertCheckerInterval = setInterval(async () => {
    await checkAllAlerts(client);
  }, 180000);
  if (typeof alertCheckerInterval.unref === "function") {
    alertCheckerInterval.unref();
  }

  console.log("[ALERT CHECKER] Alert checker started - checking every 3 minutes");
}

function stopAlertChecker() {
  if (!alertCheckerInterval) return;
  clearInterval(alertCheckerInterval);
  alertCheckerInterval = null;
}

// Función para comprobar todas las alertas
async function checkAllAlerts(client) {
  if (isAlertsSweepRunning) {
    console.log("[ALERT CHECKER] Previous sweep still running, skipping this cycle.");
    return;
  }

  isAlertsSweepRunning = true;
  try {
    const allAlerts = await alerts.getAll();

    if (allAlerts.length === 0) {
      return;
    }

    console.log(`[ALERT CHECKER] Checking ${allAlerts.length} alerts...`);

    const jobs = [];
    for (const alert of allAlerts) {
      if (!alert.enabled) continue;

      jobs.push(
        alertQueue.add(async () => {
          if (alert.platform === "youtube") {
            await checkYouTubeAlert(alert, client);
          } else if (alert.platform === "twitch") {
            await checkTwitchAlert(alert, client);
          }
        }).catch((error) => {
          console.error(`[ALERT CHECKER] Error processing alert ${alert._id}:`, error.message);
        })
      );
    }

    await Promise.all(jobs);

    console.log("[ALERT CHECKER] Alerts check completed");
  } catch (error) {
    console.error("[ALERT CHECKER] Error checking alerts:", error.message);
  } finally {
    isAlertsSweepRunning = false;
  }
}

module.exports = {
  startAlertChecker,
  stopAlertChecker,
};

module.exports.__test = {
  buildYouTubeChannelCandidates,
  extractYouTubeChannelIdFromHtml,
  loadYouTubeFeed,
};
