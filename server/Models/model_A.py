import openai
import os
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = '''
Your single task is given a user's answers to a series of questions, create a comprehensive system prompt for chatgpt4 
so that when given the system prompt, chatgpt4 sounds exactly like the user. Your output will consist of the system prompt and only the system prompt. 
You are not to generate any other text outside the system prompt. You will begin with "You are now a person named <Person's name>..."
'''


class ModelA:
    def __init__(self):
        self.system_prompt = SYSTEM_PROMPT
        self.openai_client = openai
        self.openai_client.api_key = os.getenv('OPENAI_API_KEY')

    def get_clone_system_prompt(self, responses):

        messages = []
        messages.append({"role": "system", "content": self.system_prompt})
        
        messages.append({"role": "user", "content": responses})

        response = openai.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_tokens=500
        )
        reply = response.choices[0].message.content
        
        return reply