import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { blogAtom, blogSelector } from "../recoil/blogAtom";
import { AppBar } from "../components/AppBar";

function estimateReadTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export const BlogDetail = () => {
  const { id } = useParams();
  const blogLoadable = useRecoilValueLoadable(blogSelector(id || ""));
  const [, setBlogState] = useRecoilState(blogAtom);

  if (!id) return <div className="p-4 text-red-500">Invalid blog ID</div>;

  if (blogLoadable.state === "loading") {
    return (
      <>
        <AppBar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-black border-t-transparent"></div>
        </div>
      </>
    );
  }

  if (blogLoadable.state === "hasError") {
    return (
      <>
        <AppBar />
        <div className="p-4 text-red-500">Error loading blog.</div>
      </>
    );
  }

  const blog = blogLoadable.contents;

  setBlogState(blog);

  if (!blog) return <div className="p-4 text-red-500">Blog not found</div>;

  const readTime = estimateReadTime(blog.content);

  return (
    <>
      <AppBar />
      <div className="bg-white min-h-screen font-sans text-gray-800 px-6 py-12 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div className="md:w-3/4">
            <h1 className="text-4xl font-extrabold mb-2">{blog.title}</h1>
            <p className="text-gray-500 text-sm mb-8">⏱ {readTime} min read</p>
            <div className="text-lg leading-relaxed text-justify whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>

          <div className="md:w-1/4 mt-10 md:mt-0 md:pl-10 border-t md:border-t-0 md:border-l md:border-gray-200">
            <div className="md:pl-6 pt-4 md:pt-0">
              <p className="text-gray-500 text-sm uppercase tracking-wide">
                Author
              </p>
              <div className="mt-2">
                <div className="text-lg font-semibold">
                  {blog.author?.name || "Unknown"}
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {blog.author?.name
                    ? "Thoughtful writer sharing their insights."
                    : "Anonymous contributor"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
