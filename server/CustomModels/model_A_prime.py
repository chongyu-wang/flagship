'''
SYSTEM PROMPT:

I will give you a description of a person in a json format in the following form
{
name: person's name,
age: some number,
gender: (male, female, or prefer not to say),
primary_reason_for_self_cloning: [tag1, tag2, tag3,...,tagn]
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

{
name: john mcdonald,
age: 80,
gender: male
primary_reason_for_self_cloning: ["legacy", "keeping memories for loved ones", "curiosity"
}
'''


def generate_questions(user_data):
    # Implement logic to generate questions using Model A'
    pass
