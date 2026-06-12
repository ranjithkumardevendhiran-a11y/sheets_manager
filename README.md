# Sheets Manager (MERN)

A MERN stack web app where **admins** upload and edit Google Sheet data, and **users** can only view the data in read-only mode.

## Features

- Separate **Admin Login** and **User Login**
- Admin can upload CSV/Excel files exported from Google Sheets
- Admin can import a public Google Sheet via URL (optional, requires API key)
- Admin-only editing: add rows, edit cells, save changes, delete sheets
- Users see the same data in **read-only** mode (no edit controls)
- Role-based API protection on the backend

## Default Admin Account

| Field    | Value |
|----------|-------|
| Email    | `ranjith.kumardevendhiran@tvs.in` |
| Password | `Admin@123` |

Change these in `server/.env` before production.

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

## Setup

```bash
# From project root
npm run install:all

# Start backend + frontend together
npm run dev
```

Or run separately:

```bash
npm run dev:server   # http://localhost:5000
npm run dev:client   # http://localhost:5173
```

## URLs

- Home: http://localhost:5173
- Admin Login: http://localhost:5173/admin/login
- User Login: http://localhost:5173/user/login

## User Registration

Users can register from the User Login page. Only admins are seeded automatically.

## Google Sheet URL Import (Optional)

To import directly from Google Sheets:

1. Make the sheet **public** (Anyone with the link can view)
2. Enable Google Sheets API in Google Cloud Console
3. Create an API key and add to `server/.env`:

```
GOOGLE_API_KEY=your-google-api-key
```

Without this key, admins can still upload CSV/XLSX files exported from Google Sheets.

## Project Structure

```
sheets-manager/
├── client/          # React + Vite frontend
├── server/          # Express + MongoDB backend
├── package.json     # Root scripts
└── README.md
```

## API Overview

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Login (requires role) |
| POST | `/api/auth/register-user` | Public | Register user account |
| GET | `/api/sheets` | Auth | List all sheets |
| GET | `/api/sheets/:id` | Auth | Get sheet data |
| POST | `/api/sheets/upload` | Admin | Upload CSV/Excel |
| POST | `/api/sheets/import-google` | Admin | Import Google Sheet URL |
| PUT | `/api/sheets/:id` | Admin | Update sheet data |
| DELETE | `/api/sheets/:id` | Admin | Delete sheet |

## Security Notes

- Change `JWT_SECRET` and `ADMIN_PASSWORD` in production
- Use HTTPS in production
- Restrict Google API key to Sheets API only
