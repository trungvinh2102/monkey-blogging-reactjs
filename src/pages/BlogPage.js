import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Heading from "../components/layout/Heading";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase-app/firebase-config";
import { postStatus } from "../utils/constants";
import PostItem from "../module/post/PostItem";

const BlogPage = () => {
  // state
  const [posts, setPosts] = useState([]);

  //
  useEffect(() => {
    async function fetchData() {
      const docRef = query(
        collection(db, "posts"),
        where("status", "==", postStatus.APPROVED)
      );
      const results = [];
      onSnapshot(docRef, (snapshot) => {
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(results);
      });
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <Heading></Heading>
      <div className="container">
        <div className="flex items-center justify-center max-w-[500px] mx-auto mb-14 border px-6 py-4 rounded-lg border-gray-400 outline-none hover:border-primary">
          <input type="text" className="w-full" placeholder="Search posts..." />
          <span className="search-icon">
            <svg
              width="18"
              height="17"
              viewBox="0 0 18 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse
                cx="7.66669"
                cy="7.05161"
                rx="6.66669"
                ry="6.05161"
                stroke="#999999"
                strokeWidth="1.5"
              />
              <path
                d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
                stroke="#999999"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
                stroke="#999999"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
        <div className="mt-8"></div>
        <div className="grid-layout grid-layout-primary">
          {posts.length > 0 &&
            posts.map((post) => (
              <PostItem key={post.id} data={post}></PostItem>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
