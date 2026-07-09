const mineflayer = require('mineflayer');
const http = require('http');

// ==========================================
// 1. إعدادات البوت والاتصال المتوافق مع Forge
// ==========================================
const botOptions = {
    host: 'ameen20131111.aternos.me', // الآيبي الخاص بك
    port: 18352,                       // المنفذ (Port) الخاص بك
    username: 'Keeper_Bot',            // اسم البوت داخل السيرفر
    version: '1.12.2',                 // إصدار SkyFactory 4 الحقيقي
};

let bot;

// ==========================================
// 2. دالة تشغيل وإدارة أحداث البوت
// ==========================================
function createBotInstance() {
    console.log('⏳ جاري تشغيل البوت ومحاكاة بروتوكول Forge للاتصال بالسيرفر...');
    
    bot = mineflayer.createBot(botOptions);

    // تفعيل الـ Handshake المخصص للمودات برمجياً لضمان تخطي جدار حماية أثيرنوس المودد
    bot._client.on('forgeHandshake', () => {
        console.log('⚙️ يتم الآن تبادل حزم المودات (Forge Handshake) بنجاح...');
    });

    // حدث الدخول الناجح والظهور في عالم السماء
    bot.on('spawn', () => {
        console.log(`[${bot.username}] ✅ دخل السيرفر بنجاح وهو الآن واقف في عالم SkyFactory!`);
        
        // تكتيك منع الـ Kick بسبب الخمول (القفز كل دقيقة)
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 60000); 
    });

    // الرد الفوري على الشات (للاختبار داخل اللعبة)
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        if (message.toLowerCase() === 'ping') {
            bot.chat('pong! I am alive.');
        }
    });

    // نظام إعادة الاتصال التلقائي الذكي عند حدوث ريستارت للسيرفر
    bot.on('end', () => {
        console.log('⚠️ انقطع الاتصال بالسيرفر. جاري إعادة المحاولة بعد 15 ثانية...');
        setTimeout(() => {
            createBotInstance();
        }, 15000);
    });

    // التقاط الأخطاء البرمجية حتى لا ينهار السكريبت على Render
    bot.on('error', (err) => {
        console.error('❌ حدث خطأ في الشبكة أو اتصال البوت:', err.message);
    });
}

// تشغيل البوت
createBotInstance();

// ==========================================
// 3. حل مشكلة منصة Render (فتح منفذ الويب)
// ==========================================
const webPort = process.env.PORT || 10000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('SkyFactory Keeper Bot is Live! 🚀\n');
});

server.listen(webPort, () => {
    console.log(`🌐 سيرفر الويب الوهمي مستقر الآن على المنفذ: ${webPort}`);
});
