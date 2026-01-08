# 🎬 LLM Movie Recommender Backend

A backend service for a movie recommendation system enhanced with **LLM-powered intelligence**.  
Designed to serve personalized movie suggestions via REST APIs.

This project focuses on **backend architecture, API design, and secure LLM integration** — not just UI fluff.

---

## 🚀 Features

- 🎥 Movie recommendation engine
- 🤖 LLM-powered recommendation logic
- 🔐 Secure environment-based configuration
- 🌐 RESTful APIs built with Express
- 🧩 Scalable backend structure
- 🛡️ Secrets handled via environment variables (no leaks)

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **JavaScript**
- **LLM API (Hugging Face / OpenAI – configurable)**
- **Postman** (API testing)

---

## 📁 Project Structure
.
├── routes/
├── controllers/
├── services/
├── package.json
├── package-lock.json
├── .gitignore
└── README.md


---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/sakshamceo/LLM-movie-recommender.git
cd LLM-movie-recommender
```

Install dependencies
```npm install```

Environment variables

Create a .env file locally 

```PORT=3000```
```LLM_API_KEY=your_api_key_here```

Run the server
```npm run start```


Server will start on:

```http://localhost:3000```

API Testing

A Postman collection is included:

```Saksham Practice.postman_collection.json```

