"use strict";

const { getCategoriesForGuild, getCategoryById } = require("../../utils/categoryResolver");

/**
 * Obtiene las categorías para usar en el handler de tickets
 * Wrapper que mantiene compatibilidad con el código existente
 */
async function getCategories(guildId) {
  return await getCategoriesForGuild(guildId);
}

/**
 * Obtiene una categoría específica
 */
async function getCategory(guildId, categoryId) {
  return await getCategoryById(guildId, categoryId);
}

module.exports = {
  getCategories,
  getCategory,
};
