const mineflayer = require('mineflayer');
const http = require('http');

// ==========================================
// 1. إعدادات الاتصال بالسيرفر الجديد (SkyFactory)
// ==========================================
const botOptions = {
    host: 'ameen20131111.aternos.me', // الآيبي الخاص بك
    port: 18352,                       // المنفذ (Port) الجديد
    username: 'Keeper_Bot',            // اسم البوت داخل السيرفر
    version: '1.12.2'                  // إصدار ماينكرافت الخاص بـ SkyFactory 4
};

let bot;

// ==========================================
// 2. دالة بناء وتشغيل البوت الذكي
// ==========================================
function createBotInstance() {
    console.log('⏳ جاري تشغيل البوت والاتصال بالسيرفر...');
    bot = mineflayer.createBot(botOptions);

    // حدث الدخول الناجح للسيرفر
    bot.on('spawn', () => {
        console.log(`[${bot.username}] ✅ دخل السيرفر بنجاح وهو الآن يحافظ على نشاطه!`);
        
        // تكتيك تخطي الـ AFK Kick: قفزة صغيرة كل دقيقة
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 60000); 
    });

    // الرد على رسائل الشات للتأكد من استجابته (الاختبار)
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        if (message.toLowerCase() === 'ping') {
            bot.chat('pong!');
        }
    });

    // نظام التعامل مع الطرد أو انقطاع الاتصال (Auto-Reconnect)
    bot.on('end', () => {
        console.log('⚠️ انقطع الاتصال بالسيرفر. جاري إعادة المحاولة بعد 10 ثوانٍ...');
        setTimeout(() => {
            createBotInstance();
        }, 10000);
    });

    // معالجة الأخطاء لضمان عدم توقف السكريبت على Render
    bot.on('error', (err) => {
        console.error('❌ حدث خطأ في اتصال البوت:', err.message);
    });
}

// تشغيل البوت لأول مرة
createBotInstance();

// ==========================================
// 3. حل مشكلة Render (سيرفر الويب الوهمي)
// ==========================================
const webPort = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Keeper Bot is Active and Running! 🚀\n');
});

server.listen(webPort, () => {
    console.log(`🌐 سيرفر الويب الوهمي يعمل الآن بنجاح على المنفذ: ${webPort}`);
});
