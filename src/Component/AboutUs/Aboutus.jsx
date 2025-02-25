import { Helmet, HelmetProvider } from "react-helmet-async";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./Aboutus.css";

const Aboutus = () => {
  return (
    <>
    <HelmetProvider>
      <Helmet>
        <title>Know more about us...</title>
      </Helmet>
    </HelmetProvider>
      <div className="aboutall">
        <Header />
        <h2 className="h2"> About My Compony</h2>
        <div className="information">
          <div className="info">
            <h3>History</h3>
            <blockquote>
              The company was founded by Adolf Dassler after a fallout with his
              brother Rudolf Dassler, who later went on to create Puma.The name
              Adidas comes from a combination of the founders nickname Adi and the
              first three letters of his last name Dassler. Adidas gained
              popularity in 1954 when the German national football team won the
              FIFA World Cup wearing Adidas cleats with screw-in studs.It became a
              global sportswear leader by innovating designs and collaborating
              with athletes and celebrities.
            </blockquote>
            <h3>Products</h3>
            <blockquote>
              Footwear: Running shoes, casual sneakers, and performance shoes for
              sports like football, basketball, and tennis. Iconic lines include:
              <ul>
                <li>Adidas Originals (e.g., Stan Smith, Superstar)</li>
                <li>Ultraboost</li>
                <li>
                  {" "}
                  Yeezy (in collaboration with Kanye West, though the partnership
                  ended in 2022).
                </li>
              </ul>
            </blockquote>
            <h3>Brand Identity</h3>
            <blockquote>
              <ol>
                <li>
                  <b>Logo:</b>
                  <ul>
                    <li>
                      he original Trefoil logo (introduced in 1972) is used for
                      the Adidas Originals line.z
                    </li>
                    <li>
                      The Three Stripes logo is now the primary design across its
                      products.
                    </li>
                  </ul>
                </li>
                <li>
                  <b>Slogan</b>
                  <ul>
                    <li>
                      Famous tagline: <b> Nothing Is Impossible</b>
                    </li>
                  </ul>
                </li>
              </ol>
            </blockquote>
            <h3>Collaborations and Influence</h3>
            <blockquote>
              <ol>
                <li>
                  <b>Celebrity Collaborations:</b>
                  <ul>
                    <li>Kanye West (Yeezy brand, partnership ended in 2022).</li>
                    <li>Beyoncé (Ivy Park collaboration)</li>
                    <li>Pharrell Williams (Human Race collection).</li>
                  </ul>
                </li>
                <li>
                  <b>Sports Sponsorships:</b>
                  <ul>
                    <li>
                      Adidas sponsors major teams and athletes in football,
                      basketball, running, and more.
                    </li>
                    <li>
                      {" "}
                      Notable sponsorships include{" "}
                      <b>Real Madrid, Manchester United, </b>and national teams
                      like <b>Germany.</b>
                    </li>
                  </ul>
                </li>
              </ol>
            </blockquote>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Aboutus;
