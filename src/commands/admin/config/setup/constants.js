const WELCOME_VARS = "`{mention}` `{user}` `{tag}` `{server}` `{count}` `{id}`";

function fill(text, member, guild) {
  if (!text) return "";
  const user = member.user || member;
  return text
    .replace(/{mention}/g, `<@${member.id}>`)
    .replace(/{user}/g, user.username)
    .replace(/{tag}/g, user.tag || user.username)
    .replace(/{server}/g, guild.name)
    .replace(/{count}/g, String(guild.memberCount))
    .replace(/{id}/g, member.id);
}

module.exports = {
  WELCOME_VARS,
  fill,
};
