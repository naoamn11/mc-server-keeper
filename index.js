// 1. تفعيل وضع التشخيص الشبكي في البداية قبل استدعاء المكتبات
process.env.DEBUG = 'bedrock-protocol';

const express = require('express');
const bedrock = require('bedrock-protocol');

// 2. تصحيح خريطة الإصدارات برقم بروتوكول مطبق صحيح (1001)
try {
    const options = require('bedrock-protocol/src/options');
    
    // ربط الإصدارات الحديثة ببروتوكول 1.26.30 المعتمد (1001)
    const validProtocol = options.Versions['1.26.30'] || 1001;
    
    options.Versions['1.26.40'] = validProtocol;
    options.Versions['1.26.43'] = validProtocol;
    
    console.log(`🔧 تم ضبط بروتوكول الإصدارات 1.26.40/1.26.43 على الرقم الصحيح: ${validProtocol}`);
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

        // الاستجابة التلقائية لطلب المودات/Resource Packs من السيرفر
        botClient.on('resource_packs_info', (packet) => {
            console.log('📦 استلام حزمة المودات من السيرفر، جاري إرسال القبول...');
            try {
                botClient.write('resource_pack_client_response', {
                    response_status: 'completed',
                    resourcepackids: []
                });
            } catch (err) {
                console.log('⚠️ خطأ أثناء الرد على حزمة المودات:', err.message);
            }
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
