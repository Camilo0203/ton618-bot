"use strict";

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const {
  verifSettings,
  verifCodes,
  verifLogs,
  settings,
} = require("../utils/database");
const { applyVerification } = require("../commands/admin/config/verify");
const E = require("../utils/embeds");

async function handleVerif(interaction) {
  const { customId } = interaction;

  if (customId === "verify_start") return handleVerifyStart(interaction);
  if (customId === "verify_help") return handleVerifyHelp(interaction);
  if (customId === "verify_code_modal") return handleCodeModal(interaction);
  if (customId === "verify_question_modal") return handleQuestionModal(interaction);
  if (customId === "verify_enter_code") return handleEnterCode(interaction);
  if (customId === "verify_resend_code") return handleResendCode(interaction);

  return null;
}

async function handleVerifyStart(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;
  const guildSettings = await settings.get(guild.id);
  const verificationSettings = await verifSettings.get(guild.id);

  if (!verificationSettings || !verificationSettings.enabled) {
    return interaction.reply({
      embeds: [E.errorEmbed("Verification is not active in this server.")],
      flags: 64,
    });
  }

  const member = await guild.members.fetch(user.id).catch(() => null);
  if (guildSettings.verify_role && member?.roles.cache.has(guildSettings.verify_role)) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setDescription("You are already verified in this server."),
      ],
      flags: 64,
    });
  }

  if (verificationSettings.mode === "button") {
    return completeVerification(interaction, guild, guildSettings, user);
  }

  if (verificationSettings.mode === "code") {
    const existingCode = await verifCodes.getActive(user.id, guild.id);
    const code = existingCode || await verifCodes.generate(user.id, guild.id);

    try {
      await user.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle("Verification Code")
            .setDescription(
              `Your verification code for **${guild.name}** is:\n\n` +
              `# \`${code}\`\n\n` +
              "This code expires in **10 minutes**.\n" +
              "Return to the server and click **Enter code**.",
            )
            .setFooter({ text: guild.name })
            .setTimestamp(),
        ],
      });
    } catch (_) {
      return interaction.reply({
        embeds: [
          E.errorEmbed(
            "I could not send you a DM.\n\n" +
            "Enable direct messages for this server and try again.",
          ),
        ],
        flags: 64,
      });
    }

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x57F287)
          .setTitle("Code sent by DM")
          .setDescription(
            "A 6-character code was sent to your direct messages.\n\n" +
            "**Next steps:**\n" +
            "1. Open your DM inbox and copy the code.\n" +
            "2. Return here and click **Enter code**.\n\n" +
            "The code expires in **10 minutes**.",
          )
          .setFooter({ text: "If the DM did not arrive, click Resend code." })
          .setTimestamp(),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("verify_enter_code")
            .setLabel("Enter code")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("verify_resend_code")
            .setLabel("Resend code")
            .setStyle(ButtonStyle.Secondary),
        ),
      ],
      flags: 64,
    });
  }

  if (verificationSettings.mode === "question") {
    if (!verificationSettings.question) {
      return interaction.reply({
        embeds: [
          E.errorEmbed("No verification question is configured. Ask an admin to run `/verify question`."),
        ],
        flags: 64,
      });
    }

    const modal = new ModalBuilder()
      .setCustomId("verify_question_modal")
      .setTitle("Verification Question");

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("answer_input")
          .setLabel(verificationSettings.question.substring(0, 45))
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(100)
          .setPlaceholder("Type your answer here"),
      ),
    );

    return interaction.showModal(modal);
  }

  return interaction.reply({
    embeds: [E.errorEmbed("Verification mode is not configured correctly.")],
    flags: 64,
  });
}

async function handleVerifyHelp(interaction) {
  const verificationSettings = await verifSettings.get(interaction.guild.id);
  const modeHelp = {
    button: "Click **Verify me** and the bot will verify you immediately.",
    code: "Click **Verify me**, check your DM inbox for the code, then enter it in the modal.",
    question: "Click **Verify me** and answer the verification question correctly.",
  };

  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("How verification works")
        .setDescription(modeHelp[verificationSettings?.mode] || "Follow the instructions shown in the verification panel.")
        .addFields(
          {
            name: "DM problems?",
            value: "Enable direct messages for this server and try again.",
            inline: false,
          },
          {
            name: "Expired code?",
            value: "Codes last 10 minutes. Click **Verify me** again to receive a new one.",
            inline: false,
          },
          {
            name: "Still blocked?",
            value: "Contact a server admin for manual help.",
            inline: false,
          },
        )
        .setTimestamp(),
    ],
    flags: 64,
  });
}

