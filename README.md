# Kwon-Yu (Matt's) Dev Blog

A personal portfolio and project tracking blog built with **React** and **Firebase**. 
This site serves as a central hub to document my journey in software engineering, featuring real-time updates on my projects.

## Tech Stack
* **Frontend:** React (Vite), React Router
* **Backend:** Firebase (Firestore & Auth)
* **Styling:** CSS3 (Cyberpunk/Glassmorphism Theme), JetBrains Mono Font
* **Deployment:** GitHub Pages
* **Editor:** React Markdown (Custom split-screen editor)

## Features
* **Dynamic Content:** Blog posts are fetched in real-time from Firestore.
* **Admin Dashboard:** A secure, password-protected route to write, edit, and delete posts.
* **Markdown Support:** Full support for code blocks, bold/italics, and embedded images/GIFs.
* **Cyberpunk UI:** Custom "Glassmorphism" design with a dynamic cursor spotlight effect.
* **Responsive:** Grid-based layout that adapts to mobile and desktop.


## Admin Access
The `/admin` route is protected by Firebase Authentication. Only the specific UID defined in Firestore Security Rules can write or delete posts.

---
*Built by Kwon-Yu Matt Chen*