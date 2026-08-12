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

    client.on('spawn', () => {
        console.log('🎮 البوت دخل عالم اللعبة بنجاح!');
        
        setInterval(() => {
            try {
                client.queue('text', {
                    type: 'chat',
                    needs_translation: false,
                    source_name: client.username,
                    xuid: '',
                    platform_chat_id: '',
                    message: 'I am active!'
                });
            } catch (e) {}
        }, 30000);
    });

    // طباعة تفاصيل الخطأ كاملاً لمعرفة سبب الرفض
    client.on('error', (err) => {
        console.log('❌ تفاصيل خطأ الاتصال:', err);
    });

    client.on('close', () => {
        console.log('⚠️ انقطع اتصال البوت، سيتم إعادة المحاولة خلال 10 ثوانٍ...');
        setTimeout(connectBot, 10000);
    });
}
