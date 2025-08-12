from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()
import os
import stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
from app.database import Base, engine
from app.routes import perfume as perfume_routes
from approutes import checkout as chekout_routes
from app.routes import webook as webhook_routes

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
    return {"message":"Hello from FastAPI!"}

