<div align="center">
  <h1>🖼️ ArtSeekers: Full-Stack MET Museum Explorer</h1>
  <p><strong>A professional gallery engine optimized for data-intensive exploration.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
    <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
  </p>
</div>

<hr />

<h2>📖 Project Overview</h2>
<p>
  ArtSeekers is a high-performance Full-Stack application designed to browse and curate masterpieces from the <strong>Metropolitan Museum of Art (The MET)</strong>. Originally started as a bootcamp project, I have refactored the entire core architecture to implement professional software engineering standards, focusing on <strong>algorithmic efficiency</strong> and <strong>automated data pipelines</strong>.
</p>

<h2>🧠 Engineering Highlights (CS Focus)</h2>
<p>As a Computer Science student, I focused on solving real-world technical challenges during the development of this platform:</p>

<table>
  <tr>
    <td width="30%"><b>Algorithmic Optimization</b></td>
    <td>Refactored API endpoints to replace nested loops ($O(N \times M)$) with <b>Hash Map (Dictionary) Lookups</b>. This reduced the time complexity to <b>$O(N + M)$</b> during data serialization, significantly improving response times for large datasets.</td>
  </tr>
  <tr>
    <td><b>ETL Data Pipeline</b></td>
    <td>Developed a custom Python script (<code>popdb.py</code>) to <b>Extract, Transform, and Load</b> data from the MET Public API. It handles HTTP headers to bypass bot-detection and ensures data sanitization before committing to the SQL database.</td>
  </tr>
  <tr>
    <td><b>State Hydration & Persistence</b></td>
    <td>Implemented a <b>Token Synchronization</b> logic in React.js to ensure the global store remains consistent with <code>sessionStorage</code> after browser refreshes, preventing unwanted session loss.</td>
  </tr>
  <tr>
    <td><b>Backend Architecture</b></td>
    <td>Engineered a robust database connection logic using <b>Absolute Dynamic Routing</b> to manage SQLite persistence across different environments (local vs. cloud containers).</td>
  </tr>
</table>

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><b>Frontend:</b> React.js, Context API (Flux Pattern), React Router, Bootstrap 5.</li>
  <li><b>Backend:</b> Python 3, Flask, Flask-SQLAlchemy (ORM), Flask-JWT-Extended.</li>
  <li><b>Database:</b> SQLite (Development) / PostgreSQL (Production).</li>
  <li><b>External API:</b> The Metropolitan Museum of Art Public Collection API.</li>
</ul>

<h2>🖼️ Key Features</h2>
<ul>
  <li><b>Dynamic Gallery:</b> Browse art pieces by specific MET departments (Egypt, European Paintings, etc.).</li>
  <li><b>Personal Collection:</b> Users can register and save their favorite pieces to a persistent personal profile.</li>
  <li><b>Advanced Search:</b> Integrated fallback mechanisms for missing museum data and images.</li>
  <li><b>Admin Dashboard:</b> Customized Flask-Admin interface with restricted sensitive fields (passwords) for security.</li>
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
  <p><i>Developed and optimized by <b>Aleska Braschi</b> as a part of my Software Engineering portfolio.</i></p>
  <a href="https://www.linkedin.com/in/aleska-p-braschi">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
  <a href="https://github.com/Aleska134">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
</div>
