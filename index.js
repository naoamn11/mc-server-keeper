const express = require('express');
const mineflayer = require('mineflayer');

// 1. تشغيل سيرفر الويب لـ UptimeRobot
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('🚀 Node.js Keeper Bot is Alive 24/7!');
});

app.listen(PORT, () => {
    console.log(`📡 Web server is running on port ${PORT}`);
});

// 2. إعداد وتشغيل البوت الحقيقي
function createBot() {
    console.log('🤖 Connecting Bot using Mineflayer...');
    
    const bot = mineflayer.createBot({
        host: '91.98.80.233',
        port: 25752,
        username: 'Keeper_247',
        version: '1.21',
        skipValidation: true
    });

    bot.on('spawn', () => {
        console.log('✅ [SUCCESS] البوت دخل سيرفر ماينكرافت بنجاح كلاعب حقيقي!');
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ انقطع الاتصال بسبب: ${reason}. جاري إعادة المحاولة بعد 10 ثوانٍ...`);
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => {
        console.log(`❌ حدث خطأ في البوت: ${err.message}`);
    });
}

// انطلاق البوت
createBot();