import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../public/logo.svg';
import { logout } from "../app/features/authSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOutUser = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-200/50">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Section - Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Resume Builder" className="h-10 w-auto" />
          </Link>

          {/* Center section intentionally left empty (Analyze moved to dashboard) */}

          {/* Right Section - User Info & Logout */}
          <div className="flex items-center gap-3">
            {/* User Greeting */}
            <div className="hidden sm:block px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
              <span className="text-sm">Hi, </span>
              <span className="font-semibold">{user?.name}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logOutUser}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 bg-red-50 hover:bg-red-100 text-red-600"
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
