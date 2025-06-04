import os
from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")

app = FastAPI()