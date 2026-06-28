# NoteApi

A RESTful API for a note-taking application built with **Express.js**, **MongoDB (Mongoose)**, and **JWT authentication**.

## Features

- **Authentication** — Register, login, profile management, profile image upload
- **Notes CRUD** — Create, read, update, delete notes with search, filter, sort, and pagination
- **Role-based Authorization** — Admin/user roles (extensible)
- **Image Upload** — Profile images uploaded to Cloudinary via Multer (memory storage)
- **Input Validation** — All inputs validated with Joi schemas
- **Security** — Helmet, CORS, rate limiting (100 req/15min), JSON body size limit (10kb)
- **Error Handling** — Custom `ApiError` class, dedicated 404 handler, global error middleware

## Tech Stack

| Layer        | Technology                     |
| ------------ | ------------------------------ |
| Runtime      | Node.js (ESM)                  |
| Framework    | Express 5                      |
| Database     | MongoDB + Mongoose 9           |
| Auth         | JWT (jsonwebtoken)             |
| Validation   | Joi                            |
| File Upload  | Multer + Cloudinary            |
| Security     | Helmet, cors, express-rate-limit |
| Logging      | Morgan                         |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Cloudinary account (for image upload)

### Installation

```bash
git clone <repo-url>
cd NoteApi
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=3000
DB_URL=mongodb+srv://<user>:<pass>@cluster/noteapp
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
ROUNDS=10
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### Run

```bash
npm run dev    # development (nodemon)
npm start      # production
```

## API Reference

Base URL: `http://localhost:3000/api/v1`

### Auth Routes — `/api/v1/auth`

| Method | Path          | Auth | Description              |
| ------ | ------------- | ---- | ------------------------ |
| POST   | `/register`   | No   | Create account + get JWT |
| POST   | `/login`      | No   | Login + get JWT          |
| GET    | `/me`         | Yes  | Get current user profile |
| PATCH  | `/update-me`  | Yes  | Update username/email    |
| PATCH  | `/upload-img` | Yes  | Upload profile image     |

### Note Routes — `/api/v1/notes`

All endpoints require `Authorization: Bearer <token>` header.

| Method | Path    | Auth | Description                        |
| ------ | ------- | ---- | ---------------------------------- |
| GET    | `/`     | Yes  | List notes (paginated, filterable) |
| GET    | `/:id`  | Yes  | Get note by ID                     |
| POST   | `/`     | Yes  | Create a note                      |
| PATCH  | `/:id`  | Yes  | Update a note (owner only)         |
| DELETE | `/:id`  | Yes  | Delete a note (owner only)         |

### Query Parameters (GET /notes)

| Param      | Type    | Description                                 |
| ---------- | ------- | ------------------------------------------- |
| search     | string  | Search title/content (regex)                |
| category   | string  | Filter: `personal`, `work`, `study`, `other` |
| status     | string  | Filter: `active`, `archived`                |
| sortBy     | string  | Sort field (default: `createdAt`)           |
| order      | `asc`/`desc` | Sort order (default: `desc`)          |
| page       | number  | Page number (default: 1)                    |
| limit      | number  | Items per page (default: 10)                |

## Models

### User

| Field     | Type    | Notes                  |
| --------- | ------- | ---------------------- |
| userName  | String  | Required               |
| email     | String  | Unique, lowercase      |
| password  | String  | Bcrypt-hashed          |
| role      | String  | `user` or `admin`     |
| isLogin   | Boolean | Default: `false`       |
| image     | Object  | `{ secure_url, public_id }` |

### Note

| Field     | Type           | Notes                       |
| --------- | -------------- | --------------------------- |
| title     | String         | Required, trimmed           |
| content   | String         | Required                    |
| category  | String         | `personal`/`work`/`study`/`other` |
| tags      | [String]       | Optional                    |
| status    | String         | `active` or `archived`      |
| isPinned  | Boolean        | Default: `false`            |
| userId    | ObjectId (ref) | Note owner                  |

## Project Structure

```
NoteApi/
  index.js                        -- Entry point
  src/
    app.controller.js             -- Bootstrap (middleware, routes, error handlers)
    DB/
      dbConnection.js             -- Mongoose connection
      Models/
        user.model.js
        note.model.js
    Middlware/
      authentication.middlware.js
      authorization.middlware.js
      validation.middlware.js
    Modules/
      Auth/
        auth.routes.js
        auth.controller.js
        auth.service.js
        auth.validation.js
      Notes/
        note.routes.js
        note.controller.js
        note.service.js
        note.validation.js
    Utils/
      token/token.js
      hashing/hash.js
      ErrorHandling/
        ApiError.js
        globalErrorHandling.js
        notFoundHandler.js
      fileUploading/
        multerCloud.js
        cloudinary.config.js
```

## Deployment

This project includes a `vercel.json` for serverless deployment on Vercel:

```bash
vercel --prod
```
