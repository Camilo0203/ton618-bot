const test = require("node:test");
const assert = require("node:assert/strict");

const alertChecker = require("../src/utils/alertChecker");

test("buildYouTubeChannelCandidates soporta channel_id y handles", () => {
  const byId = alertChecker.__test.buildYouTubeChannelCandidates("UCX6OQ3DkcsbYNE6H8uQQuVA");
  const byHandle = alertChecker.__test.buildYouTubeChannelCandidates("@MrBeast");
  const byUrl = alertChecker.__test.buildYouTubeChannelCandidates("https://www.youtube.com/@MrBeast");

  assert.deepEqual(byId, [{ type: "channel_id", channelId: "UCX6OQ3DkcsbYNE6H8uQQuVA" }]);
  assert.deepEqual(byHandle, [{ type: "page", pageUrl: "https://www.youtube.com/@MrBeast" }]);
  assert.deepEqual(byUrl, [{ type: "page", pageUrl: "https://www.youtube.com/@MrBeast" }]);
});

test("extractYouTubeChannelIdFromHtml encuentra el channelId en HTML de pagina", () => {
  const html = `
    <html>
      <head>
        <link rel="canonical" href="https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA">
      </head>
      <body>
        <script>var data = {"channelId":"UCX6OQ3DkcsbYNE6H8uQQuVA"};</script>
      </body>
    </html>
  `;

  const channelId = alertChecker.__test.extractYouTubeChannelIdFromHtml(html);
  assert.equal(channelId, "UCX6OQ3DkcsbYNE6H8uQQuVA");
});

test("loadYouTubeFeed resuelve handles a channel_id antes de leer el feed", async () => {
  const originalFetch = global.fetch;
  const calls = [];

  global.fetch = async (url) => {
    calls.push(url);
    if (url === "https://www.youtube.com/@MrBeast") {
      return {
        ok: true,
        status: 200,
        text: async () => '<html><script>{"channelId":"UCX6OQ3DkcsbYNE6H8uQQuVA"}</script></html>',
      };
    }

    if (url === "https://www.youtube.com/feeds/videos.xml?channel_id=UCX6OQ3DkcsbYNE6H8uQQuVA") {
      return {
        ok: true,
        status: 200,
        text: async () => `
          <?xml version="1.0" encoding="UTF-8"?>
          <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
            <title>MrBeast</title>
            <entry>
              <id>yt:video:abc123</id>
              <title>Video</title>
              <link rel="alternate" href="https://www.youtube.com/watch?v=abc123"/>
            </entry>
          </feed>
        `,
      };
    }

    throw new Error(`Unexpected URL: ${url}`);
  };

  try {
    const result = await alertChecker.__test.loadYouTubeFeed("@MrBeast");
    assert.equal(result.channelId, "UCX6OQ3DkcsbYNE6H8uQQuVA");
    assert.equal(result.feed.title, "MrBeast");
    assert.deepEqual(calls, [
      "https://www.youtube.com/@MrBeast",
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCX6OQ3DkcsbYNE6H8uQQuVA",
    ]);
  } finally {
    global.fetch = originalFetch;
  }
});
