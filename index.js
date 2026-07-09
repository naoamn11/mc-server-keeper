const mineflayer = require('mineflayer');
const forgePlugin = require('mineflayer-forge').plugin;

// إعدادات الاتصال الخاصة بسيرفرك
const config = {
    host: 'ameen20131111-bgfc.aternos.me',
    port: 48533,
    username: 'ForgeKeeper_Bot',
    version: '1.20.1'
};

function createBotInstance() {
    console.log('⏳ جاري محاولة الاتصال بالسيرفر بروتوكول Forge...');
    
    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: config.version
    });

    // حقن بروتوكول الفورج برمجياً لتخطي حظر المودات
    bot.loadPlugin(forgePlugin);

    // عندما يدخل البوت بنجاح داخل السيرفر
    bot.on('spawn', () => {
        console.log(`✅ البوت [${bot.username}] دخل السيرفر بنجاح وهو الآن يحرس السيرفر!`);
        // يكتب في الشات لطرد الخمول
        bot.chat('Keeper Bot is online and active.');
    });

    // إرسال رسائل دورية كل 4 دقائق لمنع السيرفر من قراءة البوت كخامل (AFK)
    const afkInterval = setInterval(() => {
        if (bot && bot.entity) {
            bot.chat(`[Status] Server Protection Active.`);
        }
    }, 240000);

    // التعامل مع الأخطاء لمنع كراش السكربت
    bot.on('error', (err) => {
        console.error('❌ حدث خطأ في الاتصال:', err.message);
    });

    // إعادة الاتصال التلقائي في حال تم طرد البوت أو إغلاق السيرفر
    bot.on('end', (reason) => {
        console.log(`⚠️ انفصل البوت عن السيرفر بسبب: ${reason}`);
        clearInterval(afkInterval); // إيقاف التوقيت الدوري القديم
        
        console.log('🔄 سيتم إعادة محاولة الاتصال بعد 30 ثانية...');
        setTimeout(() => {
            createBotInstance();
        }, 30000);
    });
}

// تشغيل البوت لأول مرة
createBotInstance();
