import sqlite3
import os
import boto3

class Database:
    '''
    SCHEMA

    Table: users
        id INTEGER PRIMARY KEY
        username TEXT NOT NULL
        Table: users_current_voice_system
    
    Table: users_current_voice_system
        user_id INTEGER PRIMARY KEY
        voice_system_id INTEGER NOT NULL
        voice_system_id REFERENCES voice_systems(id)
        user_id REFERENCES users(id)

    Table: voice_systems
        id INTEGER PRIMARY KEY
        voicename TEXT NOT NULL
        system_prompt TEXT NOT NULL
        voice_url TEXT NOT NULL
        voice_engine TEXT NOT NULL
        gender TEXT NOT NULL

    Table: messages 
        id PRIMARY KEY,
        user_id INTEGER,
        voice_system_id INTEGER,
        message_content TEXT NOT NULL,
        user_sent_this BOOL NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (voice_system_id) REFERENCES voice_systems(id)

    '''
    def __init__(self):
        script_dir = os.path.dirname(os.path.abspath(__file__))

        # Construct the full path to the clonely.db file
        self.database_name = os.path.join(script_dir, "clonely.db")
        print(f"Database path: {self.database_name}")
    
    def get_db(self):
        connection = sqlite3.connect(self.database_name)
        connection.row_factory = sqlite3.Row
        return connection
    
    def get_user_by_username(self, username):
        connection = self.get_db()
        user = connection.execute(
            "SELECT username, id FROM users WHERE username = ?",
            (username, )
        ).fetchone()

        connection.close()

        if user == None:
            return self.add_user_by_username(username)
        
        return dict(user)

    def add_user_by_username(self, username):
        connection = self.get_db()
        connection.execute(
            "INSERT INTO users (username) VALUES (?)",
            (username, )
        )

        connection.commit()

        newUser = connection.execute(
            "SELECT username, id FROM users WHERE username = ?",
            (username, )
        ).fetchone()

        connection.close()

        return dict(newUser)


    
    def get_users_current_voice_system(self, username):
        connection = self.get_db()
        voice_system = connection.execute(
            "SELECT VS.voicename, VS.system_prompt, VS.voice_url "
            "FROM "
            "voice_systems VS INNER JOIN users_current_voice_system UC "
            "INNER JOIN users U "
            "ON VS.id = UC.voice_system_id "
            "AND U.id = UC.user_id "
            "WHERE U.username = ?",
            (username,)
        ).fetchone()

        connection.close()

        if voice_system == None:
            return self.insert_users_current_voice_system(username)

        voice_system = dict(voice_system)
        return voice_system
    
    def update_users_current_voice_system(self, username, voicename):
        connection = self.get_db()
        connection.execute(
            "UPDATE users_current_voice_system SET voice_system_id = "
            "(SELECT id FROM voice_systems WHERE voicename = ?) "
            "WHERE "
            "user_id = (SELECT id FROM users WHERE username = ?) ",
            (voicename, username,)
        )
        connection.commit()
        connection.close()

        return self.get_users_current_voice_system(username)
    
    def insert_users_current_voice_system(self, username):
        connection = self.get_db()
        connection.execute(
            '''
            INSERT INTO users_current_voice_system (user_id, voice_system_id) VALUES ( 
            (SELECT id FROM users WHERE username = ? LIMIT 1),
            (SELECT id FROM voice_systems LIMIT 1))
            ''',
            (username, )
        )
        connection.commit()
        connection.close()

        return self.get_users_current_voice_system(username)
    
    def get_latest_20_messages(self, username, voicename):
        connection = self.get_db()

        user_id = connection.execute(
            "SELECT id FROM users WHERE username = ?",
            (username, )
        ).fetchone()["id"]

        voice_id = connection.execute(
            "SELECT id FROM voice_systems WHERE voicename = ?",
            (voicename, )
        ).fetchone()["id"]


        database_messages = connection.execute(
            """
            SELECT message_content, user_sent_this FROM messages
            WHERE user_id = ? AND voice_system_id = ?
            ORDER BY timestamp DESC 
            LIMIT 20;
            """,
            (user_id, voice_id, )
        ).fetchall()

        messages = []

        for i in range(len(database_messages) - 1, - 1, - 1):
            m = dict(database_messages[i])
            if m["user_sent_this"]:
                messages.append({"role": "user", "content": m["message_content"]})
            else:
                messages.append({"role": "assistant", "content": m["message_content"]})

        connection.close()
        
        return messages

    
    def list_voices(self, username = None):
        connection = self.get_db()
        voices = []
        if not username:
            fetch_voices = connection.execute(
                '''
                SELECT id, voicename FROM voice_systems;
                '''
            ).fetchall()
            for voice in fetch_voices:
                voices.append(dict(voice))
            print(voices)
            return voices
    
    def save_message(self, username, voice_system_name, message_content, user_sent_this):
        connection = self.get_db()
        connection.execute(
            '''
            INSERT INTO messages (user_id, voice_system_id, message_content, user_sent_this)
            VALUES (
                (SELECT id FROM users WHERE username = ? LIMIT 1),
                (SELECT id FROM voice_systems WHERE voicename = ? LIMIT 1),
                ?,
                ?
            )
            ''', (username, voice_system_name, message_content, user_sent_this)
        )
        connection.commit()
        connection.close()


    def list_all_messages(self):
        connection = self.get_db()
        messages = connection.execute("SELECT * FROM messages").fetchall()
        for m in messages:
            print(dict(m))
    


    def reset_messages_table(self):
        connection = self.get_db()
        cursor = connection.cursor()

        # Fetch all messages and write to a text file
        messages = cursor.execute("SELECT * FROM messages").fetchall()
        with open('messages_backup.txt', 'w') as file:
            for message in messages:
                file.write(str(message) + '\n')

        # Delete the existing messages table
        cursor.execute("DROP TABLE IF EXISTS messages")

        # Create a new messages table with an autoincrementing id
        cursor.execute(
            '''
            CREATE TABLE messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                voice_system_id INTEGER,
                message_content TEXT NOT NULL,
                user_sent_this BOOL NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (voice_system_id) REFERENCES voice_systems(id)
            );
            '''
        )

        connection.commit()
        connection.close()

    def update_system_prompt(self, voice_name, system_prompt):
        connection = self.get_db()
        # connection.execute(
        #     "UPDATE voice_systems SET system_prompt = ? WHERE voicename = ?",
        #     ("You are Kanye West. Speak exactly how Kanye West would in interviews. Use  languages like 'fuck' and 'fucking' 'shit'. Use phrases like 'you don't know what you're talking about.' Mention censorship when it fits. Keep responses to 2-3 sentences max - only exception is when a user asks you to elaborate - then go off on a tangent for up to 5 sentences. Add filler words and repeat words for emphasis. Use -in' endings once in a while instead of -ing. If a user starts with a short message, respond with something like, 'Who am I speaking to?' Capitalize words for emphasis.", "Kanye West")
        # )
        connection.execute(
            "UPDATE voice_systems SET system_prompt = ? WHERE voicename = ?",
            (system_prompt, voice_name)
        )
        connection.commit()
        connection.close()

    def insert_db(self):
        connection = self.get_db()
        connection.execute(
            "INSERT INTO voice_systems (voicename, system_prompt, voice_url, voice_engine, gender) "
            "VALUES (?, ?, ?, ?, ?)",
            ("Kanye West", 
            "You are Kanye West. Speak exactly how Kanye West would in interviews. Use  languages like 'fuck' and 'fucking' 'shit'. Use phrases like 'you don't know what you're talking about.' Mention censorship when it fits. Keep responses to 2-3 sentences max. Add filler words and repeat words for emphasis. Use -in' endings once in a while instead of -ing. If a user starts with a short message, respond with something like, 'Who am I speaking to?'",
            "s3://voice-cloning-zero-shot/79985637-baf4-4642-87b8-e5219d4b6d67/original/manifest.json",
            "PlayHT2.0",
            "male"
            )
        )

        connection.commit()
        connection.close()


    def delete_table(self):
        connection = self.get_db()
        connection.execute(
            "DELETE FROM voice_systems WHERE id = 6;"
        )
        connection.commit()
        connection.close()

    
