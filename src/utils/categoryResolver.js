"use strict";

const { ticketCategories } = require("./database");
const { categories: configCategories } = require("../../config");

/**
 * Obtiene las categorías de tickets para un servidor.
 * Prioridad: Base de datos > config.js (fallback)
 * 
 * @param {string} guildId - ID del servidor
 * @returns {Promise<Array>} Array de categorías
 */
async function getCategoriesForGuild(guildId, options = {}) {
  const { useDb = false } = options;
  try {
    // Intentar obtener categorías de la base de datos
    const dbCategories = await ticketCategories.getByGuild(guildId);
    
    // Si hay categorías en BD y useDb es true, usarlas
    if (useDb && dbCategories && dbCategories.length > 0) {
      return dbCategories
        .filter(cat => cat.enabled !== false)
        .map(cat => ({
          id: cat.category_id,
          labelKey: `ticket.categories.${cat.category_id}.label`,
          descriptionKey: `ticket.categories.${cat.category_id}.description`,
          label: cat.label,
          description: cat.description,
          emoji: cat.emoji,
          color: cat.color,
          categoryId: cat.discord_category_id,
          pingRoles: cat.ping_roles || [],
          welcomeMessage: cat.welcome_message,
          questions: cat.questions || [],
          priority: cat.priority || "normal",
        }));
    }
    
    // Por defecto, usar config.js (que tiene labelKey y descriptionKey para traducciones)
    if (configCategories && configCategories.length > 0) {
      return configCategories;
    }
    
    // Si no hay categorías en ningún lado, retornar array vacío
    return [];
  } catch (error) {
    console.error("[CATEGORY RESOLVER ERROR]", error);
    // En caso de error, usar config.js como fallback
    return configCategories || [];
  }
}

/**
 * Obtiene una categoría específica por ID
 * 
 * @param {string} guildId - ID del servidor
 * @param {string} categoryId - ID de la categoría
 * @returns {Promise<Object|null>} Categoría o null
 */
async function getCategoryById(guildId, categoryId) {
  try {
    // Intentar obtener de BD primero
    const dbCategory = await ticketCategories.getById(guildId, categoryId);
    
    if (dbCategory && dbCategory.enabled !== false) {
      return {
        id: dbCategory.category_id,
        label: dbCategory.label,
        description: dbCategory.description,
        emoji: dbCategory.emoji,
        color: dbCategory.color,
        categoryId: dbCategory.discord_category_id,
        pingRoles: dbCategory.ping_roles || [],
        welcomeMessage: dbCategory.welcome_message,
        questions: dbCategory.questions || [],
        priority: dbCategory.priority || "normal",
      };
    }
    
    // Si no está en BD, buscar en config.js
    const configCategory = configCategories?.find(cat => cat.id === categoryId);
    return configCategory || null;
  } catch (error) {
    console.error("[CATEGORY RESOLVER ERROR]", error);
    // En caso de error, buscar en config.js
    const configCategory = configCategories?.find(cat => cat.id === categoryId);
    return configCategory || null;
  }
}

/**
 * Verifica si un servidor tiene categorías configuradas
 * 
 * @param {string} guildId - ID del servidor
 * @returns {Promise<boolean>} true si tiene categorías
 */
async function hasCategories(guildId) {
  const categories = await getCategoriesForGuild(guildId);
  return categories.length > 0;
}

/**
 * Cuenta las categorías de un servidor
 * 
 * @param {string} guildId - ID del servidor
 * @returns {Promise<number>} Número de categorías
 */
async function countCategories(guildId) {
  const categories = await getCategoriesForGuild(guildId);
  return categories.length;
}

/**
 * Migra las categorías de config.js a la base de datos para un servidor
 * Útil para la primera configuración
 * 
 * @param {string} guildId - ID del servidor
 * @returns {Promise<number>} Número de categorías migradas
 */
async function migrateConfigCategoriesToDB(guildId) {
  try {
    // Verificar si ya tiene categorías en BD
    const existingCount = await ticketCategories.countByGuild(guildId);
    if (existingCount > 0) {
      return 0; // Ya tiene categorías, no migrar
    }
    
    // Migrar categorías de config.js
    if (!configCategories || configCategories.length === 0) {
      return 0;
    }
    
    let migrated = 0;
    for (const cat of configCategories) {
      try {
        await ticketCategories.create(guildId, {
          category_id: cat.id,
          label: cat.label,
          description: cat.description,
          emoji: cat.emoji,
          color: cat.color,
          discord_category_id: cat.categoryId,
          ping_roles: cat.pingRoles || [],
          welcome_message: cat.welcomeMessage,
          questions: cat.questions || [],
          priority: cat.priority || "normal",
        });
        migrated++;
      } catch (error) {
        console.error(`[MIGRATION ERROR] Category ${cat.id}:`, error.message);
      }
    }
    
    return migrated;
  } catch (error) {
    console.error("[MIGRATION ERROR]", error);
    return 0;
  }
}

module.exports = {
  getCategoriesForGuild,
  getCategoryById,
  hasCategories,
  countCategories,
  migrateConfigCategoriesToDB,
};
