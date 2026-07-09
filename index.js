const mineflayer = require('mineflayer');
const { customHandshake } = require('@nxg-org/mineflayer-custom-handshake');
const http = require('http');

const config = {
    host: 'ameen20131111-bgfc.aternos.me',
    port: 48533,
    username: 'ForgeKeeper_Bot',
    version: '1.20.1'
};

// 🌐 سيرفر ويب لتجنب إغلاق Render للخدمة
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Minecraft Forge Keeper Live!\n');
});
const RENDER_PORT = process.env.PORT || 3000;
server.listen(RENDER_PORT, () => {
    console.log(`🌐 Web Server running on port ${RENDER_PORT}`);
});

function createBotInstance() {
    console.log('⏳ Connecting to Forge Server via Advanced Custom Handshake Injector...');
    
    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: config.version,
    });

    // 🔥 تفعيل بروتوكول محاكاة الـ Forge المتقدم
    bot.loadPlugin(customHandshake);

    // تسجيل القنوات المطلوبة التي يرفضها السيرفر تلقائياً
    bot.on('inject_handshake', () => {
        const channels = [
            'citadel:main_channel',
            'born_in_chaos_v1:born_in_chaos_v1',
            'obscure_api:obscure_api',
            'curios:main',
            'cataclysm:main_channel',
            'lionfishapi:main_channel',
            'forge:tier_sorting',
            'aquamirae:main',
            'alexsmobs:main_channel',
            'geckolib:main',
            'waystones:network'
        ];
        
        // إجبار السكربت على إرسال القنوات داخل الـ Handshake الحقيقي لـ Forge
        bot.customHandshake.registerChannels(channels);
        console.log('🚀 [Forge Channels Injected] Bypassing Vanilla Check...');
    });

    bot.on('spawn', () => {
        console.log(`✅ [${bot.username}] successfully bypassed Forge modcheck and spawned!`);
        bot.chat('Keeper Bot is active.');
    });

    const afkInterval = setInterval(() => {
        if (bot && bot.entity) {
            bot.chat(`[Keeper] Protection Status: Active.`);
        }
    }, 240000);

    bot.on('error', (err) => {
        console.error('❌ Connection Error:', err.message);
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ Connection closed: ${reason}. Retrying in 30 seconds...`);
        clearInterval(afkInterval);
        setTimeout(createBotInstance, 30000);
    });
}

createBotInstance();
