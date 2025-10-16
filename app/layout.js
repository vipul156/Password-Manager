import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "PassOp – Password Manager",
  description: "Secure and simple password manager built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#EFF2F9] text-gray-900 antialiased">
        {/* ✅ Use container for better centering and padding */}
        <div className="flex flex-col min-h-screen">
          {/* Navbar fixed for faster visual LCP load */}
          <header className="sticky top-0 z-50 bg-[#EFF2F9]/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
              <Navbar />
            </div>
          </header>

          {/* Main content grows to fill space */}
          <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>

          {/* Footer always visible at bottom */}
          <footer className="mt-auto w-full bg-white/80 backdrop-blur-md border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <Footer />
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
