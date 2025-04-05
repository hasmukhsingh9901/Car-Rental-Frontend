"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { Car, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);

        if (res.data.role === "admin") {
          router.push("/admin");
        }
      } catch (err) {
        setUser(null);
        console.log(localStorage.getItem("token"));
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-6 w-6 text-car-blue" />
            <span className="text-2xl font-poppins font-bold">
              <span className="text-car-blue">Car</span>
              <span className="text-car-dark dark:text-white">Avenue</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-700 dark:text-slate-200 hover:text-car-blue transition-colors font-medium">
              Home
            </Link>

            {user?.role === "admin" && (
              <Link href="/admin" className="text-slate-700 dark:text-slate-200 hover:text-car-blue transition-colors font-medium">
                Admin Panel
              </Link>
            )}

            {user ? (
              <>
                {user.role !== "admin" && (
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Welcome, {user.username}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/80"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-car-blue">
                  Login
                </Link>
                <Link href="/register" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-car-blue">
                  Register
                </Link>
              </>
            )}

            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-sm">
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 text-slate-700 dark:text-white focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3 animate-fade-in">
            <Link
              href="/"
              className="block py-2 px-4 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="block py-2 px-4 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}

            {user ? (
              <>
                {user.role !== "admin" && (
                  <span className="block px-4 text-slate-700 dark:text-white">
                    Welcome, {user.username}
                  </span>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/80"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 px-4 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block py-2 px-4 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}

            <div className="pt-2">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-sm">
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