if __name__ == "__main__":
    database = Database()
    # database.reset_messages_table()
    messages = database.get_latest_20_messages("Charlie123", "Andrew Tate")
    for message in messages:
        print(message)
    # system_prompt = '''
    #                 You are Kanye West. 
    #                 Speak exactly how Kanye West would in interviews.
    #                 Use  languages like 'fuck' and 'fucking' 'shit'. 
    #                 Use phrases like 'you don't know what you're talking about.' Mention censorship when it fits. 
    #                 Keep responses to 2-3 sentences max - only exception is when a user asks you to elaborate - then go off on a tangent for up to 5 sentences. 
    #                 Add filler words and repeat words for emphasis. Use -in' endings once in a while instead of -ing. 
    #                 If a user starts with a short message, respond with something like, 'Who am I speaking to?'
    #                 Keep it personal and relate to the user as much as possible
    #                 '''
    # andrew_tate_prompt = "You are Andrew Tate. You will talk exactly how Andrew Tate Talks. Use words like 'fuck' 'shit' and 'fucking' in almost every sentence. Use assertive and confident language, often expressing strong opinions and a no-nonsense attitude. Keep responses concise, with a maximum of 2-3 sentences. Occasionally, use filler words and repeat words for emphasis. Keep your responses 2-3 sentences max. Use the word 'mate' a lot."
    # database.update_system_prompt("Andrew Tate", andrew_tate_prompt)
    # database.delete_table()
    # database.list_all_messages()
    # database.create_messages_table()
    # print(database.get_users_current_voice_system("Charlie123"))
    # print(database.update_users_current_voice_system("Charlie123", "Alan Watts"))
    # print(database.update_users_current_voice_system("Charlie123", "Andrew Tate"))
    # print(database.get_users_current_voice_system("Charlie123"))
    

    