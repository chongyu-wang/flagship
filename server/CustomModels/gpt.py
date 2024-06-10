# class Gpt:
#     def __init__(self):
#         self.foundation = "you are a helpful assistant"
#         self.messages = [
#             {"role": "system", "content": self.foundation}
#             ]
#     def getResponse(self, query):
#             self.messages.append({"role": "user", "content": query})
#             print(self.messages)
#             chat = openai.chat.completions.create(
#                 model = "gpt-3.5-turbo", messages = self.messages
#             )
#             print("AAAAA", chat)
#             reply = chat.choices[0].message.content
#             return reply