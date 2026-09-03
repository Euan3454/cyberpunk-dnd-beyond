# Cyberpunk D&D Beyond

Full-stack Cyberpunk D&D character management app inspired by D&D Beyond.

## Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Redux Toolkit
- **Backend**: Express.js + MongoDB + Mongoose
- **Auth**: JWT-based authentication

## Implemented Features

- User registration/login/profile APIs
- Password reset token flow APIs
- Character CRUD with class, stats, appearance, and essence tracking
- Character comparison endpoint
- Cyberware catalog, filtering, equip/unequip, compatibility/essence validation
- Weapon catalog, filtering, equip/unequip
- Skill tree catalog and prerequisite-aware character learning endpoint
- Quick hack catalog with filtering and success calculation endpoint
- Attack roll and damage calculation endpoints
- Drag-and-drop cyberware equip UX
- Responsive cyberpunk dark-theme UI pages for:
  - Auth
  - Dashboard
  - Character creation wizard
  - Character sheet
  - Cyberware browser
  - Weapons browser
  - Skill trees
  - Quick hacks browser

## Data Coverage

Seed script creates:

- 56 cyberware items
- 120 weapons
- 8 skill trees with 48 total skills
- 55 quick hacks
- 5 character classes
- mock demo user + example characters

## Setup

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed   # requires MongoDB running locally
npm run dev
```

Backend defaults to `http://localhost:4000`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend defaults to `http://localhost:5173` and calls API at `http://localhost:4000/api`.

To override API URL, set:

```bash
VITE_API_URL=http://localhost:4000/api
```

## Scripts

### Backend

- `npm run dev` - start API with nodemon
- `npm run start` - start API
- `npm run seed` - seed database
- `npm test` - run targeted unit tests

### Frontend

- `npm run dev` - start Vite app
- `npm run build` - typecheck and build production bundle

## Demo Seed Credentials

- Email: `demo@cyberpunk.local`
- Password: `demo12345`
