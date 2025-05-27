from fastapi import FastAPI, HTTPException  #type: ignore
from pydantic import BaseModel, EmailStr  #type: ignore
from prisma import Prisma
from fastapi.middleware.cors import CORSMiddleware #type: ignore

app = FastAPI()
prisma = Prisma()

app = FastAPI()

origins = [
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

class UserIn(BaseModel):
    name: str
    email: EmailStr

class UserOut(UserIn):
    id: int

    class Config:
        from_attributes = True  # <-- enable from_orm()

@app.on_event("startup")
async def startup():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

@app.post("/users/", response_model=UserOut)
async def create_user(user: UserIn):
    db_user = await prisma.user.create(data=user.dict())
    return UserOut.from_orm(db_user)

@app.get("/users/", response_model=list[UserOut])
async def read_users():
    users = await prisma.user.find_many()
    return [UserOut.from_orm(u) for u in users]

@app.get("/users/{user_id}", response_model=UserOut)
async def read_user(user_id: int):
    user = await prisma.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut.from_orm(user)

@app.put("/users/{user_id}", response_model=UserOut)
async def update_user(user_id: int, user: UserIn):
    db_user = await prisma.user.update(where={"id": user_id}, data=user.dict())
    return UserOut.from_orm(db_user)

@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    await prisma.user.delete(where={"id": user_id})
    return {"detail": "User deleted"}
