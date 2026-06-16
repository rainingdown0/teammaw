import { Syne } from "next/font/google";
import { auth } from "@/auth";
import { AuthProvider } from "./auth-provider";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata = {
  title: "Teammaw",
  description: "The Pokémon VGC teambuilding community",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  return (
    <html lang="en" className={`${syne.variable} h-full font-sans antialiased`}>
      <body className="flex min-h-full flex-col">
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
