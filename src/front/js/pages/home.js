import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import exhibit1 from "../../img/exhibit1.png";
import favorite1 from "../../img/favorite1.png";
import profile1 from "../../img/profile1.png";
import background from "../../img/background.png";
import card from "../../img/card.png";

export const Home = () => {
  const { store, actions } = useContext(Context);

  const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: '100vw 100vh',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
  };
  

  return (
    <div style={backgroundStyle}>
      <div className="backgroundHome pb-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 text-center">
              <h3 className="animate-charcter">ArtSeekers</h3>
            </div>
          </div>

          <div className="rowAboutUs" id="about-us">
            <div className="info">
              <h2>Welcome ArtSeekers,</h2>
              <p>
                To the digital sanctuary for art enthusiasts and connoisseurs
                alike. Our platform is more than just a gallery; it's a vibrant
                community where the masterpieces of the world are at your
                fingertips, waiting to be explored, rated, and favorited.
              </p>
              <p>
                At ArtSeekers, we believe that art is a universal language that
                transcends boundaries and connects souls. That's why we've
                dedicated ourselves to creating an accessible space where the
                beauty and history of world-class art pieces can be shared and
                celebrated by everyone, from seasoned art historians to those
                just beginning their journey into the art world.
              </p>
              <p>
                Our mission is to democratize the appreciation of art, making it
                possible for anyone, anywhere, to access, learn about, and
                engage with the finest artworks our history has to offer.
                Whether you're in search of inspiration, education, or just a
                moment of beauty, ArtSeekers provides a curated and
                user-friendly platform to satisfy your artistic cravings.
              </p>
              <p>
                With ArtSeekers, you're not just browsing art; you're joining a
                global community of like-minded individuals who share your
                passion. Rate your favorite pieces to contribute to a growing
                database of community preferences, helping others discover and
                appreciate the art that moves you. Save your favorite artworks
                to your personal collection, creating a virtual gallery that
                reflects your unique taste and personality.
              </p>
              <p>
                Our platform is built on the principle of interactive
                engagement, encouraging users to dive deeper into the stories
                behind each masterpiece, the lives of the artists, and the
                historical context that shaped their creation. By offering
                detailed descriptions, high-quality images, and expert insights,
                we strive to enhance your understanding and appreciation of each
                piece.
              </p>
              <p>
                ArtSeekers is more than just a website; it's a journey through
                the annals of art history, a place to find inspiration, and a
                community where your passion for art is not just welcomed—it's
                celebrated. Join us in our quest to uncover the beauty and
                complexity of art from around the globe, one masterpiece at a
                time.
              </p>
            </div>
          </div>


          <h2 style={{marginTop:"150px", border:"10px solid black", backgroundColor: "white", margin: "0 125px -110px 125px"}} className="text-center">CURRENT FEATURES</h2>
          <div style={{margin: "5vw", padding: "5vw"}} className="row pb-15" id="list">
            <div>
              <div className="lineHome"><p>View world-class pieces of art</p></div>
              <div className="lineHome">
                <p>View art within specific departments of featured museums</p>
              </div>

              <div className="lineHome">
                <p className="p-1">If you love a specific piece of art 'favorite' it and it will
                save to your profile</p>
              </div>
            </div>
          </div>
        </div>


        <div id="carouselExample" className="carousel pb-5">
          <div className="bg-light">
          <h2 style={{marginTop:"-75px", border:"10px solid black"}} className="text-center">MEMBER FEATURES</h2>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={exhibit1} className="img-fluid d-block w-100" alt="..." />
            </div>
            <div className="carousel-item">
              <img src={favorite1} className="img-fluid d-block w-100" alt="..." />
            </div>
            <div className="carousel-item h-100">
              <img src={profile1} className="img-fluid d-block w-100 h-100" alt="..." />
            </div>
            <div className="carousel-item h-100">
              <img src={card} className="img-fluid d-block w-100 h-100" alt="..." />
            </div>

          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next "
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};
