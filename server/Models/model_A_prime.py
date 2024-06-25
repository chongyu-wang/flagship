SYSTEM_PROMPT =  '''
I will give you a description of a person in a json format in the following form
{
username: <username>
responses: {"answer": <answer>, "question": "What is your name?"}, {"answer": <answer>, "question": "What is your gender?"}, {"answer": <answer>, "question": "When was your date of birth?"}
}

and you will give me 10 interview questions in a json format to gauge the person's personality and life story. 
GIVE ME ONLY THE JSON AND NO OTHER TEXT in the following form 
{
questions: [
"question0", "question1",...,"question9"
]
}

'''

'''
EXAMPLE:
user:

{
username: john123
responses: {"answer": johnsmith, "question": "What is your name?"}, {"answer": male, "question": "What is your gender?"}, {"answer": 2001-12-07, "question": "When was your date of birth?"}
}

chatGPT:

{
"questions": 
[
"Can you share a highlight from your childhood that had a significant impact on who you are today?",
"What inspired you or led you to your chosen career path?",
"Looking back, what do you consider your greatest accomplishment and why?",
"Can you describe a challenging moment in your life and how you overcame it?",
"Who has been the most influential person in your life and in what way did they influence you?",
"What are some hobbies or activities that you enjoy and why?",
"How do you prefer to spend your time with loved ones?",
"Is there a particular event or moment in your life that you wish you could relive? If so, what is it?",
"What lessons have you learned about life that you think are important to pass on to future generations?",
"Looking back at your life, is there anything you would have done differently? Why or why not?"
]
}

'''

import openai
import os
from dotenv import load_dotenv

load_dotenv()


class ModelAPrime:
    def __init__(self):
        self.system_prompt = SYSTEM_PROMPT
        self.openai_client = openai
        self.openai_client.api_key = os.getenv('OPENAI_API_KEY')

    def generate_questions(self, user_data):

        messages = []
        messages.append({"role": "system", "content": self.system_prompt})
        
        messages.append({"role": "user", "content": user_data})

        response = openai.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_tokens=150
        )
        reply = response.choices[0].message.content
        
        return reply