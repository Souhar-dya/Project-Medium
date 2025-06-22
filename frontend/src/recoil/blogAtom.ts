// recoil/blogAtoms.ts
import { atom, selectorFamily } from "recoil";
import axios from "axios";
import type { Blog } from "../hooks/blog";

const BACKEND_URL = "https://backend.kundusouhardya.workers.dev/app/v1";

export const blogAtom = atom<Blog | null>({
  key: "blogAtom",
  default: null,
});

export const blogSelector = selectorFamily<Blog | null, string>({
  key: "blogSelector",
  get: (blogId: string) => async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${BACKEND_URL}/blog/${blogId}`, {
        headers: {
          Authorization: token,
        },
      });
      return res.data.blog;
    } catch (err) {
      console.error("Failed to fetch blog:", err);
      return null;
    }
  },
});
