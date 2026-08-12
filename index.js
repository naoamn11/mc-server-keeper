const express = require('express');
const bedrock = require('bedrock-protocol');

const app = express();
const PORT = process.env.PORT || 10000;

// خادم ويب بسيط لـ Render و UptimeRobot
app.get('/', (req, res) => {
    res.send('Minecraft Bedrock Bot is active and running!');
});

app.listen(PORT, () => {
    console.log(`Web server is running on port ${PORT}`);
    connectBot();
});

function connectBot() {
    console.log('جاري محاولة الاتصال بالسيرفر...');

    const client = bedrock.createClient({
        host: 'ameen20131111-Y522.aternos.me',
        port: 34416,
        username: 'AternosBot247',
        offline: true,
        skipPing: true
    });

    client.on('join', () => {
        console.log('✅ نجح اتصال البوت بسيرفر ماين كرافت!');
    });

    // إرسال تفاعل دوري لمنع طرد البوت بسبب الخمول
    client.on('spawn', () => {
        console.log('🎮 البوت دخل عالم اللعبة بنجاح، جارٍ تفعيل الحماية من الطرد...');
        
        // إرسال حركة بسيطة أو رسالة كل 30 ثانية لتأكيد النشاط
        setInterval(() => {
            try {
                // محاولة إرسال أمر أو حركة إن أمكن، أو إبقاء الاتصال نشطاً
                client.queue('text', {
                    type: 'chat',
                    needs_translation: false,
                    source_name: client.username,
                    xuid: '',
                    platform_chat_id: '',
                    message: 'I am active!' // رسالة في الشات لتأكيد أنه غير خامل (يمكنك حذفها لاحقاً)
                });
            } catch (e) {
                // تجاهل الأخطاء البسيطة لكي لا يتوقف السكريبت
            }
        }, 30000);
    });

    client.on('error', (err) => {
        console.log('❌ حدث خطأ في الاتصال:', err);
    });

    client.on('close', () => {
        console.log('⚠️ انقطع اتصال البوت، سيتم إعادة المحاولة خلال 10 ثوانٍ...');
        setTimeout(connectBot, 10000);
    });
}
