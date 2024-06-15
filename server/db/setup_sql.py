import sqlite3

def execute_sql_script(db_name, sql_file):
    # Connect to the SQLite database (or create it if it doesn't exist)
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Read the SQL script from the file
    with open(sql_file, 'r') as file:
        sql_script = file.read()

    # Execute the SQL script
    cursor.executescript(sql_script)

    # Commit the changes and close the connection
    conn.commit()
    conn.close()

if __name__ == "__main__":
    # Database name
    db_name = 'clonely.db'

    # SQL file name
    sql_file = 'new_setup.sql'

    # Execute the SQL script
    execute_sql_script(db_name, sql_file)

    print(f"Executed {sql_file} and created database {db_name} successfully.")
