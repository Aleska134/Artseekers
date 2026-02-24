<div align="center">
  <h1>🖼️ ArtSeekers: The AI-Powered Gallery</h1>
  <p><strong>A high-performance museum explorer that bridges classical art and modern engineering.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Status-Production--Ready-success?style=flat-square" alt="Status">
    <img src="https://img.shields.io/badge/Architecture-Full--Stack-blue?style=flat-square" alt="Architecture">
    <img src="https://img.shields.io/badge/AI-Multimodal%20Vision-orange?style=flat-square" alt="AI">
  </p>
</div>

<hr>

<h2>🌟 Project Overview</h2>
<p>
  <strong>ArtSeekers</strong> is a professional-grade gallery explorer for the <strong>Metropolitan Museum of Art</strong> collection. 
  Originally a bootcamp project, I independently refactored the entire system to meet modern software engineering standards, 
  focusing on <strong>algorithmic optimization</strong>, <strong>Computer Vision AI</strong>, and <strong>secure data architectures</strong>.
</p>

<h2>🚀 Engineering Highlights (Computer Science Focus)</h2>

<h3>1. Breaking the Performance Bottleneck ($O(N+M)$)</h3>
<p>
  Initially, the API struggled with data serialization using nested loops, resulting in $O(N \times M)$ complexity. 
  I refactored the backend logic to implement <strong>Hash Map Lookups</strong>, reducing complexity to <strong>Linear Time ($O(N + M)$)</strong>.
</p>

<pre><code>
# Before: O(N×M) - Nested iteration
for artwork in artworks:
    for metadata in all_metadata:
        if artwork.id == metadata.artwork_id:
            # process...

# After: O(N+M) - Hash map lookup
metadata_map = {m.artwork_id: m for m in all_metadata}
for artwork in artworks:
    metadata = metadata_map.get(artwork.id)
    # process...
</code></pre>

<h3>2. Multimodal AI Integration (Qwen-VL)</h3>
<p>
  I integrated the <strong>Qwen-VL Vision LLM</strong> via Hugging Face. 
  Unlike standard chatbots, ArtSeekers performs real-time visual analysis of artwork pixels to provide context-aware curatorial insights.
</p>

<h3>3. Professional Data Engineering (ETL Pipeline)</h3>
<p>
  Developed a custom Python seeder (<code>popdb.py</code>) to manage the <strong>Extract, Transform, and Load</strong> process from the MET's REST API.
</p>
<ul>
  <li><strong>Throttling:</strong> Respects API constraints with configurable delays.</li>
  <li><strong>Data Validation:</strong> Filters records missing critical fields like images or artist attribution.</li>
</ul>

<h3>4. Security First</h3>
<ul>
  <li><strong>Encryption:</strong> Implemented <strong>Scrypt Hashing</strong> for password storage, ensuring credentials are mathematically protected against brute-force attacks.</li>
  <li><strong>Session Management:</strong> Secure authentication via <strong>JWT (JSON Web Tokens)</strong> with state hydration to persist sessions across refreshes.</li>
</ul>

<hr>

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> React.js + Context API (Flux Pattern) + Bootstrap 5.</li>
  <li><strong>Backend:</strong> Python 3 + Flask + SQLAlchemy (ORM).</li>
  <li><strong>Database:</strong> SQLite (Dev) / PostgreSQL (Production ready).</li>
  <li><strong>AI Engine:</strong> Hugging Face Multimodal Inference API (Qwen-Vision).</li>
</ul>

<hr>

<h2>🔄 Project Evolution</h2>
<p>
  This project began as a collaborative bootcamp effort at 4Geeks Academy. 
  Following the bootcamp, I took full ownership of the codebase and independently:
</p>
<ul>
  <li>Refactored the backend for high-performance data handling.</li>
  <li>Implemented the entire AI vision integration.</li>
  <li>Standardized the security and authentication protocols.</li>
  <li>Optimized the frontend state management architecture.</li>
</ul>

<hr>

<h2>⚙️ Quick Start</h2>
<pre><code>
# 1. Clone & Setup
git clone https://github.com/Aleska134/Artseekers.git
pipenv install && pipenv shell

# 2. Seed & Run
python src/popdb.py  # Populate with validated MET data
python src/app.py    # Start Backend

# 3. Launch Frontend (New Terminal)
npm install && npm start
</code></pre>

<hr>

<div align="center">
  <p><i>Developed and architected by <b>Aleska Braschi</b> | Computer Science @ MDC/FIU</i></p>
  <a href="https://www.linkedin.com/in/aleska-p-braschi">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
  <a href="https://github.com/Aleska134">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
</div>