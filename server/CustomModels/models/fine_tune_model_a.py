import openai
import json


openai.api_key = "your-api-key-here"


with open("../data/survey_responses.json", 'r') as f:
    survey_responses = json.load(f)


training_data = [
    {
        "prompt": f"Convert this survey response to training data: {json.dumps(response)}\n",
        "completion": f"{response['question']} -> {response['answer']}\n"
    }
    for response in survey_responses
]


with open("../data/model_a_training_data.jsonl", "w") as f:
    for item in training_data:
        f.write(json.dumps(item) + "\n")


response = openai.File.create(
    file=open("../data/model_a_training_data.jsonl", "rb"),
    purpose='fine-tune'
)


file_id = response['id']
print(f"File uploaded. ID: {file_id}")


response = openai.FineTune.create(
    training_file=file_id,
    model="gpt-3.5-turbo"
)


fine_tune_id = response['id']
print(f"Fine-tuning started. ID: {fine_tune_id}")

