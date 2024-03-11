import React, { Component } from "react";
import Slider from "react-slick";
import "../styles/slick/slick.css"
import "../styles/slick/slick-theme.css"
import banner1 from "../assets/img/login/login_banner.png"

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
    };
    return (
      <>
        <Slider {...settings}>
          <div>
            <img src={banner1} alt=""/>
          </div>
          <div>
            <img src={banner1} alt=""/>
          </div>
          <div>
            <img src={banner1} alt=""/>
          </div>
          <div>
            <img src={banner1} alt=""/>
          </div>
          <div>
            <img src={banner1} alt=""/>
          </div>
          <div>
            <img src={banner1} alt=""/>
          </div>
        </Slider>
      </>
    );
  }
}