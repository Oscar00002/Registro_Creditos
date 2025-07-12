import sqlite3

db = 'creditos.db'

def init_db():
    conn = sqlite3.connect(db)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS creditos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente TEXT NOT NULL,
            monto REAL NOT NULL,
            tasa_interes REAL NOT NULL,
            plazo INTEGER NOT NULL,
            fecha_otorgamiento TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def get_connection():
    return sqlite3.connect(db)