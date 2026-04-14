import React from 'react'
import api from '../config/api';
import { useDispatch } from 'react-redux';
import { login } from '../app/features/authSlice';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
    const query = new URLSearchParams(window.location.search);
    const urlstata = query.get("state");
    const [state, setState] = React.useState(urlstata || "login");
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const dispatch = useDispatch();

    const loginDefaults = {
        name: '',
        email: 'khan@gmail.com',
        password: 'khan123'
    }

    const signupDefaults = {
        name: 'haris khan',
        email: 'hariskhan@gmail.com',
        password: 'haris@2024'
    }

    const [formData, setFormData] = React.useState(
        urlstata === "register" ? signupDefaults : loginDefaults
    )

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        try {
            const { data } = await api.post(`/api/users/${state}`, formData);
            dispatch(login(data));
            localStorage.setItem('token', data.token);
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-green-50">
            {/* Background Decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Form Card */}
            <form
                onSubmit={handleSubmit}
                className="relative z-10 sm:w-[420px] mx-4 w-[calc(100%-2rem)] px-8 py-10 rounded-3xl shadow-2xl bg-white/95 backdrop-blur-xl border border-slate-200/50"
            >
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-50">
                        <Sparkles className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-600">Resume Builder</span>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">
                    {state === "login" ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-center text-sm mb-8 text-slate-500">
                    {state === "login"
                        ? "Sign in to continue building your resume"
                        : "Sign up to get started with AI-powered resume building"}
                </p>

                {/* Name Field (Signup only) */}
                {state !== "login" && (
                    <div className="flex items-center w-full mb-4 h-12 rounded-xl overflow-hidden pl-4 gap-3 border transition-colors bg-slate-50 border-slate-200 focus-within:border-green-500">
                        <User className="w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className="flex-1 border-none outline-none ring-0 bg-transparent text-slate-800 placeholder-slate-400"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                {/* Email Field */}
                <div className="flex items-center w-full mb-4 h-12 rounded-xl overflow-hidden pl-4 gap-3 border transition-colors bg-slate-50 border-slate-200 focus-within:border-green-500">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="flex-1 border-none outline-none ring-0 bg-transparent text-slate-800 placeholder-slate-400"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Password Field */}
                <div className="flex items-center w-full mb-4 h-12 rounded-xl overflow-hidden pl-4 gap-3 border transition-colors bg-slate-50 border-slate-200 focus-within:border-green-500">
                    <Lock className="w-5 h-5 text-slate-400" />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className="flex-1 border-none outline-none ring-0 bg-transparent text-slate-800 placeholder-slate-400"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-slate-400 hover:opacity-70"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                {/* Forget Password */}
                {state === "login" && (
                    <div className="text-right mb-4 text-green-600">
                        <button type="button" className="text-sm hover:underline">Forgot password?</button>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full h-12 rounded-xl text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <span>Please wait...</span>
                            </>
                        ) : (
                            <>
                                {state === "login" ? "Sign In" : "Create Account"}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </span>
                </button>

                {/* Toggle Login/Signup */}
                <p className="text-center text-sm mt-6 text-slate-500">
                    {state === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        onClick={() => {
                            const next = state === "login" ? "register" : "login";
                            setState(next);
                            setFormData(next === "login" ? loginDefaults : signupDefaults);
                        }}
                        className="font-semibold hover:underline text-green-600"
                    >
                        {state === "login" ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </form>

            <style>{`
                .animate-pulse {
                    animation: shimmer 3s ease-in-out infinite;
                }
                .delay-1000 {
                    animation-delay: 1s;
                }
                @keyframes shimmer {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    )
}

export default Login
