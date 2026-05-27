# BlogSphere 📝

A full-stack blogging platform where users can create posts, interact through comments, and like posts they enjoy.

## Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React 18            |
| Backend    | Node.js + Express   |
| Database   | MongoDB (Mongoose)  |
| Auth       | JWT (jsonwebtoken)  |
| Styling    | Custom CSS          |
| HTTP       | Axios               |

---

## Features

### Authentication
- Register with username, email, password
- Login with JWT token stored in localStorage
- Protected routes (private pages redirect to login)
- Auto-logout on expired token

### Blog Posts
- Create, edit, delete posts (author only)
- View all posts with pagination
- Search posts by keyword
- Filter by category
- Like / unlike posts ❤️

### Comments
- Add comments on any post (logged-in users)
- Delete your own comments
- Real-time comment count on post cards

### User Profile
- View your written posts
- Edit your bio
- See total likes and comments received

---

## Folder Structure

```
BlogSphere/
│
├── server/
│   ├── models/
│   │   ├── User.js          ← Mongoose schema + bcrypt hashing
│   │   ├── Post.js          ← Post schema with likes, tags, categories
│   │   └── Comment.js       ← Comment schema
│   ├── routes/
│   │   ├── auth.js          ← /api/auth/*
│   │   ├── posts.js         ← /api/posts/*
│   │   └── comments.js      ← /api/comments/*
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   └── commentController.js
│   ├── middleware/
│   │   └── auth.js          ← JWT protect + optionalAuth
│   ├── server.js            ← Express app entry point
│   └── .env                 ← Environment variables
│
└── client/
    └── src/
        ├── context/
        │   └── AuthContext.js   ← Global auth state (React Context)
        ├── components/
        │   ├── Navbar.js
        │   ├── PostCard.js
        │   └── CommentSection.js
        ├── pages/
        │   ├── HomePage.js
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   ├── PostDetail.js
        │   ├── CreatePost.js
        │   ├── EditPost.js
        │   ├── ProfilePage.js
        │   └── NotFound.js
        ├── api.js            ← Axios instance with JWT interceptor
        ├── App.js            ← React Router setup
        ├── index.js          ← App entry point
        └── styles.css        ← All styles
```

---

## API Endpoints

### Auth  `POST /api/auth/`
| Method | URL              | Access   | Description        |
|--------|------------------|----------|--------------------|
| POST   | /register        | Public   | Register new user  |
| POST   | /login           | Public   | Login, get token   |
| GET    | /me              | Private  | Get current user   |
| PUT    | /profile         | Private  | Update bio/avatar  |

### Posts  `/api/posts/`
| Method | URL              | Access        | Description          |
|--------|------------------|---------------|----------------------|
| GET    | /                | Public        | Get all posts        |
| POST   | /                | Private       | Create a post        |
| GET    | /:id             | Public        | Get single post      |
| PUT    | /:id             | Private+Owner | Edit post            |
| DELETE | /:id             | Private+Owner | Delete post          |
| POST   | /:id/like        | Private       | Toggle like          |

### Comments  `/api/comments/`
| Method | URL              | Access        | Description          |
|--------|------------------|---------------|----------------------|
| GET    | /:postId         | Public        | Get post comments    |
| POST   | /:postId         | Private       | Add comment          |
| DELETE | /:id             | Private+Owner | Delete comment       |

---

## Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the project
```bash
git clone <your-repo-url>
cd BlogSphere
```

### 2. Backend setup
```bash
cd server
npm install
```

Edit `.env` with your values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogsphere
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
```

Start the server:
```bash
npm run dev     # development (nodemon)
npm start       # production
```

### 3. Frontend setup
```bash
cd client
npm install
npm start
```

App opens at **http://localhost:3000**  
API runs at **http://localhost:5000**

---

## MongoDB Collections

### users
```json
{
  "_id": "ObjectId",
  "username": "arjunreddy",
  "email": "arjun@example.com",
  "password": "<bcrypt hash>",
  "bio": "Developer from Hyderabad",
  "avatar": "",
  "createdAt": "2026-05-26T..."
}
```

### posts
```json
{
  "_id": "ObjectId",
  "title": "My First Blog Post",
  "content": "Full post content...",
  "excerpt": "Short preview...",
  "category": "Technology",
  "tags": ["react", "nodejs"],
  "author": "ObjectId → User",
  "likes": ["ObjectId", "ObjectId"],
  "createdAt": "2026-05-26T..."
}
```

### comments
```json
{
  "_id": "ObjectId",
  "postId": "ObjectId → Post",
  "userId": "ObjectId → User",
  "text": "Great post!",
  "createdAt": "2026-05-26T..."
}
```

---

## What Makes This Portfolio-Ready

1. **Full JWT auth flow** — register → login → protected routes → auto-logout
2. **CRUD with ownership** — only the author can edit/delete their content
3. **Relational data** — Users → Posts → Comments (3 linked collections)
4. **Search + pagination** — real query params on the backend
5. **Like system** — toggle, deduplication, count
6. **Clean folder structure** — models / routes / controllers / middleware separation
7. **React Context + custom hooks** — proper global state management
8. **Axios interceptors** — auto-attach JWT, global 401 handling
9. **Responsive design** — works on mobile and desktop

---

## Deployment (optional)

| Service       | What to deploy  |
|---------------|-----------------|
| Railway / Render | Backend (server/) |
| Vercel / Netlify | Frontend (client/) |
| MongoDB Atlas    | Database         |

Update `MONGO_URI` in `.env` and set `REACT_APP_API_URL` for production.
