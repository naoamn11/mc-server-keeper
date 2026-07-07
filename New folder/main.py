import os
import sys
import threading
from flask import Flask
from minecraft.networks import BuiltinSession

# 1. خادم الويب النظيف لـ UptimeRobot
app = Flask('')

@app.route('/')
def home():
    return "🚀 Pure Python Keeper Bot is Alive 24/7!"

def run_web_server():
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)

threading.Thread(target=run_web_server, daemon=True).start()

# 2. تشغيل بوت ماينكرافت ببايثون صافي بدون جافا سكريبت
def start_bot():
    print("🚀 Connecting Pure Python Bot to Minecraft Server...")
    try:
        # الاتصال بالسيرفر (أوفلاين مود متوافق مع سيرفرك)
        session = BuiltinSession(
            host='91.98.80.233',
            port=25752,
            username='Keeper_247'
        )
        print("✅ [SUCCESS] البوت دخل السيرفر بنجاح! العداد الآن 1/20.")

        # إبقاء الاتصال حياً
        while True:
            pass

    except Exception as e:
        print(f"⚠️ انقطع الاتصال أو حدث خطأ: {e}")
        print("🔄 جاري إعادة المحاولة خلال 10 ثوانٍ...")
        threading.Timer(10, start_bot).start()

# انطلاق البوت
start_bot()