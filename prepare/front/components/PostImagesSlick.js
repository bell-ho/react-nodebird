import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import styled from 'styled-components';
import {
  Global,
  CloseBtn,
  Header,
  Overlay,
  SlickWrapper,
  ImgWrapper,
  Indicator,
} from './imagesZoom/styles';

const PostImagesSlick = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <div>
      <Slick
        initialSlide={0}
        beforeChange={(slide, newSlide) => setCurrentSlide(newSlide)}
        infinite
        arrows={false}
        slidesToShow={1}
        slidesToScroll={1}
      >
        {images.map((v) => (
          <ImgWrapper key={v.src}>
            <img
              src={`${v.src.replace(/\/thumb\//, '/original/')}`}
              alt={v.src}
            />
          </ImgWrapper>
        ))}
      </Slick>
      <Indicator>
        <div>
          {currentSlide + 1} / {images.length}
        </div>
      </Indicator>
    </div>
  );
};

PostImagesSlick.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PostImagesSlick;
