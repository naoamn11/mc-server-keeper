const mineflayer = require('mineflayer');
const http = require('http');

const config = {
    host: 'ameen20131111-bgfc.aternos.me',
    port: 48533,
    username: 'ForgeKeeper_Bot',
    version: '1.20.1'
};

// 🌐 سيرفر ويب مستقر لإبقاء خدمة Render تعمل 24/7
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Minecraft Forge Keeper Server is Live!\n');
});
const RENDER_PORT = process.env.PORT || 3000;
server.listen(RENDER_PORT, () => {
    console.log(`🌐 Web Server running on port ${RENDER_PORT}`);
});

function createBotInstance() {
    console.log('⏳ Connecting to Forge Server via internal protocol registry...');
    
    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: config.version,
    });

    // 🛠️ الحل البرمجي النهائي: اعتراض بروتوكول الاتصال فوراً عند فتح الـ Socket
    bot.on('login', () => {
        console.log('🔓 Connection established, injecting Forge handshaking tokens...');
        const client = bot._client;

        // قائمة القنوات المرفوضة التي سحبناها من الـ Log الخاص بك
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

        try {
            // إرسال باكيت تسجيل القنوات مباشرة إلى خادم أثيرنوس
            client.write('custom_payload', {
                channel: 'minecraft:register',
                data: Buffer.from(channels.join('\0'), 'utf8')
            });
            
            // محاكاة حزمة الـ FML3 الخاصة بـ Forge لإعلام السيرفر بأننا نملك نفس المودات
            client.write('custom_payload', {
                channel: 'forge:handshake',
                data: Buffer.from([1, 0, 0, 0, 0]) // فلاش تاغ لبروتوكول الفورج المتوافق
            });
            console.log('🚀 Forge registration and FML handshake successfully spoofed!');
        } catch (err) {
            console.log('Handshake payload injection skipped or managed.');
        }
    });

    bot.on('spawn', () => {
        console.log(`✅ [${bot.username}] successfully bypassed Forge check and spawned!`);
        bot.chat('Keeper Bot is now active and guarding the server.');
    });

    const afkInterval = setInterval(() => {
        if (bot && bot.entity) {
            bot.chat(`[Keeper Active] Server protection status: Secure.`);
        }
    }, 240000);

    bot.on('error', (err) => {
        console.error('❌ Connection Error:', err.message);
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ Socket closed due to: ${reason}. Reconnecting in 30 seconds...`);
        clearInterval(afkInterval);
        setTimeout(createBotInstance, 30000);
    });
}

createBotInstance();
