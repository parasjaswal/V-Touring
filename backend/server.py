from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class BookingCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    destination: str
    package: str
    travel_date: str
    num_travelers: int
    message: Optional[str] = None

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    destination: str
    package: str
    travel_date: str
    num_travelers: int
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Routes
@api_router.get("/")
async def root():
    return {"message": "V Touring API - Welcome to our travel services"}

@api_router.post("/bookings", response_model=Booking)
async def create_booking(input: BookingCreate):
    booking_dict = input.model_dump()
    booking_obj = Booking(**booking_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = booking_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    _ = await db.bookings.insert_one(doc)
    return booking_obj

@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings():
    bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for booking in bookings:
        if isinstance(booking['created_at'], str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return bookings

@api_router.post("/contacts", response_model=Contact)
async def create_contact(input: ContactCreate):
    contact_dict = input.model_dump()
    contact_obj = Contact(**contact_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    _ = await db.contacts.insert_one(doc)
    return contact_obj

@api_router.get("/contacts", response_model=List[Contact])
async def get_contacts():
    contacts = await db.contacts.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for contact in contacts:
        if isinstance(contact['created_at'], str):
            contact['created_at'] = datetime.fromisoformat(contact['created_at'])
    
    return contacts

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()