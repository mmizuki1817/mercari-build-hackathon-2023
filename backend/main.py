import json
import os
import logging
import pathlib
import hashlib
from fastapi import FastAPI, Form, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import sqlite3


app = FastAPI()
logger = logging.getLogger("uvicorn")
logger.level = logging.INFO
images = pathlib.Path(__file__).parent.resolve() / "images"
origins = [os.environ.get('FRONT_URL', 'http://localhost:3000')]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET","POST","PUT","DELETE"],
    allow_headers=["*"],
)
sqlpath = pathlib.Path(__file__).parent.resolve() / "sql" / "hackathon.db"
schema_path = pathlib.Path(__file__).parent.resolve() / "sql" / "01_schema.sql"
conn = sqlite3.connect(sqlpath)
with open(schema_path, 'r') as f:
    db = f.read()
cursor = conn.cursor()
cursor.executescript(db)
conn.commit()
conn.close()

@app.get("/")
def root():
    return {"message": "Hello, world!"}

@app.post("/login")
async def login_users(user_id, password):
    conn = sqlite3.connect(sqlpath)
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users")
    existing_id = [row[0] for row in cursor.fetchall()]
    if user_id not in existing_id:
        conn.commit()
        conn.close()
        return("User not exist, please register")
    else:
        cursor.execute("SELECT password FROM users WHERE id = ?", (user_id,))
        correct_password = cursor.fetchone()[0]
        if str(password) == str(correct_password):
            conn.commit()
            conn.close()
            return("Login succeeded")
        else:
            return("Password error")


@app.post("/register")
def add_users(name: str = Form(...), password: str = Form(...)):
    logger.info(f"Received name: {name}, Receive password: {password}")
    conn = sqlite3.connect(sqlpath)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM users ")
    existing_users = [row[0] for row in cursor.fetchall()]
    if name in existing_users:
        return("User already exists")
    else:
        cursor.execute("INSERT INTO users(name, password) VALUES(?, ?)", (name, password))
        conn.commit()
        conn.close()
        return("Registration successful")

@app.post("/balance")
def charge(amount: int):
    conn = sqlite3.connect(sqlpath)
    cursor = conn.cursor()
    cursor.execute("SELECT balance FROM users WHERE name = ?" (user_name,))
    user_balance = cursor.fetchone()[0] + amount
    cursor.execute("UPDATE users SET balance = ? WHERE name = ?", (user_balance, user_name,))
    conn.commit()
    conn.close()
    return ("Recharge successful")







