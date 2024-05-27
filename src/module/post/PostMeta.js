import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PostMetaStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 600;
  color: inherit;
  .post {
    &-dot {
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: currentColor;
      border-radius: 100rem;
    }
  }
  @media screen and (max-width: 1023.98px) {
    font-size: 10px;
    gap: 6px;
  }
`;

const PostMeta = ({ date = "", to = "", author = "", ...props }) => {
  return (
    <PostMetaStyles {...props}>
      <span className="post-time">{date}</span>
      {author && <span className="post-dot"></span>}
      <Link to={`/user/${to}`}>
        <span className="post-author">{author}</span>
      </Link>
    </PostMetaStyles>
  );
};

export default PostMeta;
