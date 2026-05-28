# BlogSphere 📝
A modern full stack MERN Blogging Platform where users can create posts, comment, and like — built using React.js, Node.js, Express.js, and MongoDB.

---

## 🚀 Live Demo

🌐 **Frontend (Vercel)**
https://blog-sphere-three-black.vercel.app

⚙ **Backend (Railway)**
https://blogsphere-production-45c3.up.railway.app

📂 **GitHub Repository**
https://github.com/Swathi979/BlogSphere

---

## ✨ Features

✅ User Login & Register
✅ JWT Token Authentication
✅ Create / Edit / Delete Blog Posts
✅ Comment Section
✅ Like / Unlike Posts ❤️
✅ Search Posts
✅ Filter by Category
✅ User Profile Page
✅ Protected Routes
✅ MongoDB Atlas Database
✅ Responsive UI

---

## 🛠 Tech Stack

**Frontend**
- React.js
- React Router DOM
- Context API
- Custom CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Auth**
- JWT (jsonwebtoken)
- bcryptjs

**Deployment**
- Vercel (Frontend)
- Railway (Backend)
- MongoDB Atlas (Database)


## ⚙ How It Works

### 👤 User Flow
1. User registers / logs in to the application
2. Posts are fetched dynamically from MongoDB
3. User can:
   - Create, Edit, Delete their own blog posts
   - Add comments on any post
   - Like / Unlike posts ❤️
   - Search and filter posts by category
4. All data is stored in MongoDB Atlas
5. JWT token handles secure authentication

### ✍ Author Flow
1. Author logs in using their account
2. Author can:
   - Create new blog posts
   - Edit their own posts
   - Delete their own posts
   - Delete their own comments
3. Posts are saved into MongoDB
4. Frontend automatically updates using API calls

---

## 📂 Project Structure

```bash
BlogSphere/
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── PostCard.js
│       │   └── CommentSection.js
│       ├── pages/
│       │   ├── HomePage.js
│       │   ├── LoginPage.js
│       │   ├── RegisterPage.js
│       │   ├── PostDetail.js
│       │   ├── CreatePost.js
│       │   ├── EditPost.js
│       │   └── ProfilePage.js
│       ├── context/
│       │   └── AuthContext.js
│       ├── App.js
│       └── index.js
│
└── server/
    ├── models/
    │   ├── User.js
    │   ├── Post.js
    │   └── Comment.js
    ├── routes/
    │   ├── auth.js
    │   ├── posts.js
    │   └── comments.js
    ├── controllers/
    │   ├── authController.js
    │   ├── postController.js
    │   └── commentController.js
    ├── middleware/
    │   └── auth.js
    ├── server.js
    └── .env
```

---

## 🔌 API Endpoints

### Auth `/api/auth/`
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| POST | /register | Public | Register new user |
| POST | /login | Public | Login, get token |
| GET | /me | Private | Get current user |
| PUT | /profile | Private | Update bio |

### Posts `/api/posts/`
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| GET | / | Public | Get all posts |
| POST | / | Private | Create a post |
| GET | /:id | Public | Get single post |
| PUT | /:id | Private+Owner | Edit post |
| DELETE | /:id | Private+Owner | Delete post |
| POST | /:id/like | Private | Toggle like |

### Comments `/api/comments/`
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| GET | /:postId | Public | Get post comments |
| POST | /:postId | Private | Add comment |
| DELETE | /:id | Private+Owner | Delete comment |

---

## ⚡ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Swathi979/BlogSphere.git
cd BlogSphere
```

### 2️⃣ Install Backend Dependencies
```bash
cd server
npm install
```

### 🔑 Environment Variables
Create `.env` file inside `server` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

### 3️⃣ Install Frontend Dependencies
```bash
cd client
npm install
```

### ▶ Run Project

**Start Backend**
```bash
cd server
npm run dev
```

**Start Frontend**
```bash
cd client
npm start
```

✅ App opens at `http://localhost:3000`
✅ API runs at `http://localhost:5000`

---

## 🌍 Deployment

| Service | Purpose |
|---------|---------|
| Vercel | Frontend (client/) |
| Railway | Backend (server/) |
| MongoDB Atlas | Database |

---

## 📌 Future Improvements

- Dark Mode 🌙
- Image Upload for posts
- Rich Text Editor
- Email Notifications
- Follow / Unfollow Users
- Bookmark Posts
- Admin Dashboard

---

## 👩‍💻 Author

**A T Swathi**
GitHub: https://github.com/Swathi979


