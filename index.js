const mineflayer = require('mineflayer');

// إعدادات الاتصال بالسيرفر الجديد
const botOptions = {
    host: 'ameen20131111.aternos.me', // الآيبي الجديد الخاص بك
    port: 18352,                       // المنفذ (Port) الجديد
    username: 'Keeper_Bot',            // اسم البوت داخل السيرفر
    version: '1.12.2'                  // إصدار ماينكرافت الخاص بـ SkyFactory 4
};

let bot;

function createBotInstance() {
    console.log('جاري تشغيل البوت والاتصال بالسيرفر...');
    bot = mineflayer.createBot(botOptions);

    // حدث الدخول الناجح للسيرفر
    bot.on('spawn', () => {
        console.log(`[${bot.username}] دخل السيرفر بنجاح وهو الآن يحافظ على نشاطه!`);
        // تكتيك برمجي: جعل البوت يتحرك أو يقفز كل دقيقة لتفادي الـ AFK Kick
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 60000); 
    });

    // التعامل مع الدردشة (اختياري لقراءة الرسائل)
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        if (message === 'ping') {
            bot.chat('pong!');
        }
    });

    // التعامل مع الطرد أو الخروج المفاجئ (Auto-Reconnect)
    bot.on('end', () => {
        console.log('انقطع الاتصال بالسيرفر. جاري إعادة المحاولة بعد 10 ثوانٍ...');
        setTimeout(() => {
            createBotInstance();
        }, 10000);
    });

    // التعامل مع الأخطاء البرمجية لمنع كراش البوت في Render
    bot.on('error', (err) => {
        console.error('حدث خطأ برميجي في البوت:', err.message);
    });
}

// استدعاء دالة التشغيل
createBotInstance();
