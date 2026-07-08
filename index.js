const express = require('express');
const mineflayer = require('mineflayer');

// 1. تشغيل سيرفر الويب لـ UptimeRobot لمنع النوم السحابي
const app = express();
const PORT = process.env.PORT || 10000; // Render يستخدم بورت 10000 بشكل افتراضي

app.get('/', (req, res) => {
    res.send('🚀 Node.js Keeper Bot is Alive 24/7!');
});

app.listen(PORT, () => {
    console.log(`📡 Web server is running on port ${PORT}`);
});

// 2. إعداد وتشغيل بوت ماينكرافت الذكي
function createBot() {
    console.log('🤖 Connecting Bot using Mineflayer...');
    
    const bot = mineflayer.createBot({
        host: '91.98.80.233',  // الآي بي الخاص بسيرفرك
        port: 25752,           // بورت السيرفر الخاص بك
        username: 'Keeper_247',// اسم البوت داخل السيرفر
        version: '1.21',       // نسخة السيرفر المطابقة بالملي
        skipValidation: true
    });

    // حدث يعمل فور دخول البوت بنجاح ورسبنته في العالم
    bot.on('spawn', () => {
        console.log('✅ [SUCCESS] البوت دخل سيرفر ماينكرافت بنجاح كلاعب حقيقي!');
    });

    // لحل مشكلة الموت: عند موت البوت من وحش أو سقوط، يعمل ريسبون تلقائياً في ثانية
    bot.on('death', () => {
        console.log('💀 [DIED] البوت مات في اللعبة! جاري إعادة الرسبون تلقائياً...');
        bot.respawn();
    });

    // نظام الطوارئ: إعادة الاتصال تلقائياً إذا انطفأ السيرفر أو عمل ريستارت
    bot.on('end', (reason) => {
        console.log(`⚠️ انقطع الاتصال بسبب: ${reason}. جاري إعادة المحاولة بعد 10 ثوانٍ...`);
        setTimeout(createBot, 10000); // إنتظار 10 ثوانٍ ثم المحاولة مجدداً
    });

    // صمام أمان لطباعة أي أخطاء برمجية في الكونسل دون توقف السكربت
    bot.on('error', (err) => {
        console.log(`❌ حدث خطأ في البوت: ${err.message}`);
    });
}

// انطلاق البوت لأول مرة
createBot();
