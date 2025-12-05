import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/Home.css";
import Slideshow from "../components/Slideshow";

const Home = () => {
  return (
    <div className="home-page">
      <section className="featured text-center">
        <h2 className="section-title-custom">PRODUCTOS DESTACADOS DE LA SEMANA</h2>
      </section>

      <Slideshow />
    </div>
  );
};

export default Home;
