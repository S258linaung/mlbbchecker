
const { Telegraf } = require('telegraf');
const axios = require('axios');

// Environment variable ကနေယူမယ်
const BOT_TOKEN = process.env.BOT_TOKEN || '8415346626:AAGXRsQclRjeKnoLn1sGX5NzfAySQyO-V9k';

if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN is missing!');
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Start command
bot.start((ctx) => {
    ctx.reply('🎮 MLBB Profile Checker Bot\n\nSend: GameID/ServerID\nExample: 772413599/12350');
});

// Handle text messages
bot.on('text', async (ctx) => {
    const text = ctx.message.text.trim();
    
    // Check format: 123456789/12345
    const match = text.match(/^(\d+)\/(\d{4,5})$/);
    
    if (!match) {
        if (!text.startsWith('/')) {
            ctx.reply('Format: GameID/ServerID\nExample: 772413599/12350');
        }
        return;
    }
    
    const gameId = match[1];
    const serverId = match[2];
    
    // Show typing action
    ctx.sendChatAction('typing');
    
    try {
        // Call the original MLBB API
        const response = await axios.get(
            `https://cekidml.caliph.dev/api/validasi?id=${gameId}&serverid=${serverId}`,
            { timeout: 10000 }
        );
        
        const data = response.data;
        
        if (data.status === 'success' && data.result) {
            const profile = data.result;
            ctx.reply(
                `✅ *Profile Found!*\n\n` +
                `👤 *Nickname:* ${profile.nickname}\n` +
                `🌍 *Country:* ${profile.country || 'N/A'}\n` +
                `🆔 *Game ID:* ${gameId}\n` +
                `🔧 *Server ID:* ${serverId}`,
                { parse_mode: 'Markdown' }
            );
        } else {
            ctx.reply('❌ Profile not found. Check your IDs.');
        }
        
    } catch (error) {
        console.error('API Error:', error.message);
        ctx.reply('❌ Error checking profile. Try again later.');
    }
});

// Error handling
bot.catch((err, ctx) => {
    console.error('Bot error:', err);
});

// Start bot
bot.launch().then(() => {
    console.log('🤖 MLBB Bot started successfully!');
    console.log('Bot is running as a background worker...');
});

// Handle shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
