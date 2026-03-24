# TON618 Support Server Blueprint

Complete template for setting up a professional Discord server for TON618 support and community.

## Server Overview

**Purpose**: Support, documentation, and community for TON618 users  
**Target Audience**: Discord server admins and staff teams  
**Tone**: Professional, helpful, operational

## Server Settings

### Basic Information
- **Server Name**: TON618 Support
- **Server Icon**: TON618 logo (512x512px recommended)
- **Description**: Official support server for TON618 - the ops console for Discord staff teams
- **Server Banner**: Optional - branded banner with tagline

### Verification Level
- **Medium** - Must have verified email

### Explicit Content Filter
- **Scan media from all members**

### Default Notifications
- **Only @mentions** (reduces noise)

### 2FA Requirement for Moderation
- **Enabled** (for staff security)

## Roles Structure

### Administrative Roles

**@Owner** (Your role)
- Color: `#ED4245` (Red)
- Permissions: Administrator
- Hoisted: Yes

**@Staff**
- Color: `#5865F2` (Blurple)
- Permissions: Manage Messages, Manage Threads, Kick Members, Timeout Members
- Hoisted: Yes

**@Support**
- Color: `#57F287` (Green)
- Permissions: Manage Messages, Manage Threads
- Hoisted: Yes

### Bot Roles

**@TON618**
- Color: `#5865F2` (Blurple)
- Permissions: Manage Roles, Manage Channels, Send Messages, Embed Links, Attach Files, Manage Messages
- Hoisted: Yes
- Position: Below @Staff, above @Support

### Member Roles

**@Verified**
- Color: Default
- Permissions: None (just for access control)
- Hoisted: No

**@Server Owner** (for TON618 users who are server owners)
- Color: `#F1C40F` (Gold)
- Permissions: None
- Hoisted: No

**@Developer** (for those interested in contributing)
- Color: `#9B59B6` (Purple)
- Permissions: None
- Hoisted: No

## Channel Structure

### 📋 INFORMATION Category

**#📢-announcements**
- Purpose: Official TON618 updates, releases, features
- Permissions: Staff can post, everyone can read
- Slowmode: None
- Settings: Announcement channel (users can follow)

**#📖-documentation**
- Purpose: Links to docs, quick start guides, FAQs
- Permissions: Staff can post, everyone can read
- Pinned Messages:
  - Quick Start Guide link
  - Deployment Guide link
  - Discord App Setup link
  - GitHub repository link

**#📜-changelog**
- Purpose: Detailed version history and changes
- Permissions: Staff can post, everyone can read
- Format: One message per version with embed

**#❓-faq**
- Purpose: Common questions and answers
- Permissions: Staff can post, everyone can read
- Use Discord Forum channel type
- Tags: Setup, Deployment, Features, Troubleshooting

### 🎫 SUPPORT Category

**#🎫-create-ticket**
- Purpose: Ticket creation panel
- Permissions: Everyone can read, only bot can post
- Content: TON618 ticket panel for support requests
- Setup: Run `/setup tickets panel` here

**#💬-general-help**
- Purpose: Quick questions that don't need tickets
- Permissions: Everyone can read/send
- Slowmode: 5 seconds
- Guidelines pinned

**#🔧-setup-help**
- Purpose: Help with initial bot setup
- Permissions: Everyone can read/send
- Slowmode: 5 seconds

**#🚀-deployment-help**
- Purpose: Help with hosting and deployment
- Permissions: Everyone can read/send
- Slowmode: 5 seconds

### 💡 COMMUNITY Category

**#💬-general**
- Purpose: General discussion about Discord ops, staff management
- Permissions: Verified members can read/send
- Slowmode: 3 seconds

**#🎨-showcase**
- Purpose: Users share their TON618 setups, configs, workflows
- Permissions: Verified members can read/send
- Slowmode: 30 seconds
- Use Forum channel with tags: Config, Workflow, Integration

**#💡-suggestions**
- Purpose: Feature requests and improvement ideas
- Permissions: Verified members can read/send
- Slowmode: 60 seconds
- Use Forum channel with tags: Feature, Improvement, Bug

**#🤝-partnerships**
- Purpose: Partnership and collaboration opportunities
- Permissions: Server Owner role can read/send
- Slowmode: 120 seconds

### 🛠️ DEVELOPMENT Category
(Optional - only if you want community contributions)

**#💻-development**
- Purpose: Technical discussions, contributions
- Permissions: Developer role can read/send
- Slowmode: 5 seconds

**#🐛-bug-reports**
- Purpose: Detailed bug reports with reproduction steps
- Permissions: Everyone can read/send
- Slowmode: 60 seconds
- Use Forum channel with tags: Critical, High, Medium, Low, Fixed

**#🔄-pull-requests**
- Purpose: Discussion of GitHub PRs and contributions
- Permissions: Developer role can read/send

### 🔒 STAFF Category
(Hidden from regular members)

**#📊-staff-chat**
- Purpose: Internal staff coordination
- Permissions: Staff only

**#📈-analytics**
- Purpose: Server stats, bot usage metrics
- Permissions: Staff only

**#🔔-alerts**
- Purpose: Webhook alerts from GitHub, hosting, etc.
- Permissions: Staff only

**#🗑️-mod-logs**
- Purpose: Moderation actions log
- Permissions: Staff only

## Verification Setup

Use TON618's built-in verification system:

1. Create **#verify** channel
2. Run `/verify setup`
   - Channel: #verify
   - Role: @Verified
   - Mode: Button (one-click)
3. Set @Verified role as requirement to see most channels

