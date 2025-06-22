import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "https://backend.kundusouhardya.workers.dev/app/v1";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/user/me`, {
          headers: {
            Authorization: token || "",
          },
        });
        setAuthorName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BACKEND_URL}/blog`,
        { title, content },
        {
          headers: {
            Authorization: token || "",
          },
        }
      );
      setIsPublished(true); 
    } catch (err) {
      console.error("Failed to publish blog", err);
      alert("Publishing failed.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) return <div className="p-4">Loading user...</div>;

  if (isPublished) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">
          ✅ Blog Published Successfully!
        </h2>
        <button
          onClick={() => navigate("/blogs")}
          className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6">Create a New Post</h2>
      <p className="text-sm mb-4 text-gray-600">Author: {authorName}</p>

      <input
        type="text"
        placeholder="Title"
        className="w-full border p-3 rounded mb-4 text-lg"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Write your content here..."
        className="w-full border p-3 rounded h-60 text-lg mb-6"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={handlePublish}
        disabled={isPublishing}
        className={`bg-black text-white px-6 py-2 rounded hover:bg-gray-800 ${
          isPublishing ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isPublishing ? "Publishing..." : "Publish"}
      </button>
    </div>
  );
};
