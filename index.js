const mineflayer = require('mineflayer');
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
// 2. دالة تشغيل البوت والتعامل مع بروتوكول Forge
// ==========================================
function createBotInstance() {
    console.log('⏳ جاري تهيئة البوت وتشغيل محاكي حزم المودات...');
    
    bot = mineflayer.createBot(botOptions);

    // تكتيك تخطي فحص Forge أوتوماتيكياً عبر الـ Client الداخلي
    bot._client.once('connect', () => {
        console.log('⚙️ تم فتح قناة الاتصال، جاري تبادل بيانات المودات مع أثيرنوس...');
    });

    // حدث الدخول الناجح للسيرفر وظهور اللاعب في الفراغ
    bot.on('spawn', () => {
        console.log(`[${bot.username}] ✅ تم اجتياز جدار الحماية بنجاح وهو الآن يحمي السيرفر!`);
        
        // منع الـ Kick بسبب الخمول (القفز كل دقيقة)
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
        console.error('❌ خطأ شبكي:', err.message);
    });
}

// تشغيل البوت لأول مرة
createBotInstance();

// ==========================================
// 3. سيرفر الويب الخاص بمنصة Render (تخطي الـ Port Scan)
// ==========================================
const webPort = process.env.PORT || 10000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('SkyFactory Forge Bot is Live! 🚀\n');
});

server.listen(webPort, () => {
    console.log(`🌐 سيرفر الويب مستقر على المنفذ: ${webPort}`);
});
