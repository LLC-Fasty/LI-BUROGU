import { getAllBlogs } from "@/services/CreateBlogService";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function HomeMainDesign({ DarkMode, setDarkMode }) {
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const blogsRef = useRef([]);

  const fetchBlogs = async (isInitialLoad = false) => {
    try {
      const res = await getAllBlogs();
      if (res.success) {
        const newDataString = JSON.stringify(res.blogs);
        const oldDataString = JSON.stringify(blogsRef.current);

        if (newDataString !== oldDataString) {
          // console.log("New content detected. Updating Narrative Engine...")
          setBlogs(res.blogs);
          blogsRef.current = res.blogs;
        } else {
          // console.log("No changes detected. Maintaining current state.");
        }
      }
    } catch (error) {
      console.error("Failed to sync blogs:", error);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(true);

    const syncInterval = setInterval(
      () => {
        fetchBlogs();
      },
      6 * 60 * 1000,
    );

    return () => clearInterval(syncInterval);
  }, []);

  return (
    <div className="md:flex">
      <div className="md:min-w-1/2 md:max-w-1/2">
        <div className="p-6 flex items-center md:justify-start justify-center gap-6">
          <button
            onClick={() => {
              router.push("/");
            }}
            className={`p-2 cursor-pointer rounded-2xl hover:scale-110 hover:-rotate-15 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-10 h-10 transition-all duration-300 ${DarkMode ? "text-[#1A1A1B]" : "text-[#F9F9F7]"}`}
              fill="none"
              viewBox="0 0 320 390"
            >
              <path
                fill="currentColor"
                d="M0 72.727C0 32.561 32.561 0 72.727 0A7.273 7.273 0 0 1 80 7.273V300c0 22.091-17.909 40-40 40S0 322.091 0 300z"
              ></path>
              <circle cx="220" cy="290" r="100" fill="currentColor"></circle>
              <circle cx="200" cy="80" r="80" fill="#00ADB5"></circle>
            </svg>
          </button>
          <button
            onClick={() => {
              setDarkMode(!DarkMode);
            }}
            className={`p-2 cursor-pointer rounded-2xl hover:scale-110 hover:-rotate-15 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          >
            {DarkMode ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`w-10 h-10 transition-all duration-300 ${DarkMode ? "text-[#1A1A1B] rotate-360" : "text-[#F9F9F7]"}`}
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z"
                    fill="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`w-10 h-10 transition-all duration-300 ${DarkMode ? "text-[#1A1A1B] rotate-360" : "text-[#F9F9F7]"}`}
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
                    fill="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 2V3.5M12 20.5V22M19.0708 19.0713L18.0101 18.0106M5.98926 5.98926L4.9286 4.9286M22 12H20.5M3.5 12H2M19.0713 4.92871L18.0106 5.98937M5.98975 18.0107L4.92909 19.0714"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
        <div className="flex pt-6">
          <div className="w-full">
            <h1 className="text-[#00ADB5] md:text-[8vw] text-[24vw] font-medium uppercase md:text-left text-center leading-[0.9]">
              LI-Burogu
            </h1>
            <p
              className={`md:text-[1.5vw] text-[3.5vw] md:text-right text-center md:pr-4 transition-all duration-300 ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"}`}
            >
              A BLOG WEB APP Powered by{" "}
              <span className="font-bold">LICICO</span>
            </p>
          </div>
        </div>
        <div className="md:pt-10 pt-8">
          <div
            className={`w-full h-12 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
          <div
            className={`w-full h-10 mt-12 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
          <div className="pt-5 px-4">
            <h1
              className={`md:text-4xl text-2xl uppercase md:text-left text-center transition-all font-bold duration-300 ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"}`}
            >
              The Narrative Engine
            </h1>
          </div>
          <div
            className={`w-full h-8 mt-5 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
          <div
            className={`w-full h-6 mt-8 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
          <div className="pt-3 px-4">
            <h1
              className={`md:text-lg text-base uppercase md:text-left text-center transition-all font-bold duration-300 ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"}`}
            >
              Some ideas need more than a place to be posted,they need a place
              to unfold. Burogu was built by the
              <span className="text-[#00ADB5] font-semibold">
                {" "}
                LICICO Founders
              </span>
              with that in mind.
            </h1>
          </div>
          <div
            className={`w-full h-4 mt-3 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
          <div
            className={`w-full h-2 mt-4 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
          <div
            className={`w-full h-0.5 mt-2 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
        </div>
        <div className="py-2">
          <h1
            className={`text-center md:text-lg text-sm font-medium transition-all duration-300 ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"}`}
          >
            © 2026 LiCiCo. All rights reserved.
          </h1>
        </div>
        <div
          className={`w-full h-0.5 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
        ></div>
      </div>
      <div className="md:min-w-1/2 md:max-w-1/2 md:pt-0 pt-10">
        <div className="md:min-h-screen md:max-h-screen flex items-center w-full md:pr-3">
          <div
            className={`md:min-h-[98vh] md:max-h-[98vh] md:overflow-y-auto w-full transition-all duration-300 rounded-2xl md:[clip-path:inset(-100px_-100px_-100px_0px)] md:shadow-[40px_0px_50px_-15px_#00ADB5,0px_-25px_40px_-20px_#00ADB5,0px_25px_40px_-20px_#00ADB5] md:[&::-webkit-scrollbar]:w-2 md:[&::-webkit-scrollbar-thumb]:bg-[#00ADB5] md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-track]:my-6 ${DarkMode ? "bg-[#F9F9F7] md:[&::-webkit-scrollbar-track]:bg-[#F9F9F7]" : "bg-[#1A1A1B] md:[&::-webkit-scrollbar-track]:bg-[#1A1A1B]"}`}
          >
            <div className="p-6 space-y-6">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-[#00ADB5] animate-pulse font-bold uppercase">
                    Streaming Blogs...
                  </p>
                </div>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    DarkMode={DarkMode}
                    router={router}
                  />
                ))
              ) : (
                <p
                  className={`text-center py-10 ${DarkMode ? "text-[#1A1A1B]" : "text-[#F9F9F7]"}`}
                >
                  No stories found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogCard({ DarkMode, router, blog }) {
  const publishedDate = blog.time
    ? new Date(blog.time).toLocaleDateString("en-GB")
    : "N/A";
  return (
    <div
      className={`p-2 rounded-xl transition-all duration-300 ${DarkMode ? "bg-[#1A1A1B]" : "bg-[#F9F9F7]"}`}
    >
      <h1
        className={`px-2 pb-2 uppercase md:text-6xl text-3xl transition-all duration-300 line-clamp-1 truncate ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"}`}
      >
        {blog.heading}
      </h1>
      <div className="bg-[#00ADB5] py-1 rounded-full"></div>
      <p
        className={`px-2 pt-2 line-clamp-4 md:text-base text-sm transition-all duration-300 ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"}`}
      >
        {blog.content?.p1}
      </p>
      <div className="px-2 pt-2 flex items-center justify-between gap-4">
        <button
          onClick={() => router.push(`/Blog/${blog.id}`)}
          className="bg-[#00ADB5] cursor-pointer transition-all duration-300 hover:tracking-widest px-4 py-1.5 rounded-xl hover:bg-[#00ADB5]/80"
        >
          Read Blog
        </button>
        <p
          className={`md:text-sm text-xs pt-2 font-medium transition-all duration-300 ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"}`}
        >
          {publishedDate}
        </p>
      </div>
    </div>
  );
}
