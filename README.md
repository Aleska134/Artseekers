<div align="center">
  <h1>🖼️ ArtSeekers</h1>
  <p><strong>Full-stack museum explorer for The Met collection with multimodal AI artwork analysis</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Status-Live-success?style=flat-square" alt="Status">
    <img src="https://img.shields.io/badge/Stack-React%20%7C%20Flask%20%7C%20Postgres-blue?style=flat-square" alt="Stack">
    <img src="https://img.shields.io/badge/Hosted%20On-Heroku-430098?style=flat-square&logo=heroku&logoColor=white" alt="Heroku">
    <img src="https://img.shields.io/badge/DB-Neon%20PostgreSQL-00E5FF?style=flat-square" alt="Neon">
    <img src="https://img.shields.io/badge/AI-Multimodal%20Vision-orange?style=flat-square" alt="AI">
  </p>
  <p>
    <a href="https://www.artseekers.dev/"><strong>Live Site</strong></a>
    •
    <a href="#quick-start"><strong>Quick Start</strong></a>
    •
    <a href="#system-design"><strong>System Design</strong></a>
    •
    <a href="#engineering-highlights"><strong>Engineering</strong></a>
  </p>
</div>
---
 
## 🎯 Live Demo
**https://www.artseekers.dev/**
 
---
 
## 🌟 Overview
**ArtSeekers** is a unified **Flask + React** application that explores the **Metropolitan Museum of Art** collection. Flask serves the compiled React production build and handles all REST endpoints under **`/api/...`** (same domain, same origin).
 
**Core capabilities**
- Browse/search artworks from The Met API
- User authentication + favorites (stored in **Neon Postgres**)
- AI-powered artwork interpretation (multimodal vision via Hugging Face)
---
 
## 🧩 System Design
Emphasis: **Flask ↔ Neon PostgreSQL ↔ The Met Museum API** (plus optional AI inference).
 
```mermaid
flowchart TB
  U[User Browser] -->|HTTPS / www.artseekers.dev| HEROKU[Heroku Dyno - Gunicorn WSGI]
 
  subgraph APP[Unified Service - Flask serves React + API]
    UI[React Production Build - /public]
    API[REST API - /api/...]
    HEROKU --> UI
    HEROKU --> API
  end
 
  API -->|SQLAlchemy| DB[(Neon PostgreSQL)]
  API -->|Fetch artwork data| MET[The Met Museum API]
  API -->|Optional AI inference| HF[Hugging Face Inference - Qwen-VL]
```
 
---
 
<details>
<summary><strong>🧪 API Routes (examples)</strong></summary>
All API calls are same-origin under `www.artseekers.dev` and routed internally via `/api/...`.
 
| Route Pattern | Method(s) | Purpose | Integration |
|---|---:|---|---|
| `/api/auth/register` | `POST` | Create account | writes user record to **Neon Postgres** |
| `/api/auth/login` | `POST` | Authenticate | reads from **Neon Postgres** |
| `/api/auth/logout` | `POST` | End session | server-side session/token handling |
| `/api/me` | `GET` | Current user | reads from **Neon Postgres** |
| `/api/artworks` | `GET` | Browse/search artworks | fetches from **The Met API** |
| `/api/artworks/:id` | `GET` | Artwork details | fetches from **The Met API** |
| `/api/favorites` | `GET/POST` | List/add favorites | reads/writes **Neon Postgres** |
| `/api/favorites/:id` | `DELETE` | Remove favorite | deletes from **Neon Postgres** |
| `/api/ai/analyze` | `POST` | Artwork AI analysis | calls **Hugging Face inference** |
</details>
---
 
## 🛠️ Tech Stack
- **Frontend:** React, Bootstrap 5, Context API, Webpack
- **Backend:** Python + Flask, Gunicorn, WSGI, SQLAlchemy
- **DB:** Neon PostgreSQL
- **External:** The Met Museum API, Hugging Face (Qwen-VL), EmailJS
- **Hosting & DNS:** Heroku, Name.com Custom Domain
---
 
## 🚀 Deployment (Current)
- **Heroku** hosts the unified Flask + Gunicorn application:
  - Webpack builds optimized frontend assets into `/public`
  - Flask serves static assets and handles all `/api/...` endpoints under the same origin
  - Configured with `PYTHONPATH=src` and WSGI entrypoint (`wsgi:application`)
- **Neon** provides managed PostgreSQL over SSL
- **Name.com** routes DNS traffic via ANAME (`@`) and CNAME (`www`) to Heroku's DNS targets
---
 
## 📸 Screenshots
### Gallery View
![Gallery](screenshots/web-gallery.png)
 
### AI-Powered Analysis
![AI Analysis](screenshots/web-ai-analysis.png)
 
### Artwork Details
![Details](screenshots/web-details.png)
 
---
 
## 🧠 Engineering Highlights
 
<details>
<summary><strong>1) Performance Optimization: O(N×M) → O(N+M)</strong></summary>
Refactored nested-loop serialization into hash map lookups to reduce latency on large queries.
 
```python
# Before: O(N×M)
for artwork in artworks:
    for metadata in all_metadata:
        if artwork.id == metadata.artwork_id:
            ...
 
# After: O(N+M)
metadata_map = {m.artwork_id: m for m in all_metadata}
for artwork in artworks:
    metadata = metadata_map.get(artwork.id)
    ...
```
</details>
<details>
<summary><strong>2) Multimodal AI Integration (Vision)</strong></summary>
Uses the artwork image + prompt → calls Hugging Face Inference API (Qwen-VL) → returns a curatorial-style explanation. Designed to fail gracefully on slow/failed inference.
</details>
<details>
<summary><strong>3) ETL / Seeding Pipeline</strong></summary>
`popdb.py` loads data from The Met API with validation + throttling + batch processing + error recovery.
</details>
<details>
<summary><strong>4) Security</strong></summary>
Scrypt password hashing + environment-driven configuration (`BACKEND_URL`, `DATABASE_URL`) + JWT-based auth flow.
</details>
---
 
## ⚙️ Quick Start
### Prerequisites
- Python 3.10+
- Node.js + npm
- PostgreSQL database
- Hugging Face API key (for AI features)
### Local setup
```bash
git clone https://github.com/Aleska134/Artseekers.git
cd Artseekers
 
pipenv install
pipenv shell
 
cp .env.example .env
# Set BACKEND_URL, DATABASE_URL, JWT_SECRET, HUGGINGFACE_API_KEY, etc.
 
python src/popdb.py   # optional seeding
python src/app.py
 
npm install
npm run build         # compile frontend assets
```
 
---
 
## 👥 Credits
Originally conceived as a final group project at **4Geeks Academy** (initial MVP with Erika Scott and Jose Dominguez).  
Refactored, optimized, and deployed independently by **Aleska Braschi** (performance tuning, AI integration, security, Neon DB setup, and Heroku deployment).
 
<div align="center">
  <a href="https://www.linkedin.com/in/aleska-p-braschi">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
  <a href="https://github.com/Aleska134">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
</div>
 