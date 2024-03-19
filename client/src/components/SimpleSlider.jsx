import React, { Component } from "react";
import Slider from "react-slick";
import "../styles/slick/slick.css"
import "../styles/slick/slick-theme.css"
import banner1 from "../assets/img/login/login_banner.png"
import banner2 from "../assets/img/Slied3.jpg"
import banner3 from "../assets/img/slied4.jpg"

export default class SimpleSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dotsClass: "slick-dots",
      autoplay: true,
      autoplaySpeed: 4000,
    };
    return (
      <>
        <Slider {...settings}>
          <div>
            <img src={banner1} alt=""/>
          </div>
          <div>
            <img src={banner2} alt=""/>
          </div>
          <div>
            <img src={banner3} alt=""/>
          </div>
          {/* <div>
            <img src={banner1} alt=""/>
          </div>
          <div>
            <img src={banner1} alt=""/>
          </div> */}
        </Slider>
      </>
    );
  }
}