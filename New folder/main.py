import os
import sys
import threading
from flask import Flask

# 1. إعداد خادم ويب مصغر لاستقبال نبضات UptimeRobot
app = Flask('')

@app.route('/')
def home():
    return "🚀 Keeper Bot is Alive 24/7!"

def run_web_server():
    # الاستضافات السحابية تمرر البورت تلقائياً عبر متغير بيئة اسمه PORT
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)

# تشغيل خادم الويب في Thread منفصل لكي لا يعطل عمل البوت
threading.Thread(target=run_web_server, daemon=True).start()

# 2. تثبيت الجسر البرمجي وتشغيل بوت ماينكرافت
print("📦 Installing required components inside the container...")
os.system(f"{sys.executable} -m pip install javascript")

from javascript import require, On
mineflayer = require('mineflayer')

# إعدادات الاتصال المباشرة بسيرفر MagmaNode الخاص بك
bot = mineflayer.createBot({
    'host': '91.98.80.233',
    'port': 25752,
    'username': 'Keeper_247',
    'version': '1.21'
})

@On(bot, 'spawn')
def handle_spawn(*args):
    print("✅ [SUCCESS] البوت دخل سيرفر ماينكرافت بنجاح والعداد الآن 1/20!")

@On(bot, 'end')
def handle_end(*args):
    print("⚠️ [WARNING] انقطع الاتصال، جاري إعادة التشغيل تلقائياً...")
    os.system(f"{sys.executable} main.py")

@On(bot, 'error')
def handle_error(err, *args):
    print(f"❌ [ERROR] حدث خطأ في البوت: {err}")