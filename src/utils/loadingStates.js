"use strict";

/**
 * Loading States Manager
 * Professional loading indicators with progress tracking
 */

const { COLORS, BRAND, ICONS, createLoadingEmbed } = require("./brand");

// Loading messages by language
const LOADING_MESSAGES = {
  en: [
    "Initializing...",
    "Processing your request...",
    "Fetching data...",
    "Updating records...",
    "Almost ready...",
    "Finalizing...",
  ],
  es: [
    "Inicializando...",
    "Procesando tu solicitud...",
    "Obteniendo datos...",
    "Actualizando registros...",
    "Casi listo...",
    "Finalizando...",
  ],
};

// Spinner frames for visual loading indicator
const SPINNER_FRAMES = ["◐", "◓", "◑", "◒"];

/**
 * Create a professional loading message
 * @param {string} operation - Description of the operation
 * @param {string} language - Language code
 * @returns {Object} Embed and suggested delay
 */
function createLoadingMessage(operation, language = "en") {
  const messages = LOADING_MESSAGES[language] || LOADING_MESSAGES.en;
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  const embed = createLoadingEmbed(
    `**${operation}**\n\n${ICONS.loading} ${randomMessage}`,
    { language }
  );

  return {
    embed,
    suggestedDelay: 1000,
    message: randomMessage,
  };
}

/**
 * Create a deferred reply with loading state
 * @param {Interaction} interaction - Discord interaction
 * @param {string} operation - Operation description
 * @param {string} language - Language code
 */
async function deferWithLoading(interaction, operation, language = "en") {
  const loadingData = createLoadingMessage(operation, language);

  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply({ ephemeral: true });
  }

  await interaction.editReply({ embeds: [loadingData.embed] });

  return loadingData;
}

/**
 * Update loading state with progress
 * @param {Interaction} interaction - Discord interaction
 * @param {string} operation - Current operation
 * @param {number} progress - Progress percentage (0-100)
 * @param {string} language - Language code
 */
async function updateLoadingProgress(interaction, operation, progress, language = "en") {
  const barLength = 10;
  const filledBars = Math.floor((progress / 100) * barLength);
  const emptyBars = barLength - filledBars;
  const progressBar = "█".repeat(filledBars) + "░".repeat(emptyBars);

  const embed = createLoadingEmbed(
    `**${operation}**\n\n${ICONS.loading} ${progressBar} ${progress}%`,
    { language }
  );

  await interaction.editReply({ embeds: [embed] });
}

/**
 * Wrap an async operation with loading state
 * @param {Interaction} interaction - Discord interaction
 * @param {Function} operation - Async function to execute
 * @param {string} operationName - Name of the operation
 * @param {string} language - Language code
 * @returns {Promise<any>} Result of the operation
 */
async function withLoadingState(interaction, operation, operationName, language = "en") {
  // Initial loading state
  await deferWithLoading(interaction, operationName, language);

  try {
    // Execute the operation
    const result = await operation();

    // Success will be handled by the caller
    return result;
  } catch (error) {
    // Error will be handled by the caller
    throw error;
  }
}

/**
 * Create a typing indicator for channel operations
 * @param {TextChannel} channel - Discord channel
 * @param {number} duration - Duration in ms
 */
async function showTypingIndicator(channel, duration = 2000) {
  await channel.sendTyping();

  if (duration > 2000) {
    const intervals = Math.floor(duration / 2000);
    for (let i = 0; i < intervals; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await channel.sendTyping().catch((err) => { console.error("[loadingStates] sendTyping failed:", err?.message || err); });
    }
  }
}

module.exports = {
  LOADING_MESSAGES,
  SPINNER_FRAMES,
  createLoadingMessage,
  deferWithLoading,
  updateLoadingProgress,
  withLoadingState,
  showTypingIndicator,
};
