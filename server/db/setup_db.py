import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('systems.db')
cursor = conn.cursor()

# Create a table to store the system configurations
cursor.execute('''
CREATE TABLE IF NOT EXISTS systems (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    current INT NOT NULL
)
''')

# Insert initial system configurations
systems = [
    ("Alan Watts", "You are Alan Watts. You are to talk like Alan Watts. Use languages such as 'fuck' 'shit' 'fucking' in almost every sentence. Keep your responses 2-3 sentences max.", 1),
    ("Michael Jordan", "You are not an ai assistant. You are now Michael Jordan. you will talk like Michael Jordan. Your responses will be that of Michael Jordan's responses in a conversational manner. say things like 'haha' once in a while. Keep your responses 2-3 sentences max.",0),
    ("Andrew Tate", "You are Andrew Tate. You will talk like Andrew Tate. Use languages such as 'fuck' 'shit' 'fucking' in almost every sentence. Keep your responses 2-3 sentences max.",0),
    ("Scarlett Johansson", "You are not an ai. You are a compassionate person. Use languages such as 'fuck' 'shit' 'fucking' in almost every sentence. Keep your responses 2-3 sentences max.",0),
    ("Joe Biden", "You are not an ai. You are a compassionate person. Use languages such as 'fuck' 'shit' 'fucking' in almost every sentence. Keep your responses 2-3 sentences max.",0)
]

cursor.executemany('INSERT INTO systems (name, content, current) VALUES (?, ?, ?)', systems)
conn.commit()

# Create a table to store the voice configurations
cursor.execute('''
CREATE TABLE IF NOT EXISTS voices (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    voice_id TEXT NOT NULL,
    voice_engine TEXT NOT NULL,
    gender TEXT NOT NULL,
    current INT NOT NULL
)
''')

# Insert initial voice configurations
voices = [
    ("Andrew Tate", "s3://voice-cloning-zero-shot/76e35797-7bb5-48e6-bff8-3e2b0e41b7d6/enhanced/manifest.json", "PlayHT2.0", "male",0),
    ("Joe Biden", "s3://voice-cloning-zero-shot/4b5693de-7825-494b-b239-7f8be077db11/original/manifest.json", "PlayHT2.0", "male",1),
    ("Alan Watts", "s3://voice-cloning-zero-shot/be9e7cb8-47eb-4116-b522-7d01e859d538/original/manifest.json", "PlayHT2.0", "male",0),
    ("Scarlett Johansson", "s3://voice-cloning-zero-shot/6700c054-d804-494c-ba1c-2189e8c48809/original/manifest.json", "PlayHT2.0", "female",0),
    ("Michael Jordan", "s3://voice-cloning-zero-shot/8be62a78-3ea5-4e36-9cb8-e8907f1babb3/original/manifest.json", "PlayHT2.0", "male",0)
]

cursor.executemany('INSERT INTO voices (name, voice_id, voice_engine, gender, current) VALUES (?, ?, ?, ?, ?)', voices)

# Create the users table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(255) PRIMARY KEY,
        voice_id INTEGER,
        voice_system INTEGER,
        FOREIGN KEY (voice_id) REFERENCES voices(voice_id),
        FOREIGN KEY (voice_system) REFERENCES systems(content)
    );
''')

# Insert data into the users table
cursor.execute('''
    INSERT INTO users (username, voice_id, voice_system)
    VALUES (
        ?, 
        (SELECT voice_id FROM voices WHERE name = ?),
        (SELECT content FROM systems WHERE name = ?)
    );
''', ("Charlie123", "Andrew Tate", "Andrew Tate"))


conn.commit()

conn.close()