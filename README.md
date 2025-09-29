# 🎉 DS Founder Birthday Wishes Platform

A heartfelt digital tribute platform to celebrate the visionary leadership of the DS Founder by collecting wishes, messages, photos, audio, and video from team, partners, and community.

**🌍 Live Site:** [https://ds-founder-birth-day-wish.netlify.app/](https://ds-founder-birth-day-wish.netlify.app/)

---

## 🧾 About

This platform centralizes **wishes, tributes, and memories** into a single digital hub. Contributors can send their messages in **text, image, audio, or video** format.  

It is designed for **special events like birthdays, anniversaries, and memorials**. The platform ensures that every memory is preserved in an elegant and interactive way.

---

## ✅ Features

- 📝 **Text Wishes** – Custom messages up to 500 words  
- 🖼 **Photo Uploads** – JPEG, PNG, WebP (up to 5MB)  
- 🎤 **Audio Tributes** – Record/upload up to 30 seconds (10MB)  
- 🎥 **Video Tributes** – Record/upload up to 60 seconds (50MB)  
- 📱 **Responsive UI** – Works seamlessly across mobile and desktop  
- 🎉 **Wishes Wall** – Gallery view of all submitted wishes  
- 🔔 **Popup Onboarding** – Encourages participation on first visit  
- ☁️ **Cloud Storage** – Media hosted on Cloudinary for fast delivery  
- 🔐 **Supabase Integration** – Authentication & database management  
- 🛠 **Admin Panel** –  
  - Approve or reject wishes  
  - Highlight special tributes  
  - Moderate inappropriate content  
  - Manage user submissions  

---

## 🖼 Demo & Screenshot

### System Model:
![System Model](https://github.com/thiyo-de/DS_Founder_BD-Wish/blob/main/Model.png)

---

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion  
- **Backend & Database:** Supabase (Auth, Postgres, Functions)  
- **Media Storage:** Cloudinary  
- **Deployment:** Netlify (Frontend)  

---

## 📁 Project Structure

```bash
src/
 ├── components/           # Reusable UI components (Popup, Cards, Buttons, etc.)
 ├── pages/                # Pages (Index, Admin, NotFound)
 ├── integrations/         # Supabase & Cloudinary setup
 ├── hooks/                # Custom hooks (useUpload, useToast, etc.)
 ├── styles/               # Tailwind & global CSS
 └── App.tsx               # Root entry point

public/
 ├── assets/               # Logos, icons, images
 └── index.html

.env                       # Environment variables
package.json               # Dependencies & scripts
vite.config.ts             # Vite configuration
tsconfig.json              # TypeScript config
