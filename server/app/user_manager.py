from db import Database
from flask import jsonify

class UserManager:
    def __init__(self):
        self.database = Database()

    def handle_login(self, username, email):
        print("8"*180)
        print(username)
        print("9"*180)
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