# LocalPick Backend (Node + Express + MongoDB)

## Prerequisites
- Node.js 18+
- MongoDB running locally or a cloud URI

## Setup
1) Install dependencies  
`npm install`

2) Create an environment file  
`cp .env.example .env` (or create it manually) and set `MONGODB_URI` and `JWT_SECRET`.

3) Start the server  
- Development (auto-reload): `npm run dev`  
- Production: `npm start`

The API defaults to `http://localhost:5000`.

## Endpoints
- `GET /api/health` - quick status check.
- `POST /api/auth/register` - body: `{ name, phone, email, password, role, address }`  
  - Generates a unique `userId` (e.g., `LP-123456`) that can be used to log in.
  - Returns `credentials` containing the `userId` and the submitted password so the UI can show them immediately after signup.
- `POST /api/auth/login` - body: `{ identifier, password }`, where `identifier` is the `userId` or email.  
  - Returns a JWT plus public user info.

Passwords are hashed with bcrypt in storage; the original password is only echoed back in the registration response for display.

## Create an admin user (MongoDB)
1) Set admin env vars in `.env`:
```
ADMIN_NAME=LocalPick Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PHONE=01700000000
ADMIN_PASSWORD=yourStrongPasswordHere
ADMIN_ADDRESS=HQ
```
2) Run the seeder:
`npm run seed:admin`

This creates an `admin` role account in MongoDB. Use the returned `User ID` or the admin email with the admin password to log in.
