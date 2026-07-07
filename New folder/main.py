import os
import sys
import socket
import struct
import threading
import time
from flask import Flask

# 1. خادم الويب الخاص بـ UptimeRobot
app = Flask('')

@app.route('/')
def home():
    return "🚀 Socket-Based Keeper Bot is Alive 24/7!"

def run_web_server():
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)

threading.Thread(target=run_web_server, daemon=True).start()

# 2. حزم بروتوكول ماينكرافت (Minecraft Protocol Helper)
def write_varint(val):
    total = b''
    while True:
        towrite = val & 0x7F
        val >>= 7
        if val:
            towrite |= 0x80
        total += struct.pack('B', towrite)
        if not val:
            break
    return total

def create_packet(packet_id, data):
    header = write_varint(packet_id)
    return write_varint(len(header + data)) + header + data

# 3. دالة الاتصال وإبقاء السيرفر مستيقظاً
def start_socket_bot():
    host = '91.98.80.233'
    port = 25752
    username = 'Keeper_247'
    
    print(f"🚀 Connecting to {host}:{port} via TCP Sockets...")
    
    while True:
        try:
            # إنشاء اتصال TCP
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(15)
            s.connect((host, port))
            
            # 1. حزمة الـ Handshake (Protocol 767 لنسخة 1.21, State 2 للدخول)
            handshake_data = write_varint(767) + write_varint(len(host)) + host.encode('utf-8') + struct.pack('>H', port) + write_varint(2)
            s.send(create_packet(0x00, handshake_data))
            
            # 2. حزمة الـ Login Start
            # لنسخة 1.21 نرسل الاسم والـ UUID (نرسل UUID عشوائي أو فارغ للأوفلاين مود)
            user_bytes = username.encode('utf-8')
            login_start_data = write_varint(len(user_bytes)) + user_bytes + struct.pack('?', False) # No UUID
            s.send(create_packet(0x00, login_start_data))
            
            print("✅ [SUCCESS] البوت اتصل بنجاح وحجز مكان في السيرفر!")
            
            # الحفاظ على الاتصال حياً (Ping Loop)
            while True:
                # استقبال البيانات للحفاظ على الحاوية مستقرة
                data = s.recv(1024)
                if not data:
                    break
                time.sleep(1)
                
        except Exception as e:
            print(f"⚠️ انقطع الاتصال أو السيرفر يعيد التشغيل: {e}")
        
        print("🔄 جاري إعادة المحاولة بعد 10 ثوانٍ...")
        time.sleep(10)

# انطلاق البوت في الخلفية
threading.Thread(target=start_socket_bot, daemon=True).start()

# إبقاء السكربت الرئيسي يعمل
if __name__ == "__main__":
    while True:
        time.sleep(3600)
