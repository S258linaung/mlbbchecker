// bot.js - အရမ်းရိုးရှင်းအောင်
const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('8415346626:AAGXRsQclRjeKnoLn1sGX5NzfAySQyO-V9k');

bot.start((ctx) => {
    ctx.reply('Send: GameID/ServerID\nExample: 772413599/12350');
});

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
    
    ctx.sendChatAction('typing');
    
    try {
        // တိုက်ရိုက် original API ကိုခေါ်မယ်
        const response = await axios.get(
            `https://cekidml.caliph.dev/api/validasi?id=${gameId}&serverid=${serverId}`,
            { timeout: 10000 }
        );
        
        const data = response.data;
        
        if (data.status === 'success' && data.result) {
            const profile = data.result;
            ctx.reply(
                `✅ Profile Found!\n\n` +
                `👤 Nickname: ${profile.nickname}\n` +
                `🌍 Country: ${profile.country || 'N/A'}\n` +
                `🆔 Game ID: ${gameId}\n` +
                `🔧 Server ID: ${serverId}`
            );
        } else {
            ctx.reply('❌ Profile not found');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
        ctx.reply('❌ Error checking profile');
    }
});

bot.launch();
console.log('Bot started!');
