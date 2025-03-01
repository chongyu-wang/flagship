import sqlite3

def fetch_and_print_data(db_name):
    # Connect to the SQLite database
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Fetch the list of tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    # Iterate through the tables and print their content
    for table_name in tables:
        table_name = table_name[0]
        print(f"TABLE NAME {table_name}")

        # Fetch the column names for the table
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        column_names = [column[1] for column in columns]

        # Fetch all rows from the table
        cursor.execute(f"SELECT * FROM {table_name};")
        rows = cursor.fetchall()

        # Print each row
        for row in rows:
            for content in row:
                print(content)
            print()

    # Close the connection
    conn.close()

if __name__ == "__main__":
    # Database name
    db_name = 'clonely.db'

    # Fetch and print data from the database
    fetch_and_print_data(db_name)
