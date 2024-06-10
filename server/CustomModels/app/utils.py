import openai
import json


def load_survey_responses(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)


def generate_training_data_for_model_b(survey_responses, model_a_id):
    training_data = []
    for response in survey_responses:
        gpt_response = openai.Completion.create(
            model=model_a_id,
            prompt=f"Convert this survey response to training data: {json.dumps(response)}\n",
            max_tokens=150
        )
        training_pair = gpt_response.choices[0].text.strip().split(" -> ")
        training_data.append({
            "prompt": training_pair[0],
            "completion": training_pair[1]
        })
    return training_data