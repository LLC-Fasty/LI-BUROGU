import { decodeSafe, encodeSafe } from "@/lib/utils";

export const createBlog = async (blogData) => {
  try {
    const response = await fetch("/api/db/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || "Failed to create blog" };
    }

    return { success: true, result };
  } catch (err) {
    console.error("Service Error:", err);
    return { success: false, error: err.message };
  }
};

export const validateHeading = async (encodedHeading) => {
  try {
    const response = await fetch("/api/db/content/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ heading: encodedHeading }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { unique: false, error: result.error || "Validation Error" };
    }

    return { unique: result.unique, error: null };
  } catch (err) {
    console.error("Validation Service Error:", err);
    return { unique: false, error: "Network Error" };
  }
};

export const getAllBlogs = async () => {
  try {
    const response = await fetch("/api/db/content/getblogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    let gData = result;

    gData.blogs = gData?.blogs.map((el) => {
      let decodedHeading = "Untitled Blog";
      let decodedContent = "";

      try {
        decodedHeading = JSON.parse(decodeSafe(el.heading));
      } catch (e) {
        console.error("Heading decode failed for:", el.id);
      }

      try {
        decodedContent = JSON.parse(decodeSafe(el.content));
      } catch (e) {
        console.error("Content decode failed for:", el.id);
      }

      return {
        ...el,
        heading: decodedHeading,
        content: decodedContent,
      };
    });

    return gData; // { success: true, blogs: [...] }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const MANAGE_URL = "/api/db/content/manageblog";

export const deleteBlog = async (id) => {
  try {
    const response = await fetch(MANAGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, operation: "DELETE" }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateBlog = async (id, updateData) => {
  try {
    const response = await fetch(MANAGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operation: "UPDATE",
        id: id,
        newData: updateData,
      }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminLogin = async (logData) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem("li-token", result.token);
      return { success: true };
    }

    return { success: false, error: result.error };
  } catch (err) {
    return { success: false, error: "NETWORK ERROR" };
  }
};

export const getBlogByCid = async (cid) => {
  try {
    const response = await fetch("/api/db/content/get-single", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cid }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const API_URL = "/api/db/content/likedislike";

export const getInteractionStatus = async (iData) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ iData, operation: "GET_STATUS" }),
    });

    const data = await res.json();
    let rData = decodeSafe(data.data);
    let jData = JSON.parse(rData);
    jData.success = data.success;

    return jData;
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const toggleInteraction = async (iData) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        iData,
        operation: "TOGGLE_ACTION",
      }),
    });
    const data = await res.json();
    let rData = decodeSafe(data.data);
    let jData = JSON.parse(rData);
    jData.success = data.success;

    return jData;
  } catch (err) {
    return { success: false, error: err.message };
  }
};
