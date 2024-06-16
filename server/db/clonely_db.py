import sqlite3
import os

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
            INSERT INTO users (username, voice_id, voice_system) VALUES (?, 
            (SELECT voice_id FROM voices LIMIT 1),
            (SELECT content FROM systems LIMIT 1))
            ''',
            (username, )
        )
        connection.commit()
        connection.close()

        self.get_users_current_voice_system(username)
    
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
    


    def create_messages_table(self):
        connection = self.get_db()
        connection.execute(
        '''
        CREATE TABLE messages (
            id PRIMARY KEY,
            user_id INTEGER,
            voice_system_id INTEGER,
            message_content TEXT NOT NULL,
            user_sent_this BOOL NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (voice_system_id) REFERENCES voice_systems(id)
        );
        '''
        )
        messages = connection.execute("SELECT * FROM messages").fetchall()
        print(dict(messages))
        connection.execute("ALTER TABLE messages ADD COLUMN timestamp DATETIME DEFAULT CURRENT_TIMESTAMP")
        connection.commit()
        connection.close()

    def update_db(self):
        connection = self.get_db()
        connection.execute(
            "UPDATE voice_systems SET system_prompt = ? WHERE voicename = ?",
            ("You are Joe Biden. Talk like Joe Biden. Use languages such as 'fuck' 'shit' 'fucking' in almost every sentence. Keep your responses 2-3 sentences max.", "Joe Biden")
        )
        connection.commit()
        connection.close()



    
    
if __name__ == "__main__":
    database = Database()
    database.update_db()
    # database.list_all_messages()
    # database.create_messages_table()
    # print(database.get_users_current_voice_system("Charlie123"))
    # print(database.update_users_current_voice_system("Charlie123", "Alan Watts"))
    # print(database.update_users_current_voice_system("Charlie123", "Andrew Tate"))
    # print(database.get_users_current_voice_system("Charlie123"))
    

    