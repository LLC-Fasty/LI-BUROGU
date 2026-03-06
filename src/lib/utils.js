import {
  base62Decode,
  base62Encode,
  decodeEmojis,
  encodeEmojis,
} from "./encdec";

export const generateBlogId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const gen = (length) => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return `${gen(4)}-${gen(5)}-${gen(4)}`;
};

export function encodeSafe(text) {
  return base62Encode(encodeEmojis(text));
}

export function decodeSafe(encoded) {
  return decodeEmojis(base62Decode(encoded));
}

export const LogOut = () => {
  localStorage.removeItem("li-token");
  window.location.replace("/");
};
