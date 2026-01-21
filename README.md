# 🔗 Mini-LinkedIn Clone

A professional networking Single Page Application (SPA) designed to replicate the core features of LinkedIn. This project was built as a deep-dive into the **MERN stack** to master full-stack development and real-time communication.

---

## 🎯 Learning & Engineering Objectives

The primary goal of this project was to master industry-standard backend architecture and data flow. Key concepts explored include:

* **REST API Architecture**: Understanding how to structure endpoints and handle the request-response lifecycle.
* **Data Parsing & Validation**: Managing incoming JSON data and ensuring data integrity using Mongoose schemas.* **Advanced Error Handling**: Implementing global error-handling middleware to provide clean, meaningful feedback to the frontend.
* **Authentication & Security**: Mastering JWT (JSON Web Tokens), Bcrypt for password hashing, and secure HTTP-Only cookie management.
* **Data Modeling**: Designing complex MongoDB models with relationships (User, Post, Notification, and Connection schemas).

---

## 🚀 Key Features

### 👤 Professional Profile Management
* **Secure Auth**: Account system using JWT and HTTP-only cookies.
* **Profile Building**: Custom profiles including **Headline, Profile, Bio, Experience, Education, and Skills**.
* **Dynamic Updates**:Profile editing and persistence.

### 📝 Social Engagement (Real-Time)
* **Post Engine**: Create and share professional updates.
* **Instant Interactions**: Likes and Comments updated instantly via **Socket.io** for a seamless experience.
* **Global Search**: Find colleagues by name or username, headline.

### 🤝 Networking & Connections
* **Connection Lifecycle**: Send, receive, and manage invitations.
* **Network Dashboard**: A dedicated page to manage connections and pending requests.
* **Smart Discovery**: Suggested Users algorithm to discover unconnected peers.

### 🔔 Notifications
* **Live Alerts**: Real-time socket-driven notifications for engagement and connection events.
* **Activity Hub**: A centralized page to view all professional interactions.

---

## 🛠️ Tech Stack

* **Frontend**: React.js (Vite), Tailwind CSS, Redux Toolkit.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (Mongoose).
* **Real-time**: Socket.io.

---




## 🏗️ How It Works

1.  **Backend Logic**: The server processes requests through a layer of middleware, handles authentication, and interacts with MongoDB.
2.  **Real-Time Flow**: Socket.io creates a persistent connection between the client and server, allowing for instant "pushes" of likes and comments.
3.  **State Management**: Redux Toolkit acts as the "source of truth" on the frontend, ensuring data is consistent across different pages.
4.  **Production Routing**: A `vercel.json` configuration handles SPA rewrites, preventing 404 errors on page refreshes.

---

## 📝 License
This project is for learning and educational purposes and is open-source under the MIT License.