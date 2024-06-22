import openai
import os
from dotenv import load_dotenv

load_dotenv()

class ModelB:
    def __init__(self):
        self.openai_client = openai
        self.openai_client.api_key = os.getenv('OPENAI_API_KEY')

    def get_chatgpt_response(self, recieved_messages, system_content):
        system_prompt = system_content.get("system_prompt")

        messages = []
        messages.append({"role": "system", "content": system_prompt})
        
        messages += recieved_messages
        for message in messages:
            print(message)

        response = openai.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_tokens=150
        )
        reply = response.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        
        return reply

# Example usage
if __name__ == "__main__":
    model_b = ModelB()
    response = model_b.get_chatgpt_response("Hello, how are you?", "john_doe", "This is the system content.")
    print(response)
