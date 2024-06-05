import openai
import json
from app.utils import load_survey_responses, generate_training_data_for_model_b


openai.api_key = "your-api-key-here"
model_a_id = "ft-your-fine-tuned-model-a-id"


survey_responses = load_survey_responses("../data/survey_responses.json")
model_b_training_data = generate_training_data_for_model_b(survey_responses, model_a_id)


with open("../data/model_b_training_data.jsonl", "w") as f:
    for item in model_b_training_data:
        f.write(json.dumps(item) + "\n")
