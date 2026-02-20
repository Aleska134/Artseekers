from flask import jsonify, url_for

class APIException(Exception):
    """
    Custom exception class for API-related errors.
    Standardizes error responses across the application.
    """
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
    """Checks if a Flask routing rule requires parameters."""
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    """
    Generates a technical HTML overview of all available API endpoints.
    Used as the root landing page for the backend server.
    """
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules that cannot be navigated or require dynamic parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a style='color: #c5a059;' href='" + y + "'>" + y + "</a></li>" for y in links])
    
    return """
        <div style="text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding-top: 50px; color: #f5f5f5; background-color: #121212; height: 100vh;">
            <img style="max-height: 100px; border: 2px solid #c5a059; border-radius: 8px;" src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/The_Met_logo.svg/1024px-The_Met_logo.svg.png' />
            <h1 style="color: #c5a059; letter-spacing: 2px;">ArtSeekers API Engine</h1>
            <p style="color: #aaa;">RESTful Backend Server | Metropolitan Museum of Art Collection Explorer</p>
            
            <div style="background: #1a1a1a; padding: 20px; display: inline-block; border-radius: 0; margin-top: 20px; border: 1px solid #333; text-align: left;">
                <p style="margin-top: 0;"><strong>Active API Host:</strong></p>
                <code style="color: #00ff00;"><script>document.write(window.location.href);</script></code>
                
                <h3 style="margin-top: 30px; color: #c5a059; border-bottom: 1px solid #333; padding-bottom: 10px;">System Endpoints:</h3>
                <ul style="list-style: square; padding-left: 20px; font-size: 16px; line-height: 2;">
                    """ + links_html + """
                </ul>
            </div>
            <p style="font-size: 11px; color: #555; margin-top: 50px; letter-spacing: 1px;">DEVELOPED BY ALESKA | SOFTWARE ENGINEERING PORTFOLIO 2026</p>
        </div>
    """
