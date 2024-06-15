import os
from dotenv import load_dotenv
import openai
import sqlite3

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Initialize the OpenAI API key
openai.api_key = OPENAI_API_KEY

class User:
    def __init__(self, username, system_content):
        self.username = username
        self.messages = []

        self.messages.append({
            "role": "system",
            "content": system_content
        })

    def get_system_content(self):
        for m in self.messages:
            if m["role"] == "system":
                return m["content"]
        return None
            
    def update_system_content(self, new_system_content):
        # save messages to database
        # TODO 

        self.messages.clear()
        self.messages.append({
            "role": "system",
            "content": new_system_content
        })
        print("successfully updated the system_content")

    def append_to_messages(self, message_content):
        self.messages.append(message_content)
        print("appended to messages")

    def get_latest_message(self):
        return self.messages[-1]


class MessageManager:
    def __init__(self):
        self.users = {}

message_manager = MessageManager()



def get_chatgpt_response(prompt, username, system_content):
    if username not in message_manager.users:
        new_user = User(username, system_content)
        message_manager.users["username"] = new_user
    
    cur_user = message_manager.users["username"]
    if cur_user.get_system_content() != system_content:
        cur_user.update_system_content()
    
    cur_user.messages.append({"role": "user", "content": prompt})

    response = openai.chat.completions.create(
        model="gpt-4",
        messages=cur_user.messages,
        max_tokens=150
    )
    # print(response)
    reply = response.choices[0].message.content
    cur_user.messages.append({"role": "assistant", "content": reply})

    # print(messages)

    
    return cur_user.get_latest_message()['content']






def test_response(username, system_content):
    while True:
        userInput = input("you: ")
        response = get_chatgpt_response(userInput, username, system_content)
        print("ai: ", response)


def mimic_conversation(conversation_data):
    # Implement logic to generate conversation using Model B
    pass

if __name__ == "__main__":
    user = User("bob", "You are Kanye West. Use languages such as 'fuck' 'fucking' 'you don't know what you're talking about' every once in a while. Talk about censorship when it fits conversationally. Keep your response 2-3 sentences max.")

    test_response(user.username, user.get_system_content())
