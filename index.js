// تفعيل طباعة حزم البروتوكول لمعرفة التفاصيل الدقيقة للأخطاء
process.env.DEBUG = 'bedrock-protocol';

const express = require('express');
const bedrock = require('bedrock-protocol');

// 1. تجاوز فحص الإصدارات في المكتبة (Monkey Patching)
try {
    const options = require('bedrock-protocol/src/options');
    const highestProtocol = Math.max(...Object.values(options.Versions));
    
    options.Versions['1.26.40'] = highestProtocol;
    options.Versions['1.26.43'] = highestProtocol;
    console.log(`🔧 تم تحديث مكتبة البروتوكول لدعم 1.26.40/1.26.43 برقم بروتوكول: ${highestProtocol}`);
} catch (e) {
    console.log('⚠️ تعذر تعديل خيارات المكتبة:', e.message);
}

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
            version: '1.26.40',
            connectTimeout: 30000,
            skipPing: false
        });

        // التعامل مع حزمة المودات والملحقات تلقائياً لتفادي الطرد
        botClient.on('resource_packs_info', (packet) => {
            console.log('📦 استلام حزمة المودات من السيرفر، جاري إرسال الموافقة التلقائية...');
            botClient.write('resource_pack_client_response', {
                response_status: 'completed',
                resourcepackids: []
            });
        });

        botClient.on('join', () => {
            console.log('✅ نجح البوت في الاتصال والتسجيل!');
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
        console.log('❌ خطأ في كود الاتصال:', error.message || error);
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
