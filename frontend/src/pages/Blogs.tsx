import { AppBar } from "../components/AppBar";
import { PostCard } from "../components/PostCard";
import { useBlogs, type Blog } from "../hooks/blog";
import axios from "axios";
import { useEffect, useState } from "react";

const BACKEND_URL = "https://backend.kundusouhardya.workers.dev/app/v1";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();
  const [userName, setUserName] = useState("");
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/user/me`, {
          headers: {
            Authorization: token || "",
          },
        });
        setUserName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userName && blogs.length > 0) {
      const filtered = blogs.filter((blog) => blog.author?.name === userName);
      setUserBlogs(filtered);
    }
  }, [userName, blogs]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <AppBar />

      <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
       
        <div>
          <h2 className="text-2xl font-bold mb-4">📰 All Posts</h2>
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-white shadow rounded-lg p-4 mb-4"
                >
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              ))
            : blogs.map((blog) => (
                <PostCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  content={blog.content}
                  authorName={blog.author?.name || "Unknown"}
                  published={blog.published}
                />
              ))}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">👤 Your Posts</h2>
          {userBlogs.length > 0 ? (
            userBlogs.map((blog) => (
              <PostCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                content={blog.content}
                authorName={blog.author?.name || "You"}
                published={blog.published}
              />
            ))
          ) : (
            <p className="text-gray-600">You haven’t published anything yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
