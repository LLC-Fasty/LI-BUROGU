import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const JBM = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "LI-BUROGU",
  description:
    "LI-Burogu is a simple blogging web app built for LiCiCo's Founders. To share their thoughts, ideas, and experiences with the world. It is a platform for the founders to express themselves and connect with their audience. A Tech blog, a personal blog and more. It is a platform for the founders to share their stories and inspire others.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="language" content="English" />
      </head>
      <body className={JBM.className}>
        <div className="">{children}</div>
      </body>
    </html>
  );
}
