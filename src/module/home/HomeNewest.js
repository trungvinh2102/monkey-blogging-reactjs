import styled from "styled-components";
import Heading from "../../components/layout/Heading";
import PostNewestLarge from "../post/PostNewestLarge";
import PostNewestItem from "../post/PostNewestItem";
import PostItem from "../post/PostItem";
import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { postStatus } from "../../utils/constants";

const HomeNewestStyles = styled.div`
  .layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 40px;
    margin-bottom: 40px;
    align-items: start;
  }
  .sidebar {
    padding: 28px 20px;
    background-color: #f3edff;
    border-radius: 16px;
  }
  @media screen and (max-width: 1023.98px) {
    .layout {
      grid-template-columns: 100%;
    }
    .sidebar {
      padding: 14px 10px;
    }
  }
`;

const HomeNewest = () => {
  //state
  const [posts, setPosts] = useState([]);

  // fetch data posts
  useEffect(() => {
    const queries = query(
      collection(db, "posts"),
      where("status", "==", postStatus.APPROVED),
      where("hot", "==", false),
      limit(4)
    );
    onSnapshot(queries, (snapshot) => {
      let results = [];
      snapshot.forEach((item) => {
        results.push({
          id: item.id,
          ...item.data(),
        });
      });
      setPosts(results);
    });
  }, []);

  const [first, ...othor] = posts;
  if (posts.length <= 0) return null;

  return (
    <HomeNewestStyles className="home-block">
      <div className="container">
        <Heading>Latest posts</Heading>
        <div className="layout">
          <PostNewestLarge data={first}></PostNewestLarge>
          <div className="sidebar">
            {othor.length > 0 &&
              othor.map((item) => (
                <PostNewestItem key={item.id} data={item}></PostNewestItem>
              ))}
          </div>
        </div>
        <div className="grid-layout grid-layout--primary">
          {posts.length > 0 &&
            posts.map((item) => (
              <PostItem key={item.id} data={item}></PostItem>
            ))}
        </div>
      </div>
    </HomeNewestStyles>
  );
};

export default HomeNewest;
