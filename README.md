<div align="center">
  <h1>🖼️ ArtSeekers: The AI-Powered Gallery</h1>
  <p><strong>A high-performance museum explorer that bridges classical art and modern engineering.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Status-Production--Ready-success?style=flat-square" alt="Status">
    <img src="https://img.shields.io/badge/Architecture-Full--Stack-blue?style=flat-square" alt="Architecture">
    <img src="https://img.shields.io/badge/AI-Multimodal%20Vision-orange?style=flat-square" alt="AI">
  </p>
</div>

<hr />

## 🌟 Project Overview
**ArtSeekers** is a professional explorer for the **Metropolitan Museum of Art (The MET)** collection. While it started as a collaborative bootcamp project, I have independently refactored its entire core to meet professional standards, focusing on data optimization, advanced AI integrations, and high-end UI responsiveness.

## 🚀 The Engineering Journey (Key Optimizations)

As a Computer Science student, I treated this project as a challenge to solve real-world performance and security issues:

### 1. Breaking the Performance Bottleneck ($O(N+M)$)
Initially, the API struggled with data serialization using nested loops ($O(N \times M)$). I refactored the backend logic to implement **Hash Map (Dictionary) Lookups**, reducing complexity to **Linear Time ($O(N + M)$)**. This resulted in significantly faster page loads for the gallery.

### 2. Giving the App "Eyes" (Multimodal AI)
I integrated the **Qwen-VL Vision LLM** through the Hugging Face API. Unlike basic chatbots, ArtSeekers can actually "see" the artwork. When you ask for an insight, the model analyzes the pixels of the image in real-time to provide context-aware curatorial descriptions.

### 3. Professional Data Engineering (ETL Pipeline)
I developed a custom Python seeder (`popdb.py`) to handle the **Extract, Transform, and Load** process from the MET's public API. It includes:
*   **Throttling:** To respect the museum's server limits.
*   **Data Sanitization:** Filtering out incomplete records (no author or image) to ensure gallery quality.

### 4. Security First (Encryption)
I replaced plain-text storage with **Scrypt Hashing** for passwords. Even if the database were compromised, user credentials remain mathematically protected.

---

## 🛠️ Tech Stack
*   **Frontend:** React.js + Context API (Flux Pattern) + Bootstrap 5.
*   **Backend:** Python 3 + Flask + SQLAlchemy (ORM).
*   **Database:** SQLite (Local Dev) / PostgreSQL (Ready for Production).
*   **AI Engine:** Hugging Face Multimodal Inference API (Qwen-Vision).
*   **Mailing:** EmailJS for secure, bot-proof contact inquiries.

## 📱 User Experience & Design
*   **Museum-Grade UI:** A minimalist "Dark & Gold" theme designed to let the artwork be the protagonist.
*   **Responsive Grid:** Optimized for mobile viewing with a 2-column layout and scrollable metadata containers for long titles.
*   **Session Persistence:** Intelligent JWT hydration that keeps you logged in even after refreshing the page.

---

## ⚙️ Quick Start

```bash
# Clone the repository
git clone https://github.com/Aleska134/Artseekers.git

# Backend Setup
pipenv install
pipenv shell
python src/popdb.py  # Populate the gallery
python src/app.py    # Start the server

# Frontend Setup (New Terminal)
npm install
npm start
<hr />
<div align="center">
<p><i>Developed and optimized with 🧠 and 🎨 by <b>Aleska Braschi</b></i></p>
<a href="https://www.linkedin.com/in/aleska-p-braschi">
<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
</a>
<a href="https://github.com/Aleska134">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
</a>
</div>
</code></pre>