## Welcome Message

Create **#welcome** channel with:

```
👋 Welcome to TON618 Support!

**TON618** is an ops console for Discord staff teams - professional ticket management, SLA tracking, live playbooks, and incident mode.

**🚀 Getting Started**
• Read <#documentation> for setup guides
• Check <#faq> for common questions
• Create a ticket in <#create-ticket> for personalized support

**📋 Server Rules**
1. Be respectful and professional
2. No spam or self-promotion without permission
3. Use appropriate channels for your questions
4. Search before asking - your question might be answered
5. Provide details when asking for help (error messages, screenshots, etc.)

**🎫 Need Help?**
• Quick questions → <#general-help>
• Setup issues → <#setup-help>
• Deployment problems → <#deployment-help>
• Detailed support → Create ticket in <#create-ticket>

Verify in <#verify> to access all channels!
```

## Rules Channel

Create **#rules** channel:

```
📜 **TON618 Support Server Rules**

**1. Respect & Professionalism**
Treat everyone with respect. This is a professional community for Discord operations.

**2. No Spam or Self-Promotion**
Don't spam messages, mentions, or links. No advertising without permission.

**3. Use Appropriate Channels**
Post in the correct channel. Read channel descriptions.

**4. Search Before Asking**
Check <#faq>, <#documentation>, and search the server before asking questions.

**5. Provide Context**
When asking for help, include:
• What you're trying to do
• What you've tried
• Error messages or screenshots
• Your hosting platform

**6. No Piracy or ToS Violations**
Don't share methods to violate Discord ToS or other services.

**7. English Only**
Keep conversations in English for moderation purposes.

**8. Follow Discord ToS**
All Discord Terms of Service and Community Guidelines apply.

**Violations**
• Warning → Timeout → Kick → Ban
• Severe violations = immediate ban

Questions? Create a ticket in <#create-ticket>
```

## Pinned Messages Templates

### #documentation Pinned Message
```
📚 **TON618 Documentation Hub**

**Quick Start**
🔗 [Quick Start Guide](link-to-quickstart)
Get TON618 running in 5 minutes

**Deployment**
🔗 [Deployment Guide](link-to-deployment)
Hosting options from free to production

**Discord Setup**
🔗 [Discord App Setup](link-to-discord-setup)
Configure your bot in Discord Developer Portal

**GitHub**
🔗 [Repository](github-link)
Source code, issues, and contributions

**Need help?** Create a ticket in <#create-ticket>
```

### #general-help Pinned Message
```
💬 **General Help Guidelines**

**Before asking:**
1. Check <#faq> for common questions
2. Read <#documentation> for setup guides
3. Search this channel for similar questions

**When asking for help:**
✅ Describe what you're trying to do
✅ Share error messages (use code blocks)
✅ Mention your hosting platform
✅ Include relevant screenshots

**For complex issues:**
Create a ticket in <#create-ticket> for dedicated support

**Response times:**
We're a community - responses may take time. Be patient!
```

## Server Emojis (Optional)

Upload custom emojis for branding:
- `:ton618:` - Bot logo
- `:ticket:` - Ticket icon
- `:sla:` - SLA/clock icon
- `:playbook:` - Playbook/checklist icon
- `:verified:` - Checkmark for verified users

## Moderation Setup

### AutoMod Rules

**Rule 1: Spam Prevention**
- Block messages with 5+ mentions
- Block messages with 5+ links
- Block repeated messages (3 in 10 seconds)

**Rule 2: Invite Links**
- Block Discord invite links
- Except in #partnerships (with approval)

**Rule 3: Common Scams**
- Block common scam phrases
- Block suspicious links

### Ticket System for Support

Use TON618 itself for support tickets:
1. Run `/setup tickets panel` in #create-ticket
2. Configure categories:
   - General Support
   - Setup Help
   - Bug Report
   - Feature Request
3. Set support role to @Support
4. Configure SLA: 2 hours for first response

## Onboarding Checklist

When launching your support server:

- [ ] Create all channels and categories
- [ ] Set up all roles with correct permissions
- [ ] Configure verification system
- [ ] Post welcome message
- [ ] Post rules
- [ ] Pin documentation links
- [ ] Setup TON618 ticket system
- [ ] Configure AutoMod rules
- [ ] Test ticket creation
- [ ] Invite initial staff members
- [ ] Create initial FAQ posts
- [ ] Post first announcement

## Growth Strategy

### Initial Phase (0-100 members)
- Invite from your existing TON618 users
- Share in Discord server owner communities
- Post in relevant Discord server lists

### Growth Phase (100-1000 members)
- Regular feature announcements
- Showcase user success stories
- Create tutorial videos
- Engage with Discord ops communities

### Maintenance
- Weekly: Review and answer tickets
- Bi-weekly: Update FAQ based on common questions
- Monthly: Post changelog and roadmap updates
- Quarterly: Community feedback survey

## Server Boost Perks (Optional)

If your server gets boosted:

**Level 1 (2 boosts):**
- Custom server invite background
- Better audio quality

**Level 2 (7 boosts):**
- Server banner
- 50 emoji slots
- 1080p streaming

**Level 3 (14 boosts):**
- Custom URL
- 100 emoji slots
- Animated server icon

## Analytics to Track

Monitor these metrics:
- New members per week
- Ticket volume and resolution time
- Most active channels
- Common questions (to add to FAQ)
- Member retention rate

## Next Steps

After setting up your server:
1. Invite TON618 bot
2. Configure ticket system
3. Invite initial staff
4. Create first announcement
5. Share invite link in your TON618 bot's status or website
