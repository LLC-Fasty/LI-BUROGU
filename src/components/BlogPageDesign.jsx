import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getBlogByCid,
  getInteractionStatus,
  toggleInteraction,
} from "@/services/CreateBlogService";
import { decodeSafe, encodeSafe } from "@/lib/utils";
import { useUserGeoInfo } from "@/hooks/useUserGeoInfo";

export default function BlogPageDesign({ DarkMode, setDarkMode, cid }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Liked, setLiked] = useState(false);
  const [DisLiked, setDisLiked] = useState(false);
  const router = useRouter();
  const [isCopyAlertVisible, setIsCopyAlertVisible] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const userInfo = useUserGeoInfo();

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await getBlogByCid(cid);
      if (res.success) {
        const outerData = JSON.parse(decodeSafe(res.data));

        const heading = JSON.parse(decodeSafe(outerData.heading));
        const content = JSON.parse(decodeSafe(outerData.content));

        setBlog({
          ...outerData,
          heading,
          content,
        });
      }
      setLoading(false);
    };
    if (cid) fetchBlog();
  }, [cid]);

  useEffect(() => {
    const fetchStatus = async () => {
      if (blog?.id && userInfo?.ipAddress) {
        let iData = encodeSafe(
          JSON.stringify({ blogId: blog.id, userIp: userInfo.ipAddress }),
        );
        const res = await getInteractionStatus(iData);
        if (res.success) {
          setLiked(res.userHasLiked);
          setDisLiked(res.userHasDisliked);
          setBlog((prev) => ({
            ...prev,
            likes: res.likes,
            dislikes: res.dislikes,
          }));
        }
      }
    };
    fetchStatus();
  }, [blog?.id, userInfo?.ipAddress]);

  const handleLikeToggle = async (type) => {
    if (!blog?.id || !userInfo?.ipAddress) return;

    let iData = encodeSafe(
      JSON.stringify({
        blogId: blog.id,
        userIp: userInfo.ipAddress,
        action: type,
      }),
    );
    const res = await toggleInteraction(iData);
    if (res.success) {
      setLiked(res.userHasLiked);
      setDisLiked(res.userHasDisliked);
      setBlog((prev) => ({
        ...prev,
        likes: res.likes,
        dislikes: res.dislikes,
      }));
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsCopyAlertVisible(true);
  };

  const handleInfoModal = () => {
    setInfoModal(true);
  };

  const paragraphs =
    blog &&
    Object.keys(blog?.content)
      .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)))
      .map((key) => blog.content[key]);

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-[#00ADB5] animate-pulse md:text-6xl text-2xl font-black text-center uppercase">
            Loading Narrative...
          </h1>
        </div>
      )}
      {!loading && !blog && (
        <div className="flex items-center justify-center min-h-screen bg-[#1A1A1B]">
          <div>
            <div className="flex justify-center pb-10 hover:-rotate-45 transition-all duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-40 h-40 transition-all duration-300 text-[#F9F9F7]`}
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
            </div>
            <h1 className="text-center text-red-500 font-bold md:text-6xl text-3xl uppercase">
              BLOG NOT FOUND
            </h1>
            <div className="pt-10 flex justify-center">
              <button
                onClick={() => {
                  router.push("/");
                }}
                className="bg-[#FFEE02] text-[#1A1A1B] px-4 py-2 font-bold text-center hover:scale-110 transition-all duration-300 cursor-pointer"
              >
                Go Back to LI-BUROGU
              </button>
            </div>
          </div>
        </div>
      )}
      {!loading && blog && (
        <div>
          <CopyAlert
            isVisible={isCopyAlertVisible}
            onClose={() => setIsCopyAlertVisible(false)}
          />

          <div className="flex justify-between gap-4 items-center">
            <div className="md:p-6 p-2 flex items-center md:justify-start justify-center md:gap-6 gap-2">
              <button
                onClick={() => {
                  router.push("/");
                }}
                className={`p-2 cursor-pointer rounded-2xl hover:scale-110 hover:-rotate-15 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`w-10 h-10 transition-all duration-300 ${DarkMode ? "text-[#1A1A1B]" : "text-[#F9F9F7]"}`}
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M3 11.9896V14.5C3 17.7998 3 19.4497 4.02513 20.4749C5.05025 21.5 6.70017 21.5 10 21.5H14C17.2998 21.5 18.9497 21.5 19.9749 20.4749C21 19.4497 21 17.7998 21 14.5V11.9896C21 10.3083 21 9.46773 20.6441 8.74005C20.2882 8.01237 19.6247 7.49628 18.2976 6.46411L16.2976 4.90855C14.2331 3.30285 13.2009 2.5 12 2.5C10.7991 2.5 9.76689 3.30285 7.70242 4.90855L5.70241 6.46411C4.37533 7.49628 3.71179 8.01237 3.3559 8.74005C3 9.46773 3 10.3083 3 11.9896Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15Z"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
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
                  <circle
                    cx="220"
                    cy="290"
                    r="100"
                    fill="currentColor"
                  ></circle>
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
            <div className="md:px-6 px-2">
              <h1
                className={`md:text-5xl text-3xl font-medium uppercase transition-all duration-300 ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"}`}
              >
                LI-Burogu
              </h1>
            </div>
          </div>
          <div
            className={`w-full h-12 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
          <div
            className={`w-full h-10 mt-10 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
          <div className="md:px-6 px-2 pt-4">
            <h1
              className={`md:text-[4vw] text-[7vw] leading-[1.2] font-bold transition-all duration-300 ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"}`}
            >
              {blog.heading}
            </h1>
            <p
              className={`md:text-sm text-xs pt-2 font-medium transition-all duration-300 ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"}`}
            >
              Published on {new Date(blog.time).toLocaleDateString("en-GB")}
            </p>
          </div>
          <div
            className={`w-full h-8 mt-4 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
          <div
            className={`w-full h-6 mt-6 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
          <div className="md:px-6 px-2 py-6 space-y-6">
            {paragraphs.map((text, index) => (
              <p
                key={index}
                className={`md:text-xl text-base font-bold transition-all duration-300 first-letter:pl-10 ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"}`}
              >
                {text}
              </p>
            ))}
          </div>
          <div
            className={`w-full h-4 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
          <div
            className={`w-full h-2 mt-2 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
          <div className="md:px-6 px-2 py-4 flex justify-between items-center gap-4">
            <div>
              <h1
                className={`md:text-4xl text-2xl uppercase font-medium transition-all duration-300 ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"}`}
              >
                Like | Dislike | Share
              </h1>
            </div>
            <div className={`flex items-center gap-4`}>
              <button
                onClick={() => handleLikeToggle("like")}
                className={`flex items-center gap-2 cursor-pointer bg-[#00ADB5] transition-all duration-300 hover:tracking-widest p-2 rounded-[18px] hover:rounded-[100px] hover:scale-110 hover:bg-[#00ADB5]/80 ${Liked ? "text-[#1A1A1B] rounded-[100px]" : "text-[#F9F9F7]"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="md:w-10 md:h-10 w-6 h-6 transition-all duration-300"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M2 12.5C2 11.3954 2.89543 10.5 4 10.5C5.65685 10.5 7 11.8431 7 13.5V17.5C7 19.1569 5.65685 20.5 4 20.5C2.89543 20.5 2 19.6046 2 18.5V12.5Z"
                    stroke="currentColor"
                    fill={`${Liked ? "#FFEE02" : "none"}`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M15.4787 7.80626L15.2124 8.66634C14.9942 9.37111 14.8851 9.72349 14.969 10.0018C15.0369 10.2269 15.1859 10.421 15.389 10.5487C15.64 10.7065 16.0197 10.7065 16.7791 10.7065H17.1831C19.7532 10.7065 21.0382 10.7065 21.6452 11.4673C21.7145 11.5542 21.7762 11.6467 21.8296 11.7437C22.2965 12.5921 21.7657 13.7351 20.704 16.0211C19.7297 18.1189 19.2425 19.1678 18.338 19.7852C18.2505 19.8449 18.1605 19.9013 18.0683 19.9541C17.116 20.5 15.9362 20.5 13.5764 20.5H13.0646C10.2057 20.5 8.77628 20.5 7.88814 19.6395C7 18.7789 7 17.3939 7 14.6239V13.6503C7 12.1946 7 11.4668 7.25834 10.8006C7.51668 10.1344 8.01135 9.58664 9.00069 8.49112L13.0921 3.96056C13.1947 3.84694 13.246 3.79012 13.2913 3.75075C13.7135 3.38328 14.3652 3.42464 14.7344 3.84235C14.774 3.8871 14.8172 3.94991 14.9036 4.07554C15.0388 4.27205 15.1064 4.37031 15.1654 4.46765C15.6928 5.33913 15.8524 6.37436 15.6108 7.35715C15.5838 7.46692 15.5488 7.5801 15.4787 7.80626Z"
                    stroke="currentColor"
                    fill={`${Liked ? "#FFEE02" : "none"}`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <span className="md:text-lg text-sm font-bold">
                  {String(blog.likes || 0).padStart(3, "0")}
                </span>
              </button>
              <button
                onClick={() => handleLikeToggle("dislike")}
                className={`flex items-center gap-2 cursor-pointer bg-[#00ADB5] transition-all duration-300 hover:tracking-widest p-2 rounded-[18px] hover:rounded-[100px] hover:scale-110 hover:bg-[#00ADB5]/80 ${DisLiked ? "text-[#1A1A1B] rounded-[100px]" : "text-[#F9F9F7]"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="md:w-10 md:h-10 w-6 h-6 transition-all duration-300"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M2 11.5C2 12.6046 2.89543 13.5 4 13.5C5.65685 13.5 7 12.1569 7 10.5V6.5C7 4.84315 5.65685 3.5 4 3.5C2.89543 3.5 2 4.39543 2 5.5V11.5Z"
                    stroke="currentColor"
                    fill={`${DisLiked ? "#FF0808" : "none"}`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M15.4787 16.1937L15.2124 15.3337C14.9942 14.6289 14.8851 14.2765 14.969 13.9982C15.0369 13.7731 15.1859 13.579 15.389 13.4513C15.64 13.2935 16.0197 13.2935 16.7791 13.2935H17.1831C19.7532 13.2935 21.0382 13.2935 21.6452 12.5327C21.7145 12.4458 21.7762 12.3533 21.8296 12.2563C22.2965 11.4079 21.7657 10.2649 20.704 7.9789C19.7297 5.88111 19.2425 4.83222 18.338 4.21485C18.2505 4.15508 18.1605 4.0987 18.0683 4.04586C17.116 3.5 15.9362 3.5 13.5764 3.5H13.0646C10.2057 3.5 8.77628 3.5 7.88814 4.36053C7 5.22106 7 6.60607 7 9.37607V10.3497C7 11.8054 7 12.5332 7.25834 13.1994C7.51668 13.8656 8.01135 14.4134 9.00069 15.5089L13.0921 20.0394C13.1947 20.1531 13.246 20.2099 13.2913 20.2493C13.7135 20.6167 14.3652 20.5754 14.7344 20.1577C14.774 20.1129 14.8172 20.0501 14.9036 19.9245C15.0388 19.728 15.1064 19.6297 15.1654 19.5323C15.6928 18.6609 15.8524 17.6256 15.6108 16.6429C15.5838 16.5331 15.5488 16.4199 15.4787 16.1937Z"
                    stroke="currentColor"
                    fill={`${DisLiked ? "#FF0808" : "none"}`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <span className="md:text-lg text-sm font-bold">
                  {String(blog.dislikes || 0).padStart(3, "0")}
                </span>
              </button>
              <button
                onClick={handleShare}
                className={`cursor-pointer bg-[#00ADB5] transition-all duration-300 hover:tracking-widest p-2 rounded-[18px] hover:rounded-[100px] hover:scale-110 hover:-rotate-15 hover:bg-[#00ADB5]/80 text-[#F9F9F7]`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="md:w-10 md:h-10 w-6 h-6 transition-all duration-300"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M11.922 4.79004C16.6963 3.16245 19.0834 2.34866 20.3674 3.63261C21.6513 4.91656 20.8375 7.30371 19.21 12.078L18.1016 15.3292C16.8517 18.9958 16.2267 20.8291 15.1964 20.9808C14.9195 21.0216 14.6328 20.9971 14.3587 20.9091C13.3395 20.5819 12.8007 18.6489 11.7231 14.783C11.4841 13.9255 11.3646 13.4967 11.0924 13.1692C11.0134 13.0742 10.9258 12.9866 10.8308 12.9076C10.5033 12.6354 10.0745 12.5159 9.21705 12.2769C5.35111 11.1993 3.41814 10.6605 3.0909 9.64127C3.00292 9.36724 2.97837 9.08053 3.01916 8.80355C3.17088 7.77332 5.00419 7.14834 8.6708 5.89838L11.922 4.79004Z"
                    fill="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div
            className={`w-full h-2 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
          <div className="py-2 md:flex items-center justify-between px-6">
            <h1
              className={`text-center md:text-lg text-sm font-medium transition-all duration-300 ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"}`}
            >
              © 2026 LiCiCo. All rights reserved.
            </h1>
            <div className="flex justify-center">
              <button
                onClick={handleInfoModal}
                className={`cursor-pointer text-center hover:tracking-widest transition-all duration-300 ${DarkMode ? "text-[#F9F9F7]" : "text-[#1A1A1B]"} underline md:text-sm text-sm font-semibold`}
              >
                Terms & Conditions
              </button>
            </div>
          </div>
          <div
            className={`w-full h-2 transition-all duration-300 ${DarkMode ? "bg-[#F9F9F7]" : "bg-[#1A1A1B]"}`}
          ></div>
        </div>
      )}
      {infoModal && <InfoModal onClose={() => setInfoModal(false)} />}
    </div>
  );
}

const CopyAlert = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-200 animate-in slide-in-from-top-10 duration-300">
      <div className="bg-[#FFEE02] border-4 border-[#1A1A1B] px-8 py-3 shadow-[8px_8px_0px_0px_#00ADB5]">
        <div className="flex items-center gap-4">
          <div className="bg-[#1A1A1B] p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[#FFEE02]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-[#1A1A1B] font-black uppercase tracking-tighter text-lg">
            Link Cached to Clipping Engine
          </h1>
        </div>
      </div>
    </div>
  );
};

const InfoModal = ({ onClose }) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-[#1A1A1B]/90 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-[#1A1A1B] border-4 border-[#FFEE02] p-8 max-w-2xl shadow-[30px_30px_0px_0px_#00ADB5] relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 p-2 opacity-10 text-[#FFEE02] text-6xl font-black rotate-12 select-none">
          INFO
        </div>

        <h1 className="text-[#FFEE02] text-3xl font-black uppercase mb-4 italic tracking-tighter">
          System Information
        </h1>

        <div className="space-y-4 text-[#F9F9F7] font-medium uppercase text-xs md:text-sm leading-tight">
          <p>
            You are now entering the{" "}
            <span className="text-[#00ADB5]">LICICO Narrative Engine</span>.
          </p>

          <div className="bg-[#F9F9F7]/5 p-4 border-l-4 border-[#00ADB5]">
            <p>
              To support interaction features such as{" "}
              <span className="text-[#FFEE02]">Likes</span> and{" "}
              <span className="text-[#FFEE02]">Dislikes</span>, limited session
              data may be stored in your browser&apos;s local storage and our
              databases.
            </p>
          </div>

          <p>
            This data is used only for system functionality and session
            persistence. It is never sold to third-party entities.
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleClose}
            className="w-full bg-[#00ADB5] text-[#1A1A1B] py-3 font-black uppercase text-lg hover:bg-[#FFEE02] transition-all cursor-pointer shadow-[5px_5px_0px_0px_#F9F9F7] active:shadow-none active:translate-x-1.25 active:translate-y-1.25"
          >
            Close
          </button>
        </div>

        <p className="text-[10px] text-[#F9F9F7]/40 mt-6 text-center tracking-[0.2em]">
          LICICO SYSTEM LOG v2.0.26
        </p>
      </div>
    </div>
  );
};
