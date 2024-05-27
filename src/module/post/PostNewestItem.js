import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
import PostImage from "./PostImage";
import slugify from "slugify";
const PostNewestItemStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: 0;
  }
  &-content {
    flex: 1;
  }
  .post {
    &-image {
      display: block;
      flex-shrink: 0;
      width: 180px;
      height: 130px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px;
      }
    }
  }
  @media screen and (max-width: 1023.98px) {
    margin-bottom: 14px;
    padding-bottom: 14px;
    .post {
      &-image {
        width: 140px;
        height: 100px;
      }
    }
  }
`;
const PostNewestItem = ({ data }) => {
  if (!data) return null;
  const date = data?.createdAt?.seconds
    ? new Date(data?.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");

  return (
    <PostNewestItemStyles>
      <PostImage to={data.slug} atl="" url={data.image} />

      <div className="post-content">
        <PostCategory to={data.category?.slug} type="secondary">
          {data.category?.name}
        </PostCategory>
        <PostTitle to={data.slug} size="normal">
          {data.title}
        </PostTitle>
        <PostMeta
          to={slugify(data.user?.fullname || "", { lower: true })}
          author={data.user?.fullname}
          date={formatDate}
        ></PostMeta>
      </div>
    </PostNewestItemStyles>
  );
};

export default PostNewestItem;
