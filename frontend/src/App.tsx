import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Toaster } from "react-hot-toast";
import { Blogs } from "./pages/Blogs";
import { BlogDetail } from "./pages/BlogDetail";
import { Publish } from "./pages/Publish";


function App() {
  return (
    <>
      <Toaster position="bottom-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path = "/publish" element = {<Publish />} />
          <Route path="/" element={<Navigate to="/signup" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
