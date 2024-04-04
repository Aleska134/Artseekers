from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# Association table user_to_exhibit
# https://docs.sqlalchemy.org/en/14/orm/basic_relationships.html#many-to-many

user_to_exhibit = db.Table(
    "user_to_exhibit",
    db.metadata,
    db.Column("user_id", db.ForeignKey("user.id"), primary_key=True),
    db.Column("exhibit_id", db.ForeignKey("exhibits.id"), primary_key=True),
)


class User(db.Model):
    __tablename__="user"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    favorites = db.relationship(
        'Exhibits',
        secondary = user_to_exhibit,
        uselist = True,
        overlaps="favorites"
        
    )

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name" : self.name,
            "username" : self.username,
            "favorites": [exhibit.serialize() for exhibit in self.favorites]
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
    favorites = db.relationship(
        'User',
        secondary = user_to_exhibit,
        primaryjoin = (id == user_to_exhibit.c.exhibit_id),
        uselist = True,
        overlaps="favorites"
    )
    
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
        }
    

# class Review(db.Model):
#     __tablename__ = 'reviews'