from db import Database
from Models import ModelAPrime, ModelA
from flask import jsonify
import json

class UserManager:
    def __init__(self):
        self.database = Database()
        self.ModelAPrime = ModelAPrime()
        self.ModelA = ModelA()

    def handle_login(self, username, email):
        if not username:
            return 'error username not provided', 400
        self.database.get_user_by_username(username)
        user_chat_system = self.database.get_users_current_voice_system(username)
        if not user_chat_system:
            user_chat_system = self.database.insert_users_current_voice_system(username)

        return 'successfully logged user to backend', 200

    def switch_chat(self, username, data):
        voicename = data['voice_name']
        self.database.update_users_current_voice_system(username, voicename)
        print("username: ", username, " successfully switched chat to")
        print(data)

    def get_voices(self):
        voices = self.database.list_voices()
        return jsonify({"data": voices})
    
    def get_survey_questions(self, submitData):
        survey_questions = self.ModelAPrime.generate_questions(submitData)
        return survey_questions
    
    def save_answer(self, username, question, answer):
        connection = self.database.get_db()
        connection.execute(
            "INSERT INTO user_answers (username, question, answer) VALUES (?, ?, ?)",
            (username, question, answer)
        )

        connection.commit()
        connection.close()

    def get_all_user_answers(self, username):
        connection = self.database.get_db()
        db_user_answers = connection.execute(
            "SELECT question, answer FROM user_answers WHERE username = ?",
            (username, )
        ).fetchall()

        connection.close()

        user_answers = []
        for answer in db_user_answers:
            user_answers.append(dict(answer))
        
        return json.dumps({"username": username, "user_responses": user_answers})
    
    def get_user_response_for_training(self, username):
        json_answers = self.get_all_user_answers(username)
        answers = json.loads(json_answers)
        user_responses = answers["user_responses"]

        name = ""
        responses = ""
        for response in user_responses:
            if response["question"] == "What is your name?":
                name += f"Person's name: {response['answer']}\n"
            else:
                responses += f"Person's answer to {response['question']}: \n"
                responses += response["answer"]

        return name, name + responses
    
    def get_system_prompt_from_response(self, responses):
        system_prompt = self.ModelA.get_clone_system_prompt(responses)
        return system_prompt
    
    def save_clone(self, system_prompt, username, voice_url):
        pass
            
