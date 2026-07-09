const mineflayer = require('mineflayer');
const http = require('http');

// ==========================================
// 1. إعدادات البوت والاتصال المتوافق مع Forge
// ==========================================
const botOptions = {
    host: 'ameen20131111.aternos.me',
    port: 18352,
    username: 'Keeper_Bot',
    version: '1.12.2',
};

let bot;

// ==========================================
// 2. دالة تشغيل وإدارة أحداث البوت
// ==========================================
function createBotInstance() {
    console.log('⏳ جاري تشغيل البوت وحقن بروتوكول Forge...');
    
    bot = mineflayer.createBot(botOptions);

    // [حقن برميجي حاسم] لتخطي فحص مودات Forge (Modded Handshake)
    bot._client.on('custom_payload', (packet) => {
        if (packet.channel === 'FML|HS' || packet.channel === 'fml:handshake') {
            // البوت يرسل إشارة موافقة تلقائية للسيرفر لتخطي جدار الحماية
            bot._client.write('custom_payload', {
                channel: packet.channel,
                data: packet.data
            });
        }
    });

    // حدث الدخول الناجح
    bot.on('spawn', () => {
        console.log(`[${bot.username}] ✅ تم اختراق جدار الحماية والدخول بنجاح إلى SkyFactory!`);
        
        // منع الـ Kick بسبب الخمول (القفز كل دقيقة)
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 60000); 
    });

    // نظام إعادة الاتصال التلقائي
    bot.on('end', () => {
        console.log('⚠️ انقطع الاتصال. جاري إعادة المحاولة بعد 10 ثوانٍ...');
        setTimeout(() => {
            createBotInstance();
        }, 10000);
    });

    // التقاط الأخطاء البرمجية
    bot.on('error', (err) => {
        console.error('❌ خطأ في الاتصال:', err.message);
    });
}

// تشغيل البوت
createBotInstance();

// ==========================================
// 3. حل مشكلة منصة Render (فتح منفذ الويب)
// ==========================================
const webPort = process.env.PORT || 10000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('SkyFactory Keeper Bot is Bypass Mode! 🚀\n');
});

server.listen(webPort, () => {
    console.log(`🌐 سيرفر الويب الوهمي مستقر على المنفذ: ${webPort}`);
});
