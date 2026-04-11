import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemContext";
import { RiMoonClearFill } from "react-icons/ri";
import { IoSunnyOutline } from "react-icons/io5";
import logo from '../../public/logo.svg';
import { logout } from "../app/features/authSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { FileText, LogOut, Sparkles } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'ligth' ? 'dark' : 'ligth'));
  };

  const logOutUser = () => {
    dispatch(logout());
    navigate("/");
  };

  const isLight = theme === 'ligth';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isLight
        ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-200/50'
        : 'bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-slate-900/50 border-b border-slate-700/50'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Section - Logo */}
          <Link to="/" className="flex items-center gap-2">
            {isLight ? (
              <img src={logo} alt="Resume Builder" className="h-10 w-auto" />
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">resume</span>
                <span className="bg-green-400 rounded-full h-2 w-2 mt-3"></span>
              </div>
            )}
          </Link>

          {/* Center Section - Analyze Resume Button */}
          <Link
            to="/analyze-resume"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Analyze Resume</span>
              <span className="sm:hidden">Analyze</span>
            </span>
            <Sparkles className="w-3 h-3 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Right Section - User Info, Theme & Logout */}
          <div className="flex items-center gap-3">
            {/* User Greeting */}
            <div className={`hidden sm:block px-3 py-1.5 rounded-lg ${
              isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
            }`}>
              <span className="text-sm">Hi, </span>
              <span className="font-semibold">{user?.name}</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              aria-label="Toggle theme"
            >
              {isLight ? (
                <RiMoonClearFill className="text-xl" />
              ) : (
                <IoSunnyOutline className="text-xl" />
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={logOutUser}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                isLight
                  ? 'bg-red-50 hover:bg-red-100 text-red-600'
                  : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
