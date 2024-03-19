import React from 'react';
import Slider from 'react-slick';
import sliede1 from '../assets/img/StoreSlied1.jpg';
import sliede2 from '../assets/img/slied4.jpg';
import sliede3 from '../assets/img/Slied3.jpg';

function StoreSlied() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
    };
  
    const images = [
      sliede1,
      sliede2,
      sliede3
    ];
  
    return (
      <div style={{ width: "1350px", margin: "0 auto" }}>
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index} style={{ position: 'relative', width: '100%', height: '100%' }}>
              {/* 이미지를 div로 감싼 후 스타일 적용 */}
              <div style={{
                height: '400px', // 또는 컨테이너의 높이에 맞춰 조정
                width: '100%',
                overflow: 'hidden',
              }}>
                <img src={img} alt={`Slide ${index + 1}`} style={{
                  width: "100%",
                  height: "100%",
                  objectFit: 'cover', // 이미지가 div 크기에 꽉 차도록 조정
                }} />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  }

export default StoreSlied;