const mineflayer = require('mineflayer');
const http = require('http'); // استدعاء مكتبة الـ HTTP المدمجة

const config = {
    host: 'ameen20131111-bgfc.aternos.me',
    port: 48533,
    username: 'ForgeKeeper_Bot',
    version: '1.20.1'
};

// 🌐 كود الـ Web Server الوهمي لحل مشكلة بورت Render
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Minecraft Keeper Bot is running perfectly!\n');
});

// Render يرسل البورت تلقائياً في المتغير PORT، وإذا لم يجده يفتح 3000
const RENDER_PORT = process.env.PORT || 3000;
server.listen(RENDER_PORT, () => {
    console.log(`🌐 Web Server is listening on port ${RENDER_PORT} to satisfy Render.`);
});

function createBotInstance() {
    console.log('⏳ Connecting to Aternos Forge Server via protocol spoofing...');
    
    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: config.version,
        tag: 'forge'
    });

    bot.on('spawn', () => {
        console.log(`✅ [${bot.username}] Is now online inside the server!`);
    });

    const afkInterval = setInterval(() => {
        if (bot && bot.entity) {
            bot.chat(`[Keeper] Protection Status: Active.`);
        }
    }, 240000);

    bot.on('error', (err) => {
        console.error('❌ Error:', err.message);
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ Disconnected: ${reason}. Reconnecting in 30s...`);
        clearInterval(afkInterval);
        setTimeout(() => {
            createBotInstance();
        }, 30000);
    });
}

createBotInstance();
