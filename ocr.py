# API_KEY = "sk-69e003e6f58447e78cf80890598d533a"
# import base64
# from openai import OpenAI

# # ================= CONFIG =================
# DEEPSEEK_API_KEY = API_KEY # <-- ТВОЙ КЛЮЧ
# IMAGE_PATH = "image.png"
# OUTPUT_FILE = "index.html"

# client = OpenAI(
#     api_key=DEEPSEEK_API_KEY,
#     base_url="https://api.deepseek.com"
# )

# # ================= HELPERS =================
# def encode_image(path: str) -> str:
#     with open(path, "rb") as f:
#         return base64.b64encode(f.read()).decode("utf-8")

# # ================= PROMPT =================
# PROMPT = """
# Ты — OCR-экстрактор бухгалтерских документов.

# Извлеки ТОЛЬКО HTML-код основной товарной таблицы.
# Структура таблицы фиксирована и не может меняться.

# Используй строго эту схему:

# <table>
#   <thead>
#     <tr>
#       <th rowspan="2">№</th>
#       <th rowspan="2">Наименование, характеристика</th>
#       <th rowspan="2">Номенклатурный номер</th>
#       <th rowspan="2">Единица измерения</th>
#       <th colspan="2">Количество</th>
#       <th rowspan="2">Цена за единицу, KZT</th>
#       <th rowspan="2">Сумма с НДС, KZT</th>
#       <th rowspan="2">Сумма НДС, KZT</th>
#     </tr>
#     <tr>
#       <th>подлежит отпуску</th>
#       <th>отпущено</th>
#     </tr>
#   </thead>
#   <tbody></tbody>
# </table>

# Правила:
# - Заполняй ТОЛЬКО <tbody>
# - Каждая строка = ровно 9 <td>
# - Ничего не выдумывай
# - Если значение отсутствует — <td></td>
# - Если значения в колонках количества совпадают — продублируй их
# - Не выводи ничего кроме <table>...</table>
# """

# # ================= MAIN =================
# def main():
#     image_base64 = encode_image(IMAGE_PATH)

#     response = client.chat.completions.create(
#         model="deepseek-chat",
#         messages=[
#             {
#                 "role": "user",
#                 "content": [
#                     {"type": "text", "text": PROMPT},
#                     {
#                         "type": "image_url",
#                         "image_url": {
#                             "url": f"data:image/png;base64,{image_base64}"
#                         }
#                     }
#                 ]
#             }
#         ],
#         temperature=0,
#         stream=False,
#     )

#     html = response.choices[0].message.content.strip()

#     with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
#         f.write(html)

#     print(f"✅ HTML таблица сохранена в {OUTPUT_FILE}")

# if __name__ == "__main__":
#     main()

# Please install OpenAI SDK first: `pip3 install openai`
import os
from openai import OpenAI

client = OpenAI(api_key="sk-69e003e6f58447e78cf80890598d533a", base_url="https://api.deepseek.com")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello"},
    ],
    stream=False
)

print(response.choices[0].message.content)