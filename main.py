from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer


models.Base.metadata.create_all(bind=engine)

app = FastAPI(
        title = "Perfume Ecommerce API",
        description = "An ecommerce backend for perfume sample sales",
        versoin = "1.0.0"
)


