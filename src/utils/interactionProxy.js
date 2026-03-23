function createOptionsProxy(baseOptions, overrides = {}) {
  const users = overrides.users || {};
  const strings = overrides.strings || {};
  const integers = overrides.integers || {};
  const booleans = overrides.booleans || {};
  const channels = overrides.channels || {};
  const roles = overrides.roles || {};

  return {
    ...baseOptions,
    getSubcommand: () => overrides.subcommand ?? baseOptions.getSubcommand(),
    getSubcommandGroup: (required = false) => {
      if (overrides.subcommandGroup !== undefined) return overrides.subcommandGroup;
      return baseOptions.getSubcommandGroup(required);
    },
    getUser: (name, required = false) => (users[name] !== undefined ? users[name] : baseOptions.getUser(name, required)),
    getString: (name, required = false) => (strings[name] !== undefined ? strings[name] : baseOptions.getString(name, required)),
    getInteger: (name, required = false) => (integers[name] !== undefined ? integers[name] : baseOptions.getInteger(name, required)),
    getBoolean: (name, required = false) => (booleans[name] !== undefined ? booleans[name] : baseOptions.getBoolean(name, required)),
    getChannel: (name, required = false) => (channels[name] !== undefined ? channels[name] : baseOptions.getChannel(name, required)),
    getRole: (name, required = false) => (roles[name] !== undefined ? roles[name] : baseOptions.getRole(name, required)),
  };
}

function createInteractionProxy(interaction, overrides) {
  return {
    ...interaction,
    options: createOptionsProxy(interaction.options, overrides),
  };
}

module.exports = {
  createInteractionProxy,
};
