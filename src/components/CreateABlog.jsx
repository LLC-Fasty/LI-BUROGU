"use client";
import React, { useEffect, useState } from "react";

import { encodeSafe } from "@/lib/utils";
import { createBlog, validateHeading } from "@/services/CreateBlogService";
import CreateBlogModal from "./Modal/CreateBlogModal";
import ErrorBlogModal from "./Modal/ErrorModal";

export default function CreateABlog({ userInfo }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [heading, setHeading] = useState("");
  const [headingStatus, setHeadingStatus] = useState(null);

  const [paragraphs, setParagraphs] = useState([""]);

  const [loading, setLoading] = useState(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [errorMessageTemp, setErrorMessageTemp] = useState("");
  const addParagraph = () => setParagraphs([...paragraphs, ""]);

  useEffect(() => {
    if (!heading.trim()) {
      setHeadingStatus("idle");
      return;
    }

    setHeadingStatus("checking");

    const debounceCheck = setTimeout(async () => {
      const encoded = encodeSafe(JSON.stringify(heading.toUpperCase()));

      const { unique, error } = await validateHeading(encoded);

      if (error) {
        console.log("Validation Error:", error);
        setHeadingStatus("idle");
      } else {
        if (!unique) {
          setErrorMessageTemp(
            "This heading is already taken. Please choose another one.",
          );
        } else {
          setErrorMessageTemp("");
        }
        setHeadingStatus(unique ? "unique" : "taken");
      }
    }, 600);

    return () => clearTimeout(debounceCheck);
  }, [heading]);

  const updateParagraph = (index, value) => {
    const updated = [...paragraphs];
    updated[index] = value;
    setParagraphs(updated);
  };

  const deleteParagraph = (index) => {
    if (paragraphs.length > 1) {
      setParagraphs(paragraphs.filter((_, i) => i !== index));
    }
  };

  const handleCreateBlog = async () => {
    if (headingStatus === "taken") {
      setErrorMessage("Please change your heading, it's already taken!");
      setIsErrorModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const contentObj = paragraphs.reduce((acc, text, index) => {
        acc[`p${index + 1}`] = text;
        return acc;
      }, {});

      const payload = encodeSafe(
        JSON.stringify({
          heading: heading.toUpperCase(),
          content: contentObj,
          ip: userInfo.ipAddress,
        }),
      );

      let { success, error, result } = await createBlog(payload);
      if (success) {
        setIsModalOpen(true);
      } else {
        setErrorMessage(error);
        setIsErrorModalOpen(true);
      }
    } catch (err) {
      setErrorMessage("NETWORK ERROR: COULD NOT CONNECT TO SERVER.");
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled =
    loading ||
    !heading.trim() ||
    headingStatus === "checking" ||
    headingStatus === "taken";

  return (
    <>
      <div className="md:p-4 p-2">
        <h1 className="text-[#FFEE02] text-4xl uppercase">Create A Blog</h1>
      </div>
      <div className="bg-[#FFEE02] h-2"></div>
      <div className="p-4">
        <div>
          <h1 className="text-[#F9F9F7] uppercase md:text-base text-sm font-medium">
            Enter the Blog Heading
          </h1>
          <div>
            <textarea
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="This Will by Your Heading in Full Caps"
              className="w-full border-2 border-[#FFEE02] focus:border-[#00ADB5] transition-all duration-300 p-2 md:text-2xl text-lg font-medium text-[#00ADB5] placeholder:text-[#00ADB5]/50 outline-none max-h-30 min-h-30 overflow-y-auto md:overflow-y-auto md:[&::-webkit-scrollbar]:w-2 md:[&::-webkit-scrollbar-thumb]:bg-[#00ADB5] md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-track]:my-1"
            />
          </div>
        </div>
        {/* error for heading not unique */}
        {errorMessageTemp && errorMessageTemp.length > 1 && (
          <span className="text-red-700 font-bold">{errorMessageTemp}</span>
        )}
      </div>
      <div className="bg-[#FFEE02] h-0.5"></div>
      <div className="p-4">
        <div>
          <div className="flex justify-between items-end gap-4">
            <h1 className="text-[#F9F9F7] uppercase md:text-base text-sm font-medium">
              Enter the Blog Content
            </h1>
          </div>
          <div className="space-y-2">
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
            </div>
            <div>
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

            {/* map for para */}
            {paragraphs.map((para, index) => (
              <div key={index}>
                <textarea
                  value={para}
                  onChange={(e) => updateParagraph(index, e.target.value)}
                  placeholder={`This will be Paragraph ${index + 1} content...`}
                  className="w-full border-2 border-[#FFEE02] focus:border-[#00ADB5] transition-all duration-300 p-2 md:text-2xl text-lg font-medium text-[#00ADB5] placeholder:text-[#00ADB5]/50 outline-none max-h-30 min-h-30 overflow-y-auto md:overflow-y-auto md:[&::-webkit-scrollbar]:w-2 md:[&::-webkit-scrollbar-thumb]:bg-[#00ADB5] md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-track]:my-1"
                />
                <div className="flex justify-end items-center pb-2">
                  <button
                    disabled={paragraphs.length < 2}
                    onClick={() => deleteParagraph(index)}
                    className="text-[#F9F9F7] bg-[#FF0808] px-4 py-1 md:text-base text-xs font-medium uppercase cursor-pointer rounded-xl hover:scale-110 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete This Paragraph
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="md:-mt-10 -mt-8">
            <button
              onClick={addParagraph}
              className="text-[#1A1A1B] bg-[#00ADB5] px-4 py-1 md:text-base text-sm font-medium uppercase cursor-pointer rounded-xl hover:scale-110 transition-all duration-300"
            >
              Add Paragraph
            </button>
          </div>
        </div>
      </div>
      <div className="bg-[#FFEE02] h-0.5"></div>
      <div className="p-4">
        <button
          onClick={handleCreateBlog}
          disabled={isButtonDisabled}
          className="uppercase cursor-pointer w-full md:py-2 py-1 px-4 bg-[#00ADB5] text-center md:text-lg text-base font-medium hover:bg-[#00ADB5]/80 transition-all duration-300 hover:tracking-widest disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Processing..." : "Click Here To Create the Blog"}
        </button>
      </div>
      {isModalOpen && (
        <CreateBlogModal
          onClose={() => {
            setHeading("");
            setParagraphs([""]);
            setIsModalOpen(false);
          }}
          heading={heading}
        />
      )}

      {isErrorModalOpen && (
        <ErrorBlogModal
          errorMessage={errorMessage}
          onClose={() => setIsErrorModalOpen(false)}
        />
      )}
    </>
  );
}
