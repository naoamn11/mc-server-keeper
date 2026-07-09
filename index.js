const mineflayer = require('mineflayer');
const forgeHandshake = require('minecraft-protocol-forge');
const http = require('http');

// ==========================================
// 1. إعدادات الاتصال بالسيرفر
// ==========================================
const botOptions = {
    host: 'ameen20131111.aternos.me',
    port: 18352,
    username: 'Keeper_Bot',
    version: '1.12.2'
};

let bot;

// ==========================================
// 2. دالة تشغيل وإدارة البوت
// ==========================================
function createBotInstance() {
    console.log('⏳ جاري تهيئة البوت وحقن بروتوكول Forge المطور...');
    
    bot = mineflayer.createBot(botOptions);

    // [الحل السحري] حقن الـ Forge Handshake رسميًا في العميل قبل الاتصال
    forgeHandshake}{(bot._client);

    // حدث الدخول والظهور في السيرفر
    bot.on('spawn', () => {
        console.log(`[${bot.username}] ✅ تم اجتياز فحص المودات والدخول بنجاح إلى SkyFactory!`);
        
        // منع الـ Kick بسبب الخمول
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 60000); 
    });

    // نظام إعادة الاتصال عند الريستارت
    bot.on('end', () => {
        console.log('⚠️ انقطع الاتصال. جاري إعادة المحاولة بعد 15 ثانية...');
        setTimeout(() => {
            createBotInstance();
        }, 15000);
    });

    bot.on('error', (err) => {
        console.error('❌ خطأ في الشبكة:', err.message);
    });
}

// تشغيل البوت
createBotInstance();

// ==========================================
// 3. سيرفر الويب الخاص بمنصة Render
// ==========================================
const webPort = process.env.PORT || 10000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forge Keeper Bot is Running! 🚀\n');
});

server.listen(webPort, () => {
    console.log(`🌐 سيرفر الويب مستقر على المنفذ: ${webPort}`);
});
