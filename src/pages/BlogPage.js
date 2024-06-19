import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { collection, getDocs, query, where, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase-app/firebase-config";
import { postStatus } from "../utils/constants";
import PostItem from "../module/post/PostItem";
import { IconSearch } from "../components/icon";
import { debounce } from "lodash";
import { Button } from "../components/button";

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  console.log("BlogPage ~ posts:", posts);
  const [lastVisible, setLastVisible] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState(undefined);

  const fetchData = async (search = "", isLoadMore = false) => {
    setIsSubmitting(true);
    let docRef;
    if (search) {
      docRef = query(
        collection(db, "posts"),
        where("status", "==", postStatus.APPROVED),
        where("title", ">=", search),
        where("title", "<=", search + "uf8ff"),
        limit(1)
      );
    } else {
      docRef = query(
        collection(db, "posts"),
        where("status", "==", postStatus.APPROVED),
        isLoadMore ? startAfter(lastVisible) : limit(3)
      );
    }
    const documentSnapshots = await getDocs(docRef);
    if (!documentSnapshots.empty) {
      const lastVisibleDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastVisibleDoc);
      const results = documentSnapshots.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (isLoadMore) {
        setPosts(prevPosts => [...prevPosts, ...results]);
      } else {
        setPosts(results);
      }
      setHasMore(documentSnapshots.docs.length === 3);
    } else {
      setHasMore(false);
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    fetchData(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleLoadMorePost = async () => {
    if (!lastVisible) return;
    fetchData(searchTerm, true);
  };

  const handleSearchPost = debounce((e) => {
    setSearchTerm(e.target.value);
  }, 500);

  return (
    <Layout>
      <div className="container">
        <div className="flex items-center justify-center max-w-[500px] mx-auto mb-14 border px-6 py-4 rounded-lg border-gray-400 outline-none hover:border-primary">
          <input onChange={handleSearchPost} type="text" className="w-full" placeholder="Tìm kiếm..." />
          <span className="search-icon">
            <IconSearch></IconSearch>
          </span>
        </div>
        <div className="mt-8"></div>
        <div className="grid-layout grid-layout-primary">
          {posts.length > 0 &&
            posts.map((post) => (
              <PostItem key={post.id} data={post}></PostItem>
            ))}
        </div>
        {hasMore && !searchTerm && (
          <div className="mt-10 text-center">
            <Button
              kind="primary"
              className="mx-auto w-[200px]"
              type="submit"
              onClick={handleLoadMorePost}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Xem thêm
            </Button>
          </div>
        )}
      </div>
      <div className="mb-14"></div>
    </Layout>
  );
};

export default BlogPage;
