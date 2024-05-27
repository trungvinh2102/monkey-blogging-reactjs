import React, { Fragment, Suspense } from "react";
import { AuthProvider } from "./contexts/auth-context";
import { Route, Routes } from "react-router-dom";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const BlogPage = React.lazy(() => import("./pages/BlogPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const SignUpPage = React.lazy(() => import("./pages/SignUpPage"));
const SignInPage = React.lazy(() => import("./pages/SignInPage"));
const PostDetailsPage = React.lazy(() => import("./pages/PostDetailsPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const PageNotFound = React.lazy(() => import("./pages/PageNotFound"));
const PostsPageWithUser = React.lazy(() => import("./pages/PostsPageWithUser"));
const PostsPageWithCategory = React.lazy(() =>
  import("./pages/PostsPageWithCategory")
);

const PostManage = React.lazy(() => import("./module/post/PostManage"));
const PostAddNew = React.lazy(() => import("./module/post/PostAddNew"));
const DashboardLayout = React.lazy(() =>
  import("./module/dashboard/DashboardLayout")
);
const UserAddNew = React.lazy(() => import("./module/user/UserAddNew"));
const UserProfile = React.lazy(() => import("./module/user/UserProfile"));
const CategoryManage = React.lazy(() =>
  import("./module/category/CategoryManage")
);
const UserManage = React.lazy(() => import("./module/user/UserManage"));
const CategoryAddNew = React.lazy(() =>
  import("./module/category/CategoryAddNew")
);
const UserUpdate = React.lazy(() => import("./module/user/UserUpdate"));
const PostUpdate = React.lazy(() => import("./module/post/PostUpdate"));
const CategoryUpdate = React.lazy(() =>
  import("./module/category/CategoryUpdate")
);

const App = () => {
  return (
    <Fragment>
      <AuthProvider>
        <Suspense>
          <Routes>
            <Route path="/" element={<HomePage></HomePage>} />
            <Route path="/blog" element={<BlogPage></BlogPage>} />
            <Route path="/contact" element={<ContactPage></ContactPage>} />
            <Route path="/sign-up" element={<SignUpPage></SignUpPage>} />
            <Route path="/sign-in" element={<SignInPage></SignInPage>} />
            <Route
              path="/:slug"
              element={<PostDetailsPage></PostDetailsPage>}
            ></Route>
            <Route
              path="/user/:username"
              element={<PostsPageWithUser></PostsPageWithUser>}
            />
            <Route
              path="/category/:slug"
              element={<PostsPageWithCategory></PostsPageWithCategory>}
            />
            <Route element={<DashboardLayout></DashboardLayout>}>
              <Route
                path="/dashboard"
                element={<DashboardPage></DashboardPage>}
              ></Route>
              <Route
                path="/manage/posts"
                element={<PostManage></PostManage>}
              ></Route>
              <Route
                path="/manage/add-post"
                element={<PostAddNew></PostAddNew>}
              ></Route>
              <Route
                path="/manage/update-post"
                element={<PostUpdate></PostUpdate>}
              ></Route>
              <Route
                path="/manage/category"
                element={<CategoryManage></CategoryManage>}
              ></Route>
              <Route
                path="/manage/add-category"
                element={<CategoryAddNew></CategoryAddNew>}
              ></Route>
              <Route
                path="/manage/update-category"
                element={<CategoryUpdate></CategoryUpdate>}
              ></Route>
              <Route
                path="/manage/user"
                element={<UserManage></UserManage>}
              ></Route>
              <Route
                path="/manage/add-user"
                element={<UserAddNew></UserAddNew>}
              ></Route>
              <Route
                path="/manage/update-user"
                element={<UserUpdate></UserUpdate>}
              ></Route>
              <Route
                path="/profile"
                element={<UserProfile></UserProfile>}
              ></Route>
            </Route>

            <Route path="*" element={<PageNotFound></PageNotFound>} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Fragment>
  );
};

export default App;
