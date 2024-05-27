import React from "react";
import styled from "styled-components";
import { Button } from "../../components/button";

const HomeBannerStyles = styled.div`
  min-height: 520px;
  padding: 40px 0;
  .banner {
    background-image: linear-gradient(
      155deg,
      ${(props) => props.theme.primary},
      ${(props) => props.theme.secondary}
    );
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 36px 30px 36px;
  }
  .banner__content {
    width: 50%;
    color: white;
  }
  .banner__content-title {
    margin-bottom: 28px;
    font-size: 48px;
    font-weight: 700;
  }
  .banner__content-desc {
    margin-bottom: 48px;
    font-size: 14px;
    font-weight: 400;
    line-height: 28px;
  }
  @media screen and (max-width: 1023.98px) {
    .banner {
      flex-direction: column;
      min-height: unset;
      &-heading {
        font-size: 30px;
        margin-bottom: 10px;
        font-weight: bold;
      }
      &-desc {
        font-size: 14px;
        margin-bottom: 20px;
      }
      &-image {
        margin-top: 25px;
      }
      &-button {
        font-size: 14px;
        height: auto;
        padding: 15px;
      }
    }
  }
`;

const HomeBanner = () => {
  return (
    <HomeBannerStyles>
      <div className="container">
        <div className="banner">
          <div className="banner__content">
            <h1 className="banner__content-title">Monkey Blogging</h1>
            <p className="banner__content-desc">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil
              deserunt quo deleniti inventore natus beatae alias vero velit
              doloribus dicta, numquam qui ipsa maiores nobis cupiditate sed
              minus necessitatibus. Voluptatem?
            </p>
            <Button type="submit" to="/sign-up" kind="secondary">
              Get Started
            </Button>
          </div>
          <div className="banner__img">
            <img srcSet="./img-banner.png" alt="Banner" />
          </div>
        </div>
      </div>
    </HomeBannerStyles>
  );
};

export default HomeBanner;
