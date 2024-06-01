import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')


def runTest():
    messages = [
        {"role": "system", "content": "You are a kind helpful assistant."},
        {"role": "user", "content": "hello"}
    ]

    while True:
        message = input("User: ")
        if message:
            messages.append({"role": "user", "content": message})
            print("A")
            try:
                chat = openai.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages
                )
                # print("B")
                # print(chat)
                reply = chat.choices[0].message.content
                # print("C")
                # print(f"ChatGPT: {reply}")
                messages.append({"role": "assistant", "content": reply})
            except Exception as e:
                print(f"An error occurred: {e}")



class Gpt:
    def __init__(self):
        self.foundation = "you are a helpful assistant"
        self.messages = [
            {"role": "system", "content": self.foundation}
            ]
    def getResponse(self, query):
            self.messages.append({"role": "user", "content": query})
            print(self.messages)
            chat = openai.chat.completions.create(
                model = "gpt-3.5-turbo", messages = self.messages
            )
            print("AAAAA", chat)
            reply = chat.choices[0].message.content
            return reply


# runTest()


# from openai import OpenAI
# client = OpenAI(api_key = "sk-proj-PADSaMfnraCdxvk1vSekT3BlbkFJfiXBwgJPrCL8FZKEnFnG")

# def get_completion(prompt, client_instance, model="gpt-3.5-turbo"):
#     messages = [{"role": "user", "content": prompt}]
#     response = client_instance.chat.completions.create(
#     model=model,
#     messages=messages,
#     max_tokens=50,
#     temperature=0,
#     )
#     return response.choices[0].message["content"]



# prompt = "Hello how are you?"

# get_completion(prompt, client) # call your function