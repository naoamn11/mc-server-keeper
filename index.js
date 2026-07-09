const mineflayer = require('mineflayer');
const http = require('http');

const config = {
    host: 'ameen20131111-bgfc.aternos.me',
    port: 48533,
    username: 'ForgeKeeper_Bot',
    version: '1.20.1'
};

// 🌐 سيرفر ويب مستقر للحفاظ على استمرارية الخدمة على Render
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Minecraft Keeper is running clean and stable!\n');
});
const RENDER_PORT = process.env.PORT || 3000;
server.listen(RENDER_PORT, () => {
    console.log(`🌐 Web Server active on port ${RENDER_PORT}`);
});

function createBotInstance() {
    console.log('⏳ Connecting to server with Forge FML Handshake Identity...');
    
    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: config.version,
        // 🔥 السر هنا: إجبار البروتوكول المدمج على تحديد الهوية كـ Forge فوراً
        clientIdentity: {
            clientName: 'forge'
        }
    });

    bot.on('spawn', () => {
        console.log(`✅ [${bot.username}] Connected and spawned inside the server successfully! 🎉`);
        bot.chat('Keeper Bot is now online.');
    });

    // نظام منع الـ AFK لإرسال رسالة شات كل 4 دقائق
    const afkInterval = setInterval(() => {
        if (bot && bot.entity) {
            bot.chat(`[Keeper] Protection Status: Active.`);
        }
    }, 240000);

    bot.on('error', (err) => {
        console.error('❌ Connection Error:', err.message);
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ Disconnected due to: ${reason}. Reconnecting in 30 seconds...`);
        clearInterval(afkInterval);
        setTimeout(createBotInstance, 30000);
    });
}

createBotInstance();
