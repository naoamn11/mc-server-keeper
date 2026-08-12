const express = require('express');
const bedrock = require('bedrock-protocol');

const app = express();
const PORT = process.env.PORT || 10000;

// 1. خادم الويب الأساسي لمنع Render من النوم (تستعمله UptimeRobot)
app.get('/', (req, res) => {
    res.send('Minecraft Bedrock Bot is active and running!');
});

app.listen(PORT, () => {
    console.log(`Web server is running on port ${PORT}`);
    connectBot();
});

// 2. كود الاتصال بسيرفر Aternos Bedrock الخاص بك
function connectBot() {
    console.log('جاري محاولة الاتصال بالسيرفر...');

    const client = bedrock.createClient({
        host: 'ameen20131111-Y522.aternos.me', // عنوان سيرفرك من الصورة
        port: 34416,                         // منفذ سيرفرك من الصورة
        username: 'AternosBot247',           // اسم البوت الذي سيظهر في السيرفر
        offline: true                        // لتجاوز التحقق الرسمي
    });

    client.on('join', () => {
        console.log('✅ نجح اتصال البوت بسيرفر ماين كرافت!');
    });

    client.on('error', (err) => {
        console.log('❌ حدث خطأ في الاتصال:', err);
    });

    client.on('close', () => {
        console.log('⚠️ انقطع اتصال البوت، سيتم إعادة المحاولة خلال 10 ثوانٍ...');
        setTimeout(connectBot, 10000); // إعادة محاولة الدخول تلقائياً إذا فصل السيرفر
    });
}
