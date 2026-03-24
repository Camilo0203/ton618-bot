# Discord Application Setup Checklist

Complete guide to configure your TON618 bot in Discord Developer Portal.

## Step 1: Create Application

1. Go to https://discord.com/developers/applications
2. Click **"New Application"**
3. Name: `TON618` (or your preferred name)
4. Click **"Create"**

## Step 2: General Information

1. Navigate to **"General Information"**
2. **App Icon**: Upload a logo (recommended: 512x512px)
3. **Description**: 
   ```
   Professional ops console for Discord staff teams. Manage tickets, track SLA, use live playbooks, and maintain operational excellence.
   ```
4. **Tags**: Add relevant tags:
   - `Productivity`
   - `Moderation`
   - `Utility`
5. Save changes

## Step 3: Bot Configuration

1. Navigate to **"Bot"** section in left sidebar
2. Click **"Reset Token"** 
3. **IMPORTANT**: Copy and save your bot token securely
   - You'll need this for `DISCORD_TOKEN` in your `.env` file
   - Never share this token publicly
   - If exposed, reset it immediately

### Bot Settings

Configure these settings:

**Authorization Flow:**
- ✅ Public Bot: **ON** (if you want others to invite it)
- ❌ Requires OAuth2 Code Grant: **OFF**

**Privileged Gateway Intents:**
- ✅ **PRESENCE INTENT**: ON (for auto-assignment based on staff status)
- ✅ **SERVER MEMBERS INTENT**: ON (required for member operations)
- ✅ **MESSAGE CONTENT INTENT**: ON (required for ticket messages)

**Bot Permissions:**
These will be set in the invite URL, but note what's needed:
- Manage Roles
- Manage Channels
- View Channels
- Send Messages
- Manage Messages
- Embed Links
- Attach Files
- Read Message History
- Add Reactions
- Use Slash Commands

## Step 4: OAuth2 Configuration

1. Navigate to **"OAuth2"** > **"General"**
2. **Redirects**: Not needed for bot-only deployment
3. Navigate to **"OAuth2"** > **"URL Generator"**

### Generate Bot Invite URL

**Scopes:**
- ✅ `bot`
- ✅ `applications.commands`

**Bot Permissions** (select these):

**General Permissions:**
- ✅ Manage Roles
- ✅ Manage Channels
- ✅ View Channels

**Text Permissions:**
- ✅ Send Messages
- ✅ Send Messages in Threads
- ✅ Create Public Threads
- ✅ Create Private Threads
- ✅ Embed Links
- ✅ Attach Files
- ✅ Add Reactions
- ✅ Use External Emojis
- ✅ Mention @everyone, @here, and All Roles
- ✅ Manage Messages
- ✅ Manage Threads
- ✅ Read Message History
- ✅ Use Slash Commands

**Copy the generated URL** - this is your bot invite link.

## Step 5: Install to Your Server

1. Use the invite URL from Step 4
2. Select your Discord server
3. Authorize the bot
4. Complete the captcha if prompted

## Step 6: Get Your User ID (for OWNER_ID)

1. Open Discord
2. Go to **User Settings** > **Advanced**
3. Enable **Developer Mode**
4. Right-click your username anywhere
5. Click **"Copy ID"**
6. This is your `OWNER_ID` for the `.env` file

## Step 7: Verify Bot Setup

After deploying your bot code:

1. Check bot appears online in your server
2. Run `/debug status` (only you as owner can use this)
3. Verify response shows bot is healthy

## Step 8: Deploy Slash Commands

From your bot's directory:

```bash
# Deploy commands globally (recommended for production)
npm run deploy:compact

# Or deploy to specific guild for testing
GUILD_ID=your_server_id npm run deploy:compact
```

Wait 1-2 minutes for commands to appear in Discord.

## Step 9: Rich Presence (Optional)

1. Navigate to **"Rich Presence"** > **"Art Assets"**
2. Upload bot logo as "main" asset
3. This appears in bot's profile and presence

## Step 10: Application Verification (Optional)

For bots in 75+ servers, Discord requires verification:

1. Navigate to **"General Information"**
2. Scroll to **"Verification"**
3. Follow Discord's verification process
4. Required documents:
   - Government ID
   - Proof of bot ownership
   - Privacy policy URL
   - Terms of service URL

**Note**: Not needed for V1 launch unless you expect rapid growth.

## Common Issues

### Bot doesn't appear online
- Verify bot token is correct in `.env`
- Check bot process is running
- Ensure MongoDB connection is working
- Review logs for errors

### Slash commands don't appear
- Wait 1-2 minutes after deployment
- Try kicking and re-inviting the bot
- Verify `applications.commands` scope in invite URL
- Check bot has "Use Slash Commands" permission

### Bot can't create channels
- Verify "Manage Channels" permission
- Check bot's role is high enough in role hierarchy
- Ensure bot has permission in category where tickets are created

### Intents error on startup
- Verify all three privileged intents are enabled
- Save changes in Developer Portal
- Restart bot after enabling intents

## Security Best Practices

1. **Never commit bot token to git**
   - Use `.env` file (already in `.gitignore`)
   - Use environment variables in hosting platform

2. **Regenerate token if exposed**
   - Go to Bot section
   - Click "Reset Token"
   - Update in all deployment locations

3. **Limit owner commands**
   - Only set your own Discord ID as `OWNER_ID`
   - Never share owner access

4. **Monitor bot usage**
   - Review audit logs regularly
   - Check for unauthorized command usage
   - Monitor server count

## Bot Invite URL Template

For quick reference, your invite URL format:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8589934592&scope=bot%20applications.commands
```

Replace `YOUR_CLIENT_ID` with your Application ID from General Information.

**Permissions integer**: `8589934592` includes all required permissions listed above.

## Next Steps

After completing this setup:

1. ✅ Bot is configured in Discord Developer Portal
2. ✅ Bot is invited to your server
3. ✅ Slash commands are deployed
4. ✅ Bot appears online

Now proceed to:
- Configure your server with `/setup` commands
- Create ticket panel with `/setup tickets panel`
- Test ticket creation
- Review `docs/QUICKSTART.md` for initial configuration
