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

let botClient = null;

function connectBot() {
    console.log('🔄 جاري محاولة الاتصال بالسيرفر...');

    try {
        botClient = bedrock.createClient({
            host: 'ameen20131111-Y522.aternos.me',
            port: 34416,
            username: 'AternosBot247',
            offline: true,
            connectTimeout: 30000
        });

        // عند نجاح الاتصال المبدئي
        botClient.on('join', () => {
            console.log('✅ نجح البوت في الاتصال بالسيرفر!');
        });

        // عند دخول البوت إلى العالم
        botClient.on('spawn', () => {
            console.log('🎮 البوت متواجد الآن داخل العالم بنجاح.');
        });

        // التقاط أي حزمة قطع اتصال أو طرد توضح السبب
        botClient.on('disconnect', (packet) => {
            console.log('⚠️ تم فصل البوت من قبل السيرفر. التفاصيل:', JSON.stringify(packet));
        });

        botClient.on('kick', (reason) => {
            console.log('❌ تم طرد البوت من السيرفر. السبب:', reason);
        });

        botClient.on('error', (err) => {
            console.log('❌ حدث خطأ في الاتصال:', err.message || err);
        });

        botClient.on('close', () => {
            console.log('🔌 أُغلق الاتصال. سيتم إعادة المحاولة خلال 10 ثوانٍ...');
            setTimeout(reconnect, 10000);
        });

    } catch (error) {
        console.log('❌ خطأ أثناء إنشاء كائن البوت:', error);
        setTimeout(reconnect, 10000);
    }
}

function reconnect() {
    if (botClient) {
        botClient.removeAllListeners();
        botClient = null;
    }
    connectBot();
}
