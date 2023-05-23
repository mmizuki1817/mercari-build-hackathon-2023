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

@app.get("/users/{user_name}/{password}")
async def get_users(user_name, password):
    conn = sqlite3.connect(sqlpath)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM users")
    existing_users = [row[0] for row in cursor.fetchall()]
    if user_name not in existing_users:
        conn.commit()
        conn.close()
        return("User not exist, please register")
    else:
        cursor.execute("SELECT password FROM users WHERE name = ?", (user_name,))
        correct_password = cursor.fetchone()[0]
        if str(password) == str(correct_password):
            conn.commit()
            conn.close()
            return("Login succeeded")
        else:
            return("Password error")


@app.post("/users")
def add_users(user_name: str = Form(...), password: str = Form(...)):
    logger.info(f"Received name: {user_name}, Receive password: {password}")
    conn = sqlite3.connect(sqlpath)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM users ")
    existing_users = [row[0] for row in cursor.fetchall()]
    if user_name in existing_users:
        return("User already exists")
    else:
        cursor.execute("INSERT INTO users(name, password) VALUES(?, ?)", (user_name, password))
        conn.commit()
        conn.close()
        return("Registration successful")