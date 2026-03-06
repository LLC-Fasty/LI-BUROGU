"use client";
import { encodeSafe } from "@/lib/utils";
import {
  deleteBlog,
  updateBlog,
  validateHeading,
} from "@/services/CreateBlogService";
import React, { useState, useEffect } from "react";

const ManageModal = ({ blog, onClose, onRefresh, userInfo }) => {
  const [activeTab, setActiveTab] = useState("menu");
  const [opt, setOpt] = useState("");

  const [loading, setLoading] = useState(false);

  const [editHeading, setEditHeading] = useState(blog?.heading || "");
  const [editParagraphs, setEditParagraphs] = useState([]);

  const [headingStatus, setHeadingStatus] = useState(null);
  const [errorMessageTemp, setErrorMessageTemp] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (blog?.content) {
      const paras = Object.keys(blog.content)
        .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)))
        .map((key) => blog.content[key]);

      setEditParagraphs(paras);
    }
  }, [blog]);

  useEffect(() => {
    if (!editHeading.trim()) {
      setHeadingStatus("idle");
      return;
    }

    if (editHeading.toUpperCase() === blog?.heading?.toUpperCase()) {
      setHeadingStatus("unique");
      setErrorMessageTemp("");
      return;
    }

    setHeadingStatus("checking");

    const debounceCheck = setTimeout(async () => {
      const encoded = encodeSafe(JSON.stringify(editHeading.toUpperCase()));
      const { unique, error: apiErr } = await validateHeading(encoded);

      if (apiErr) {
        setHeadingStatus("idle");
      } else {
        if (!unique) {
          setErrorMessageTemp("This heading is already taken by another blog.");
        } else {
          setErrorMessageTemp("");
        }
        setHeadingStatus(unique ? "unique" : "taken");
      }
    }, 600);

    return () => clearTimeout(debounceCheck);
  }, [editHeading, blog?.heading]);

  const handleUpdate = async () => {
    setLoading(true);
    setOpt("upd");
    setError("");

    const contentObj = editParagraphs.reduce((acc, text, index) => {
      acc[`p${index + 1}`] = text;
      return acc;
    }, {});

    let data = encodeSafe(
      JSON.stringify({
        heading: editHeading,
        content: contentObj,
        ip: userInfo?.ipAddress,
      }),
    );

    const res = await updateBlog(blog.id, data);

    if (res.success) {
      setError("");
      setActiveTab("save");
      if (onRefresh) onRefresh();
    } else {
      setError(res.error || "Failed to update the blog.");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    setOpt("del");

    const res = await deleteBlog(blog.id);

    if (res.success) {
      setError("");
      setActiveTab("save");
      if (onRefresh) onRefresh();
    } else {
      setError(res.error || "Failed to delete the blog.");
      setLoading(false);
    }
  };

  const updateParaText = (index, val) => {
    const updated = [...editParagraphs];
    updated[index] = val;
    setEditParagraphs(updated);
  };

  const addPara = () => setEditParagraphs([...editParagraphs, ""]);
  const removePara = (index) => {
    if (editParagraphs.length > 1) {
      setEditParagraphs(editParagraphs.filter((_, i) => i !== index));
    }
  };

  const publishedDate = blog?.time
    ? new Date(blog.time).toLocaleDateString("en-GB")
    : "N/A";

  const isButtonDisabled =
    loading ||
    !editHeading.trim() ||
    headingStatus === "checking" ||
    headingStatus === "taken";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:p-10 p-4 bg-[#1A1A1B]/50 backdrop-blur-md">
      <div className="bg-[#1A1A1B] border-2 border-[#00ADB5] w-full overflow-hidden shadow-[0_0_50px_-12px_rgba(0,173,181,0.3)] animate-in fade-in zoom-in duration-200">
        <div className="p-6 flex items-center justify-between gap-4">
          <h1 className="md:text-4xl text-2xl font-medium uppercase text-[#00ADB5]">
            MANAGE
          </h1>
          <p className="text-[#F9F9F7] font-medium md:text-sm text-xs">
            Published on {publishedDate}
          </p>
        </div>

        {/* Error Notification Bar */}
        {error && error.length > 1 && (
          <div className="bg-[#FF0808] text-[#F9F9F7] px-6 py-2 text-xs uppercase font-bold ">
            ERROR: {error}
          </div>
        )}
        {activeTab === "menu" && (
          <>
            <div className="bg-[#00ADB5] h-0.5"></div>
            <div className="p-6">
              <h1 className="md:text-2xl text-lg font-medium uppercase text-[#F9F9F7]">
                {blog?.heading}
              </h1>
            </div>
            <div className="bg-[#00ADB5] h-0.5"></div>
            <div className="p-6">
              <div className="md:flex items-center md:gap-6">
                <button
                  onClick={() => {
                    setActiveTab("edit");
                  }}
                  className="cursor-pointer w-full bg-[#FFEE02] uppercase px-4 py-2 md:text-lg text-base hover:bg-[#FFEE02]/80 transition-all duration-300 text-[#1A1A1B] font-medium"
                >
                  Edit Blog
                </button>
                <button
                  onClick={() => {
                    setActiveTab("delete");
                  }}
                  className="cursor-pointer w-full bg-[#FF0808] uppercase px-4 py-2 md:text-lg text-base hover:bg-[#FF0808]/80 transition-all duration-300 text-[#F9F9F7] font-medium"
                >
                  Delete Blog
                </button>
                <button
                  onClick={onClose}
                  className="cursor-pointer w-full bg-[#F9F9F7] uppercase px-4 py-2 md:text-lg text-base hover:bg-[#F9F9F7]/80 transition-all duration-300 text-[#1A1A1B] font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
        {activeTab === "edit" && (
          <>
            <div className="bg-[#00ADB5] h-0.5"></div>
            <div className="max-h-[60vh] overflow-y-auto md:overflow-y-auto md:[&::-webkit-scrollbar]:w-2 md:[&::-webkit-scrollbar-thumb]:bg-[#00ADB5] md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-track]:my-1">
              <div className="p-4">
                <div>
                  <h1 className="text-[#F9F9F7] uppercase md:text-base text-sm font-medium">
                    Edit the Blog Heading
                  </h1>
                  <div>
                    <textarea
                      type="text"
                      value={editHeading}
                      onChange={(e) => setEditHeading(e.target.value)}
                      placeholder="This Will by Your Heading in Full Caps"
                      className="w-full border-2 border-[#FFEE02] focus:border-[#00ADB5] transition-all duration-300 p-2 md:text-2xl text-lg font-medium text-[#00ADB5] placeholder:text-[#00ADB5]/50 outline-none max-h-30 min-h-30 overflow-y-auto md:overflow-y-auto md:[&::-webkit-scrollbar]:w-2 md:[&::-webkit-scrollbar-thumb]:bg-[#00ADB5] md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-track]:my-1"
                    />
                  </div>
                </div>
                {/* error for heading not unique */}
                {errorMessageTemp && errorMessageTemp.length > 1 && (
                  <span className="text-red-700 font-bold">
                    {errorMessageTemp}
                  </span>
                )}
              </div>
              <div className="bg-[#FFEE02] h-0.5"></div>
              <div className="p-4">
                <div>
                  <div className="flex justify-between items-end gap-4">
                    <h1 className="text-[#F9F9F7] uppercase md:text-base text-sm font-medium">
                      Edit the Blog Content
                    </h1>
                  </div>
                  <div className="space-y-2">
                    {editParagraphs.map((para, idx) => (
                      <div key={idx}>
                        <textarea
                          type="text"
                          value={para}
                          onChange={(e) => updateParaText(idx, e.target.value)}
                          placeholder="This Will by Your Content Paragraph and this will be the single paragraph of your blog. You can write anything here. It can be a introduction to your blog or anything you want."
                          className="w-full border-2 border-[#FFEE02] focus:border-[#00ADB5] transition-all duration-300 p-2 md:text-2xl text-lg font-medium text-[#00ADB5] placeholder:text-[#00ADB5]/50 outline-none max-h-30 min-h-30 overflow-y-auto md:overflow-y-auto md:[&::-webkit-scrollbar]:w-2 md:[&::-webkit-scrollbar-thumb]:bg-[#00ADB5] md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-track]:my-1"
                        />
                        <div className="flex justify-end items-center pb-2">
                          <button
                            onClick={() => removePara(idx)}
                            className="text-[#F9F9F7] bg-[#FF0808] px-4 py-1 md:text-base text-xs font-medium uppercase cursor-pointer rounded-xl hover:scale-110 transition-all duration-300"
                          >
                            Delete This Paragraph
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* <div>
                      <textarea
                        type="text"
                        placeholder="This Will by Your Content Paragraph and this will be the single paragraph of your blog. You can write anything here. It can be a introduction to your blog or anything you want."
                        className="w-full border-2 border-[#FFEE02] focus:border-[#00ADB5] transition-all duration-300 p-2 md:text-2xl text-lg font-medium text-[#00ADB5] placeholder:text-[#00ADB5]/50 outline-none max-h-30 min-h-30 overflow-y-auto md:overflow-y-auto md:[&::-webkit-scrollbar]:w-2 md:[&::-webkit-scrollbar-thumb]:bg-[#00ADB5] md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-track]:my-1"
                      />
                      <div className="flex justify-end items-center pb-2">
                        <button
                          onClick={() => setTab("All Blogs")}
                          className="text-[#F9F9F7] bg-[#FF0808] px-4 py-1 md:text-base text-xs font-medium uppercase cursor-pointer rounded-xl hover:scale-110 transition-all duration-300"
                        >
                          Delete This Paragraph
                        </button>
                      </div>
                    </div> */}
                  </div>
                  <div className="md:-mt-10 -mt-8">
                    <button
                      onClick={addPara}
                      className="text-[#1A1A1B] bg-[#00ADB5] px-4 py-1 md:text-base text-sm font-medium uppercase cursor-pointer rounded-xl hover:scale-110 transition-all duration-300"
                    >
                      Add Paragraph
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#00ADB5] h-0.5"></div>
            <div className="p-6">
              <div className="md:flex items-center md:gap-6">
                <button
                  onClick={handleUpdate}
                  disabled={isButtonDisabled}
                  className="cursor-pointer w-full bg-[#FFEE02] uppercase px-4 py-2 md:text-lg text-base hover:bg-[#FFEE02]/80 transition-all duration-300 text-[#1A1A1B] font-medium disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Commit Changes"}
                </button>
                <button
                  onClick={() => {
                    setActiveTab("delete");
                  }}
                  className="cursor-pointer w-full bg-[#FF0808] uppercase px-4 py-2 md:text-lg text-base hover:bg-[#FF0808]/80 transition-all duration-300 text-[#F9F9F7] font-medium "
                >
                  Delete Blog
                </button>
                <button
                  onClick={onClose}
                  className="cursor-pointer w-full bg-[#F9F9F7] uppercase px-4 py-2 md:text-lg text-base hover:bg-[#F9F9F7]/80 transition-all duration-300 text-[#1A1A1B] font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
        {activeTab === "delete" && (
          <>
            <div className="bg-[#00ADB5] h-0.5"></div>
            <div className="md:p-6 p-2">
              <h1 className="text-[#00ADB5] md:text-2xl text-lg text-center uppercase font-bold">
                {blog?.heading}
              </h1>
              <h1 className="text-[#FF0808] md:text-4xl text-lg text-center uppercase font-bold pt-4">
                Do your Really want to Delete this blog!
              </h1>
            </div>
            <div className="bg-[#00ADB5] h-0.5"></div>
            <div className="p-6">
              <div className="md:flex items-center md:gap-6">
                <button
                  onClick={() => {
                    setActiveTab("menu");
                  }}
                  disabled={loading}
                  className="cursor-pointer w-full bg-[#FFEE02] uppercase px-4 py-2 md:text-lg text-base hover:bg-[#FFEE02]/80 transition-all duration-300 text-[#1A1A1B] font-medium disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Go Back
                </button>
                <button
                  disabled={loading}
                  onClick={handleDelete}
                  className="cursor-pointer w-full bg-[#FF0808] uppercase px-4 py-2 md:text-lg text-base hover:bg-[#FF0808]/80 transition-all duration-300 text-[#F9F9F7] font-medium disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Confirm to Delete"}
                </button>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="cursor-pointer w-full bg-[#F9F9F7] uppercase px-4 py-2 md:text-lg text-base hover:bg-[#F9F9F7]/80 transition-all duration-300 text-[#1A1A1B] font-medium disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
        {activeTab === "save" && (
          <>
            <div className="bg-[#00ADB5] h-0.5"></div>
            <div className="md:p-6 p-2">
              <h1 className="text-[#00ADB5] md:text-2xl text-lg text-center uppercase font-bold">
                {opt === "upd" ? editHeading : blog?.heading}
              </h1>
              <h1 className="text-[#FFEE02] md:text-4xl text-lg text-center uppercase font-bold pt-4">
                {opt === "upd"
                  ? "Changes Successfully Committed!"
                  : "Blog Deleted Successfully!"}
              </h1>
            </div>
            <div className="bg-[#00ADB5] h-0.5"></div>
            <div className="p-6">
              <div className="md:flex items-center md:gap-6">
                <button
                  onClick={onClose}
                  className="cursor-pointer w-full bg-[#F9F9F7] uppercase px-4 py-2 md:text-lg text-base hover:bg-[#F9F9F7]/80 transition-all duration-300 text-[#1A1A1B] font-medium"
                >
                  DONE
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageModal;