async function handleEnterCode(interaction) {
  const verificationSettings = await verifSettings.get(interaction.guild.id);
  if (!verificationSettings || !verificationSettings.enabled) {
    return interaction.reply({
      embeds: [E.errorEmbed("Verification is not active right now.")],
      flags: 64,
    });
  }

  const modal = new ModalBuilder()
    .setCustomId("verify_code_modal")
    .setTitle("Enter your code");

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("code_input")
        .setLabel("Code received by DM")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(6)
        .setMaxLength(6)
        .setPlaceholder("Example: AB1C2D"),
    ),
  );

  return interaction.showModal(modal);
}

async function handleCodeModal(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;
  const guildSettings = await settings.get(guild.id);
  const codeInput = interaction.fields.getTextInputValue("code_input").toUpperCase().trim();
  const result = await verifCodes.verify(user.id, guild.id, codeInput);

  if (!result.valid) {
    const messages = {
      no_code: "No pending code was found. Click **Verify me** to generate a new one.",
      expired: "Your code expired. Click **Verify me** to generate a new one.",
      wrong: "Incorrect code. Try again.",
    };

    await verifLogs.add(guild.id, user.id, "failed", `Incorrect code: ${codeInput}`);
    return interaction.reply({
      embeds: [E.errorEmbed(messages[result.reason] || "Invalid verification code.")],
      flags: 64,
    });
  }

  return completeVerification(interaction, guild, guildSettings, user);
}

async function handleQuestionModal(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;
  const guildSettings = await settings.get(guild.id);
  const verificationSettings = await verifSettings.get(guild.id);
  const answer = interaction.fields.getTextInputValue("answer_input").toLowerCase().trim();

  if (answer !== String(verificationSettings.question_answer || "").toLowerCase().trim()) {
    await verifLogs.add(guild.id, user.id, "failed", `Wrong answer: ${answer}`);
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.ERROR)
          .setDescription("Incorrect answer. Read the question carefully and try again."),
      ],
      flags: 64,
    });
  }

  return completeVerification(interaction, guild, guildSettings, user);
}

async function handleResendCode(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;
  const verificationSettings = await verifSettings.get(guild.id);

  if (!verificationSettings || verificationSettings.mode !== "code") {
    return interaction.reply({
      embeds: [E.errorEmbed("This verification mode does not use DM codes.")],
      flags: 64,
    });
  }

  const code = await verifCodes.generate(user.id, guild.id);
  try {
    await user.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x57F287)
          .setTitle("New verification code")
          .setDescription(
            `Your new verification code is:\n\n# \`${code}\`\n\n` +
            "This code expires in **10 minutes**.",
          )
          .setFooter({ text: guild.name })
          .setTimestamp(),
      ],
    });
    return interaction.reply({
      embeds: [E.successEmbed("A new verification code was sent by DM.")],
      flags: 64,
    });
  } catch (_) {
    return interaction.reply({
      embeds: [E.errorEmbed("I could not send you a DM. Enable direct messages and try again.")],
      flags: 64,
    });
  }
}

async function completeVerification(interaction, guild, guildSettings, user) {
  const member = await guild.members.fetch(user.id).catch(() => null);
  if (!member) {
    return interaction.reply({
      embeds: [E.errorEmbed("Your member profile could not be found in this server.")],
      flags: 64,
    });
  }

  if (guildSettings.verify_role) {
    const verifyRole = guild.roles.cache.get(guildSettings.verify_role);
    if (verifyRole) {
      await member.roles.add(verifyRole).catch(() => {});
    }
  }

  const verificationSettings = await verifSettings.get(guild.id);
  await applyVerification(member, guild, verificationSettings, "Verification completed");
  await verifLogs.add(guild.id, user.id, "verified");

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.SUCCESS)
        .setTitle("Verification completed")
        .setDescription(`Welcome to **${guild.name}**, <@${user.id}>. You now have full access to the server.`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTimestamp(),
    ],
    flags: 64,
  });

  if (verificationSettings.dm_on_verify) {
    await user.send({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("You are verified")
          .setDescription(`You were verified successfully in **${guild.name}**.`)
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .setFooter({ text: guild.name })
          .setTimestamp(),
      ],
    }).catch(() => {});
  }

  if (verificationSettings.log_channel) {
    const logChannel = guild.channels.cache.get(verificationSettings.log_channel);
    await logChannel?.send({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.SUCCESS)
          .setTitle("Member verified")
          .addFields(
            { name: "User", value: `${user.tag} (<@${user.id}>)`, inline: true },
            { name: "User ID", value: `\`${user.id}\``, inline: true },
            { name: "Mode", value: verificationSettings.mode || "unknown", inline: true },
            { name: "When", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
          )
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setTimestamp(),
      ],
    }).catch(() => {});
  }
}

module.exports = { handleVerif };
