const MAX_EMBED_TITLE_LENGTH = 256;
const MAX_EMBED_DESCRIPTION_LENGTH = 4096;
const MAX_EMBED_FIELD_NAME_LENGTH = 256;
const MAX_EMBED_FIELD_VALUE_LENGTH = 1024;
const MAX_EMBED_FOOTER_LENGTH = 2048;
const MAX_EMBED_AUTHOR_NAME_LENGTH = 256;
const MAX_MESSAGE_CONTENT_LENGTH = 2000;

const DANGEROUS_PATTERNS = [
  /@everyone/gi,
  /@here/gi,
];

function sanitizeString(input, maxLength = MAX_MESSAGE_CONTENT_LENGTH) {
  if (typeof input !== "string") return "";
  
  let sanitized = input.trim();
  
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, (match) => {
      return match.split("").join("\u200b");
    });
  }
  
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength - 3) + "...";
  }
  
  return sanitized;
}

function sanitizeEmbedTitle(title) {
  return sanitizeString(title, MAX_EMBED_TITLE_LENGTH);
}

function sanitizeEmbedDescription(description) {
  return sanitizeString(description, MAX_EMBED_DESCRIPTION_LENGTH);
}

function sanitizeEmbedFieldName(name) {
  return sanitizeString(name, MAX_EMBED_FIELD_NAME_LENGTH);
}

function sanitizeEmbedFieldValue(value) {
  return sanitizeString(value, MAX_EMBED_FIELD_VALUE_LENGTH);
}

function sanitizeEmbedFooter(footer) {
  return sanitizeString(footer, MAX_EMBED_FOOTER_LENGTH);
}

function sanitizeEmbedAuthor(author) {
  return sanitizeString(author, MAX_EMBED_AUTHOR_NAME_LENGTH);
}

function sanitizeMessageContent(content) {
  return sanitizeString(content, MAX_MESSAGE_CONTENT_LENGTH);
}

function sanitizeEmbed(embed) {
  const sanitized = { ...embed };
  
  if (sanitized.title) {
    sanitized.title = sanitizeEmbedTitle(sanitized.title);
  }
  
  if (sanitized.description) {
    sanitized.description = sanitizeEmbedDescription(sanitized.description);
  }
  
  if (sanitized.footer?.text) {
    sanitized.footer.text = sanitizeEmbedFooter(sanitized.footer.text);
  }
  
  if (sanitized.author?.name) {
    sanitized.author.name = sanitizeEmbedAuthor(sanitized.author.name);
  }
  
  if (sanitized.fields && Array.isArray(sanitized.fields)) {
    sanitized.fields = sanitized.fields.map((field) => ({
      name: sanitizeEmbedFieldName(field.name || ""),
      value: sanitizeEmbedFieldValue(field.value || ""),
      inline: Boolean(field.inline),
    }));
  }
  
  return sanitized;
}

function validateUserId(userId) {
  if (typeof userId !== "string") return false;
  return /^\d{17,19}$/.test(userId);
}

function validateGuildId(guildId) {
  if (typeof guildId !== "string") return false;
  return /^\d{17,19}$/.test(guildId);
}

function validateChannelId(channelId) {
  if (typeof channelId !== "string") return false;
  return /^\d{17,19}$/.test(channelId);
}

function validateRoleId(roleId) {
  if (typeof roleId !== "string") return false;
  return /^\d{17,19}$/.test(roleId);
}

module.exports = {
  sanitizeString,
  sanitizeEmbedTitle,
  sanitizeEmbedDescription,
  sanitizeEmbedFieldName,
  sanitizeEmbedFieldValue,
  sanitizeEmbedFooter,
  sanitizeEmbedAuthor,
  sanitizeMessageContent,
  sanitizeEmbed,
  validateUserId,
  validateGuildId,
  validateChannelId,
  validateRoleId,
  MAX_EMBED_TITLE_LENGTH,
  MAX_EMBED_DESCRIPTION_LENGTH,
  MAX_EMBED_FIELD_NAME_LENGTH,
  MAX_EMBED_FIELD_VALUE_LENGTH,
  MAX_EMBED_FOOTER_LENGTH,
  MAX_EMBED_AUTHOR_NAME_LENGTH,
  MAX_MESSAGE_CONTENT_LENGTH,
};
