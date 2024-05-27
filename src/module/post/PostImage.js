import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PostImageStyles = styled.div`
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
  }
`;

const PostImage = ({ url = "", atl = "", className = "", to = "" }) => {
  return (
    <PostImageStyles className={`post-image ${className}`}>
      <Link to={`/${to}`}>
        <img src={url} alt={atl} loading="lazy" />
      </Link>
    </PostImageStyles>
  );
};

export default PostImage;
