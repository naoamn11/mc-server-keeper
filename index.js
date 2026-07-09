const mineflayer = require('mineflayer');
const http = require('http');

const config = {
    host: 'ameen20131111-bgfc.aternos.me',
    port: 48533,
    username: 'ForgeKeeper_Bot',
    version: '1.20.1'
};

// 🌐 سيرفر الويب الوهمي الخاص بمنصة Render
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Minecraft Forge Keeper is Online!\n');
});
const RENDER_PORT = process.env.PORT || 3000;
server.listen(RENDER_PORT, () => {
    console.log(`🌐 Web Server running on port ${RENDER_PORT}`);
});

function createBotInstance() {
    console.log('⏳ Connecting to Forge Server with advanced channel spoofing...');
    
    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: config.version,
    });

    // 🛠️ حقن بروتوكول Forge المخصص للقنوات المرفوضة في الـ Log
    bot.on('login', () => {
        const client = bot._client;
        
        // القنوات التي اشتكى السيرفر من غيابها في الـ Log الخاص بك
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

        // إرسال حزمة التسجيل للسيرفر برمجياً لإثبات وجود المودات
        try {
            client.write('custom_payload', {
                channel: 'minecraft:register',
                data: Buffer.from(channels.join('\0'), 'utf8')
            });
            console.log('🚀 Forge Channels successfully injected into handshake!');
        } catch (err) {
            console.error('Failed to write forge channels payload:', err.message);
        }
    });

    bot.on('spawn', () => {
        console.log(`✅ [${bot.username}] bypassed the modcheck and spawned successfully!`);
    });

    const afkInterval = setInterval(() => {
        if (bot && bot.entity) {
            bot.chat(`[Keeper] System Secure.`);
        }
    }, 240000);

    bot.on('error', (err) => console.error('❌ Error:', err.message));

    bot.on('end', (reason) => {
        console.log(`⚠️ Disconnected: ${reason}. Reconnecting in 30s...`);
        clearInterval(afkInterval);
        setTimeout(createBotInstance, 30000);
    });
}

createBotInstance();
