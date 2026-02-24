<div align="center">
  <h1>🖼️ ArtSeekers: AI-Powered MET Museum Engine</h1>
  <p><strong>A high-performance Full-Stack platform featuring Multimodal AI and optimized data architectures.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
    <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Vision_AI-FF6F00?style=for-the-badge&logo=huggingface&logoColor=white" alt="AI">
    <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
  </p>
</div>

<hr />

<h2>📖 Project Overview</h2>
<p>
  ArtSeekers is a professional-grade gallery explorer for the <strong>Metropolitan Museum of Art</strong> collection. Originally a group project, I refactored the entire system to meet modern software engineering standards. This version introduces <strong>Computer Vision AI</strong>, an optimized <strong>$O(N+M)$ backend</strong>, and a robust <strong>User Profile Management</strong> system.
</p>

<h2>🧠 Engineering Highlights (CS Focus)</h2>
<p>I focused on solving specific architectural and algorithmic challenges to ensure scalability and performance:</p>

<table>
  <tr>
    <td width="30%"><b>Multimodal AI Integration</b></td>
    <td>Implemented an <b>AI Virtual Curator</b> using the <b>Qwen-Vision LLM</b>. Unlike standard text-based AI, this model performs real-time visual analysis of artwork images via a <b>Hugging Face Multimodal API</b> to provide historical and stylistic insights.</td>
  </tr>
  <tr>
    <td><b>Algorithmic Optimization</b></td>
    <td>Refactored API endpoints to replace $O(N \times M)$ nested loops with <b>Hash Map (Dictionary) Lookups</b>. This reduced time complexity to <b>$O(N + M)$</b> during data serialization, drastically improving response times for large museum datasets.</td>
  </tr>
  <tr>
    <td><b>Full CRUD & State Persistence</b></td>
    <td>Developed a secure profile management system allowing users to update their credentials and profile images. Implemented <b>State Hydration</b> in React to ensure JWT sessions and user data persist across browser refreshes.</td>
  </tr>
  <tr>
    <td><b>Automated ETL Pipeline</b></td>
    <td>Built a custom Python seeder (<code>popdb.py</code>) that extracts, sanitizes, and loads data from the MET API. It includes <b>Throttling</b> and <b>Exponential Backoff</b> logic to manage rate-limiting and ensure 100% data integrity.</td>
  </tr>
</table>

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><b>Frontend:</b> React.js, Context API (Flux Pattern), React Router, Bootstrap 5 (Mobile-First Design).</li>
  <li><b>Backend:</b> Python 3, Flask, Flask-SQLAlchemy (ORM), Flask-JWT-Extended.</li>
  <li><b>AI/Integrations:</b> Qwen3-VL (Vision-Language Model), Hugging Face Inference API, EmailJS.</li>
  <li><b>Database:</b> SQLite (Development) / PostgreSQL (Production ready).</li>
</ul>

<h2>🖼️ Key Features</h2>
<ul>
  <li><b>AI Curator:</b> Real-time visual analysis of artworks using state-of-the-art Computer Vision.</li>
  <li><b>Interactive Profile:</b> Users can customize their identity, upload profile images, and manage a private "Favorites" collection.</li>
  <li><b>Department Explorer:</b> Categorized navigation across the MET’s 19+ specialized departments.</li>
  <li><b>Professional Security:</b> Protected routes via Higher-Order Components (HOCs) and secure JWT-based authentication.</li>
</ul>

<h2>⚙️ Installation & Setup</h2>
<pre><code>
# 1. Clone the repository
git clone https://github.com/Aleska134/Artseekers.git

# 2. Setup the Backend
pipenv install
pipenv shell
export FLASK_APP=src/app.py
flask db upgrade
python src/popdb.py

# 3. Start the Servers
python src/app.py
# (In another terminal)
npm install
npm start
</code></pre>

<hr />

<div align="center">
  <p><i>Developed and architected by <b>Aleska Braschi</b> | Software Engineering Portfolio</i></p>
  <a href="https://www.linkedin.com/in/aleska-p-braschi">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
  <a href="https://github.com/Aleska134">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
</div>
