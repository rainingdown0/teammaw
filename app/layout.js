import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata = {
  title: "Teammaw",
  description: "The Pokémon VGC teambuilding community",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} h-full font-sans antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
