import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
import PostImage from "./PostImage";
import slugify from "slugify";
const PostNewestLargeStyles = styled.div`
  .post {
    &-image {
      display: block;
      margin-bottom: 20px;
      height: 433px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
      }
    }
    &-category {
      margin-bottom: 10px;
    }
    &-title {
      margin-bottom: 10px;
      margin-bottom: 20px;
    }
  }
  @media screen and (max-width: 1023.98px) {
    &-image {
      height: 250px;
    }
  }
`;

const PostNewestLarge = ({ data }) => {
  if (!data) return null;
  const date = data?.createdAt?.seconds
    ? new Date(data?.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  return (
    <PostNewestLargeStyles>
      <PostImage atl="" url={data.image} to={data.slug} />

      <PostCategory to={data.category?.slug} type="primary">
        {data.category?.name}
      </PostCategory>
      <PostTitle to={data.slug} size="big">
        {data.title}
      </PostTitle>
      <PostMeta
        to={slugify(data.user?.fullname || "", { lower: true })}
        author={data.user?.fullname}
        date={formatDate}
      ></PostMeta>
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;
