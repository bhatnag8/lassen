# Lassen

**Lassen** is a full-stack AI-powered web app that recommends recipes based on food images. Users can upload a photo of ingredients, confirm detected items, and instantly receive personalized recipes using the Spoonacular API. The app includes secure authentication, password reset, and a clean dark/light UI inspired by Vercel.

---

## 🚀 Features

- 🔎 **AI Ingredient Detection** – Powered by Clarifai's object recognition models
- 🍲 **Recipe Recommendation** – Spoonacular API integration for recipe suggestions
- 📸 **Image Upload Support** – Mobile & desktop file uploads
- ✅ **Ingredient Confirmation UI** – Users can confirm/edit detected items before generating recipes
- 🔐 **Authentication** – JWT-based login, signup, logout
- 🔁 **Password Reset via Email** – Resend integration with styled HTML templates
- 🌗 **Dark/Light Mode** – Toggleable via system or theme preference
- 🖼️ **Responsive UI** – Built with Tailwind CSS + Next.js App Router
- ⚙️ **CI/CD Enabled** – GitHub Actions AWS EC2 (backend) + Vercel (frontend)

---

## 🧱 Tech Stack

### Frontend
- **Framework**: Next.js (v15+ with App Router, TypeScript)
- **Styling**: Tailwind CSS, Radix UI Dropdowns, Lucide Icons
- **State**: useState, useRouter, useSearchParams
- **Dark Mode**: `next-themes`
- **Cookies**: js-cookie for auth token
- **Email Templates**: react-email + resend

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.13
- **Auth**: JWT + bcrypt password hashing
- **Database**: SQLite (users.db)
- **AI Detection**: Clarifai API
- **Recipe Data**: Spoonacular API
- **Email Service**: Resend (password reset)
- **Storage**: `uploads/` folder for user images

### DevOps
- **Frontend Hosting**: Vercel (connected to GitHub)
  - Domain: [lassen.arryan.xyz](https://lassen.arryan.xyz)
- **Backend Hosting**: AWS EC2 (connected to GitHub Actions, Dockerized)
  - Domain: [api.arryan.xyz](https://api.arryan.xyz)
  - SSL enabled via Let's Encrypt
- **CI/CD**:
  - GitHub Actions for backend deployment
  - Vercel auto-deploy on frontend GitHub push

---

## 🛠️ Local Development

### Backend (FastAPI)
```bash
bash backend.sh
```

Environment variables go in `.env` inside the `backend` folder:
```env
CLARIFAI_API_KEY=
SPOONACULAR_API_KEY=
JWT_SECRET_KEY=
RESEND_API_KEY=
```

### Frontend (Next.js)
Disclaimer: `npm` must be installed which can be done by installing `node` at https://nodejs.org/en/download
```bash
bash frontend.sh
```
Add `.env.local` inside the `frontend` folder:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## 🤖 API Overview

- `POST /detect-ingredients`: Returns a list of ingredients from an uploaded image
- `POST /recipes`: Accepts ingredient list and returns Spoonacular recipes
- `POST /signup`, `POST /login`, `POST /logout`
- `POST /forgot-password`, `POST /reset-password`

---

## 🧪 To-Do / Roadmap
- [ ] User-saved recipes
- [ ] Recipe Information/Steps

---

## 📄 License
MIT © Arryan Bhatnagar
