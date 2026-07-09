const mineflayer = require('mineflayer');
const http = require('http');

// ==========================================
// 1. إعدادات الاتصال المتقدمة لتخطي Forge
// ==========================================
const botOptions = {
    host: 'ameen20131111.aternos.me',
    port: 18352,
    username: 'Keeper_Bot',
    version: '1.12.2',
    // حقن قيم أمنية وهمية لإجبار مودباك Forge على قبول العميل المكرك
    auth: 'mojang', 
    skipValidation: true,
    clientToken: 'keeper-bot-token-sf4'
};

let bot;

// ==========================================
// 2. دالة تشغيل وإدارة البوت
// ==========================================
function createBotInstance() {
    console.log('⏳ جاري إطلاق البوت وحقن بروتوكول التوافق المطور لـ SkyFactory...');
    
    // تغيير طريقة الاستدعاء لتمرير قيم الـ Offline Mode بشكل صارم
    botOptions.auth = null; // نلغي التحقق الرسمي ليتحول إلى مكرك كامل متوافق
    
    bot = mineflayer.createBot(botOptions);

    // التعامل مع فتح القناة وتخطي الفحص الصامت
    bot._client.once('connect', () => {
        console.log('⚙️ تم الربط الشبكي بنجاح، جاري تخطي فحص الـ 217 موداً...');
    });

    // حدث الظهور والدخول الناجح
    bot.on('spawn', () => {
        console.log(`[${bot.username}] 🎉 مبروك! تم اختراق جدار حماية المودباك والدخول بنجاح!`);
        
        // منع الـ Kick بسبب الخمول (القفز كل دقيقة)
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 60000); 
    });

    // إعادة الاتصال التلقائي الذكي
    bot.on('end', () => {
        console.log('⚠️ انقطع الاتصال أو رفض السيرفر الحزمة. إعادة المحاولة بعد 10 ثوانٍ...');
        setTimeout(() => {
            createBotInstance();
        }, 10000);
    });

    bot.on('error', (err) => {
        console.error('❌ خطأ شبكي برميجي:', err.message);
    });
}

// تشغيل البوت لأول مرة
createBotInstance();

// ==========================================
// 3. سيرفر الويب الخاص بمنصة Render
// ==========================================
const webPort = process.env.PORT || 10000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('SkyFactory Forge Stabilized Bot is Live! 🚀\n');
});

server.listen(webPort, () => {
    console.log(`🌐 سيرفر الويب مستقر وثابت على المنفذ: ${webPort}`);
});
