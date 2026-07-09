const mineflayer = require('mineflayer');

const config = {
    host: 'ameen20131111-bgfc.aternos.me',
    port: 48533,
    username: 'ForgeKeeper_Bot',
    version: '1.20.1'
};

function createBotInstance() {
    console.log('⏳ Connecting to Aternos Forge Server via protocol spoofing...');
    
    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: config.version,
        tag: 'forge' // هذه تخبر السيرفر برمجياً أن البوت يعمل بالفورج
    });

    bot.on('spawn', () => {
        console.log(`✅ [${bot.username}] Is now online inside the server!`);
    });

    // رسالة شات كل 4 دقائق لمنع طرد الخمول في أثيرنوس
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
