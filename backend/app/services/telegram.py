
import requests
from django.conf import settings
import os

TG_BOT_TOKEN = os.getenv("TG_BOT_TOKEN")
TG_CHAT_ID = os.getenv("TG_CHAT_ID")

def send_telegram_message(name, phone, comment) -> None:
    url = f"https://api.telegram.org/bot{TG_BOT_TOKEN}/sendMessage"
    clean_phone = phone.replace("+", "").replace(" ", "").replace("-", "")

    wa_link = f"https://wa.me/{clean_phone}"

    text = f"""
<b>Новая заявка с сайта</b>

👤 Имя: {name}
📞 Телефон: <a href="{wa_link}">{phone}</a>
📝 Комментарий: {comment}
"""

    payload = {
        "chat_id": TG_CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }

    try:
        response = requests.post(url, json=payload, timeout=5)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Telegram error: {e}")
