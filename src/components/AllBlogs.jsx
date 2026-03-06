"use client";
import React, { useEffect, useState } from "react";
import ManageModal from "./Modal/ManageModal";
import { getAllBlogs } from "@/services/CreateBlogService";

export default function AllBlogs({ userInfo }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    const res = await getAllBlogs();
    if (res.success) {
      setBlogs(res.blogs);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openManageModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };
  return (
    <>
      <div className="md:p-4 p-2">
        <h1 className="text-[#00ADB5] text-4xl uppercase">All Blogs</h1>
      </div>
      <div className="bg-[#00ADB5] h-2"></div>
      <div className="md:p-4 p-2 space-y-4">
        {loading ? (
          <p className="text-[#FFEE02] animate-pulse">Loading Blogs...</p>
        ) : blogs.length > 0 ? (
          blogs.map((blog, idx) => (
            <BlogCard
              key={idx}
              blog={blog}
              onManage={() => openManageModal(blog)}
            />
          ))
        ) : (
          <p className="text-[#F9F9F7]">No blogs found.</p>
        )}
      </div>
      {isModalOpen && (
        <ManageModal
          onClose={() => setIsModalOpen(false)}
          blog={selectedBlog}
          onRefresh={fetchBlogs}
          userInfo={userInfo}
        />
      )}
    </>
  );
}

function BlogCard({ blog, onManage }) {
  const date = blog.time
    ? new Date(blog.time).toLocaleDateString("en-GB")
    : "N/A";
  return (
    <div>
      <div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-xl text-[#F9F9F7] font-medium line-clamp-1 uppercase">
              {blog.heading}
            </h1>
            <p className="md:text-sm text-xs font-medium text-[#00ADB5]">
              Published on {date}
            </p>
          </div>
          <button
            onClick={onManage}
            className="text-[#1A1A1B] bg-[#FFEE02] px-4 py-2 text-base font-medium uppercase cursor-pointer rounded-xl hover:scale-110 transition-all duration-300"
          >
            Manage
          </button>
        </div>
        <div className="pt-4">
          <div className="bg-[#00ADB5] h-0.5 w-full"></div>
        </div>
      </div>
    </div>
  );
}
