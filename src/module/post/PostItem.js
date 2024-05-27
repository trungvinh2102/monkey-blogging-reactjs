import styled from "styled-components";
import PostImage from "./PostImage";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import slugify from "slugify";

const PostItemStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;
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
      margin-bottom: 20px;
    }
  }
  @media screen and (max-width: 1023.98px) {
    .post {
      &-image {
        aspect-ratio: 16/9;
        height: auto;
      }
    }
  }
`;

const PostItem = ({ data }) => {
  if (!data) return null;

  const date = data?.user?.createdAt?.seconds
    ? new Date(data?.user?.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");

  return (
    <PostItemStyles>
      <PostImage to={data.slug} atl="" url={data.image} />
      <PostCategory to={data.category?.slug} type="primary">
        {data.category?.name}
      </PostCategory>
      <PostTitle to={data.slug} size="normal">
        {data.title}
      </PostTitle>
      <PostMeta
        to={slugify(data.user?.username || "", { lower: true })}
        author={data.user?.fullname}
        date={formatDate}
      ></PostMeta>
    </PostItemStyles>
  );
};

export default PostItem;
