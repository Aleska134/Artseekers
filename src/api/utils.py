from flask import jsonify, url_for

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filtramos rutas que no se pueden navegar o que requieren parámetros
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    
    return """
        <div style="text-align: center; font-family: sans-serif; padding-top: 50px; color: #333;">
            <img style="max-height: 120px; border-radius: 8px;" src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/The_Met_logo.svg/1024px-The_Met_logo.svg.png' />
            <h1>Artseekers API</h1>
            <p style="color: #666;">Backend Server for the Metropolitan Museum of Art Collection Explorer</p>
            
            <div style="background: #f4f4f4; padding: 20px; display: inline-block; border-radius: 10px; margin-top: 20px; border: 1px solid #ddd;">
                <p><strong>API Endpoint Host:</strong></p>
                <code><script>document.write(window.location.href);</script></code>
            </div>

            <h3 style="margin-top: 40px;">Available Endpoints:</h3>
            <ul style="list-style: none; padding: 0; font-size: 18px;">
                """ + links_html + """
            </ul>
            <hr style="width: 50%; margin-top: 50px; border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999;">Portfolio Project - Computer Science Student</p>
        </div>
    """
