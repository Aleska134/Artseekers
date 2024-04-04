from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    # favorite = db.relationship('Favorite', lazy=True, back_populates='user')

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # "favorite" :  list(map(lambda x: x.serialize(), self.favorite))
            # Note: Password is intentionally omitted for security reasons.
        }


class Exhibits(db.Model):
    __tablename__ = 'exhibits'
    id = db.Column(db.Integer, primary_key=True)
    exhibit_museum_id = db.Column(db.Integer, nullable=False)
    exhibit_name = db.Column(db.String(250), nullable=False)
    department_museum_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=True)
    primary_image_small = db.Column(db.String(250), nullable=False)
    region = db.Column(db.String(100),nullable=True)
    culture = db.Column(db.String(100),nullable=True)
    object_date = db.Column(db.String(100),nullable=True)
    artist_name =db.Column(db.String(250),nullable=True)
    # favorite_id = db.Column(db.Integer, db.ForeignKey('favorites.id'), nullable=True)
    # favorite = db.relationship('Favorite', foreign_keys=[favorite_id], backref=db.backref('exhibits', lazy=True))
    # artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'), nullable=True)
    # museum_id = db.Column(db.Integer, db.ForeignKey('museums.id'))
    # museum = db.relationship('Museums', backref=db.backref('exhibits', lazy=True))
    # favorite = db.relationship('Favorite', backref=db.backref('exhibits', lazy=True))
    # artist = db.relationship('Artist', backref=db.backref('exhibits', lazy=True))
    def __repr__(self):
        return f'<Exhibit {self.exhibit_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "exhibit_museum_id" :self.exhibit_museum_id,
            "exhibit_name": self.exhibit_name,
            "department_museum_id": self.department_museum_id,
            "region": self.region,
            "object_date": self.object_date,
            "culture": self.culture,
            "primary_image_small" : self.primary_image_small,
            "artist_name" : self.artist_name,
        }


class Departments (db.Model):
    __tablename__ = 'departments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    department_museum_id = db.Column(db.Integer)
   
    def __repr__(self):
        return f'<departments {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "department_museum_id": self.department_museum_id
            # "birth_year": self.birth_year,
            # "death_year": self.death_year,
            # "nationality": self.nationality
        }

# class Favorite(db.Model):
#     __tablename__ = 'favorites'
#     id = db.Column(db.Integer, primary_key=True)
#     exhibit_id = db.Column(db.Integer,db.ForeignKey('exhibits.id'))
#     exhibit = db.relationship('Exhibits', backref=db.backref('favorites', lazy=True))
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     user = db.relationship('User', backref=db.backref('Favorites', lazy=True))

#     def __repr__(self):
#         return f'<Favorite {self.id}>'
    
    
#     def serialize(self):
#         return {
#             "id": self.id,
#             "favorite_name": self.exhibit.exhibit_name,
#             "user_id": self.user_id,
#         }
    
# class Artist (db.Model):
#     __tablename__ = 'artists'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(250), nullable=False)
#     museum_id = db.Column(db.Integer, db.ForeignKey('museums.id'), nullable=False)  
#     museum = db.relationship('Museums', backref=db.backref('artists', lazy=True))
#     artistNationality = db.Column(db.String(50),nullable=True)
#     artistDisplayName = db.Column(db.String(50),nullable=True)
#     artistDisplayBio = db.Column(db.String(50),nullable=True)


#     def __repr__(self):
#         return f'<Artist {self.name}>'

#     def serialize(self):
#         return {
#             "id": self.id,
#             "name": self.name,
#             "artistNationality": self.artist_Nationality,
#             "artistDisplayName": self.artist_DisplayName,
#             "artistDisplayBio": self.artistDisplayBio
#         }
    


# class Review(db.Model):
#     __tablename__ = 'reviews'

# class Museums(db.Model):
#     __tablename__ = 'museums'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(250), nullable=False)
#     location = db.Column(db.String(250), nullable=False)
#     description = db.Column(db.Text, nullable=True)
#     website = db.Column(db.String(250), nullable=True)
    

#     def __repr__(self):
#         return f'<Museum {self.name}>'

#     def serialize(self):
#         return {
#             "id": self.id,
#             "name": self.name,
#             "location": self.location,
#             "description": self.description,
#             "website": self.website
#         }