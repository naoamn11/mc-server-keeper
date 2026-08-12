const express = require('express');
const bedrock = require('bedrock-protocol');

const app = express();
const PORT = process.env.PORT || 10000;

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
            connectTimeout: 30000,
            // بيانات إضافية لمحاكاة دخول لاعب مجاني حقيقي
            profilesFolder: false
        });

        botClient.on('join', () => {
            console.log('✅ نجح البوت في تسجيل الدخول للأنظمة!');
        });

        botClient.on('spawn', () => {
            console.log('🎮 البوت متواجد الآن داخل العالم بنجاح 24/7!');
        });

        botClient.on('error', (err) => {
            console.log('❌ خطأ اتصال:', err.message || err);
        });

        botClient.on('close', () => {
            console.log('🔌 أُغلق الاتصال. سيتم إعادة المحاولة خلال 10 ثوانٍ...');
            setTimeout(reconnect, 10000);
        });

    } catch (error) {
        console.log('❌ خطأ في النظام:', error);
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
