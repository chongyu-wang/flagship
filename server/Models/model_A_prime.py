'''
SYSTEM PROMPT:

I will give you a description of a person in a json format in the following form
{
name: person's name,
age: some number,
gender: (male, female, or prefer not to say),
primary_reason: [tag1, tag2, tag3,...,tagn]
}

and you will give me 10 interview questions in a json format  to gauge the person's personality and life story. 
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
name: john mcdonald,
age: 80,
gender: male
primary_reason_for_self_cloning: ["legacy", "keeping memories for loved ones", "curiosity"
}

chatGPT:

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

***THEN SAVE THE QUESTIONS AND ANSWERS TO THE DATABASE***
'''

class ModelAPrime:
    def __init__(self):
        pass

    def generate_questions(self,user_data):
        # Implement logic to generate questions using Model A'
        pass