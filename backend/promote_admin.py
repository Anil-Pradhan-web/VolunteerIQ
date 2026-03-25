import sqlite3

try:
    conn = sqlite3.connect('volunteeriq.db')
    cur = conn.cursor()
    target_id = 'iLNuvSJKVegspIdO1BFFkrJ6PNg1'
    cur.execute("UPDATE users SET role = 'ngo_admin' WHERE id = ?", (target_id,))
    conn.commit()
    conn.close()
    print(f"Successfully promoted user {target_id} to ngo_admin")
except Exception as e:
    print(f"Error: {e}")
