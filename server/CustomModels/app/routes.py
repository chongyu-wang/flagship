from flask import request, jsonify, current_app as app
import openai


openai.api_key = "your-api-key-here"


@app.route('/chatgpt', methods=['POST'])
def chatgpt():
    try:
        user_input = request.json.get('input')
        if not user_input:
            return jsonify({"error": "No prompt provided"}), 400


        response = openai.Completion.create(
            model="ft-your-fine-tuned-model-b-id",
            prompt=user_input,
            max_tokens=150
        )


        text = response.choices[0].text.strip()
        return jsonify({"response": text})


    except Exception as e:
        return jsonify({"error": str(e)}), 500
