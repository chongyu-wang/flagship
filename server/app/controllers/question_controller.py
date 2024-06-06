from CustomModels.model_A_prime import generate_questions as openai_generate_questions

def generate_questions_controller(user_data):
    # Add any additional processing or validation if needed
    questions = openai_generate_questions(user_data)
    return questions
