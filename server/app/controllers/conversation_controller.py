from CustomModels.model_B import get_chatgpt_response, mimic_conversation as openai_mimic_conversation

def mimic_conversation_controller(conversation_data):
    # Add any additional processing or validation if needed
    response = openai_mimic_conversation(conversation_data)
    return response

def get_gpt_response(text_data):
    return get_chatgpt_response(text_data)


