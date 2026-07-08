const express = require('express');
const mineflayer = require('mineflayer');

// 1. تشغيل سيرفر الويب لـ UptimeRobot لمنع النوم السحابي
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('🚀 Node.js Keeper Bot is Alive 24/7!');
});

app.listen(PORT, () => {
    console.log(`📡 Web server is running on port ${PORT}`);
});

// 2. إعداد وتشغيل بوت ماينكرافت الذكي بالسيرفر الجديد
function createBot() {
    console.log('🤖 Connecting Bot using Mineflayer...');
    
    const bot = mineflayer.createBot({
        host: 'ameen20131111.aternos.me', // الآي بي الجديد لـ Aternos
        port: 61614,                      // البورت الجديد الخاص بك
        username: 'Keeper_247',
        version: '1.21',                  // نسخة السيرفر المطابقة
        skipValidation: true
    });

    bot.on('spawn', () => {
        console.log('✅ [SUCCESS] البوت دخل سيرفر ماينكرافت بنجاح كلاعب حقيقي!');
    });

    bot.on('death', () => {
        console.log('💀 [DIED] البوت مات في اللعبة! جاري إعادة الرسبون تلقائياً...');
        bot.respawn();
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ انقطع الاتصال بسبب: ${reason}. جاري إعادة المحاولة بعد 10 ثوانٍ...`);
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => {
        console.log(`❌ حدث خطأ في البوت: ${err.message}`);
    });
}

createBot();
