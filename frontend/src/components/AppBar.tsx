import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "./Avatar";
import axios from "axios";

const BACKEND_URL = "https://backend.kundusouhardya.workers.dev/app/v1";

export const AppBar = () => {
  const [name, setName] = useState("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${BACKEND_URL}/user/me`, {
          headers: {
            Authorization: token,
          },
        });
        setName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setName("Unknown");
      }
    };

    fetchUserName();
  }, []);

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1
          className="text-xl font-bold text-black cursor-pointer"
          onClick={() => navigate("/blogs")}
        >
          Medium
        </h1>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/publish")}
            className="text-sm font-medium text-white bg-black px-4 py-2 rounded-full hover:opacity-90 transition"
          >
            Publish
          </button>
          <Avatar authorName={name} />
        </div>
      </div>
    </header>
  );
};
