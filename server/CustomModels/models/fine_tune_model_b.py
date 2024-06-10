import openai

openai.api_key = "your-api-key-here"


response = openai.File.create(
    file=open("../data/model_b_training_data.jsonl", "rb"),
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
