import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
  Mic
  ,FileText, Sparkles
} from "lucide-react";

import { useSelector } from "react-redux";
import api from "../config/api.js";
import { toast } from "react-hot-toast";
import pdfToText from 'react-pdftotext'

const Dashboard = () => {
  const colors = ["#9b5de5", "#fca3cc", "#f6d186", "#b5ead7", "#c7ceea"];
  const { user, token } = useSelector(state => state.auth);
  const [loading, setIsLoading] = React.useState(false);
  const [allResumes, setAllResumes] = React.useState([]);
  const [showcreatereume, setShowcreateresume] = React.useState(false);
  const [showuploadresume, setShowuploadresume] = React.useState(false);
  const [fetchingResumes, setFetchingResumes] = React.useState(true);
  const [title, setTitle] = React.useState("");
  const [resume, setResume] = React.useState(null);
  const [editresumeId, setEditresumeId] = React.useState("");
  const navigate = useNavigate();

  const createResume = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // 1. Validation check
    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const { data } = await api.post(
        '/api/resumes/create',
        { title },
        {
          headers: {
            // Ensure "Bearer" is spelled correctly and token exists
            Authorization: token
          }
        }
      );

      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowcreateresume(false);
      toast.success("Resume created!");
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      // 2. Enhanced error logging
      console.error("Create Error:", error.response);
      toast.error(error.response?.data?.message || "Failed to create resume");
    }
    finally {
      setIsLoading(false);
    }
  }

  const uploadResume = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error("Please select a file first");
    if (!title) return toast.error("Please enter a title");

    setIsLoading(true);
    try {
      // 1. Extract text from PDF
      const resumeText = await pdfToText(resume);

      // DEBUG: Check if text was actually extracted
      console.log("Extracted Text:", resumeText);

      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error("Could not extract text from this PDF. It might be an image-based PDF.");
      }

      const { data } = await api.post(
        '/api/ai/upload-resume',
        { title, resumeText }, // Sending both fields
        {
          headers: {
            Authorization: token // Ensure your Interceptor or this header is correct
          }
        }
      );

      toast.success("Resume parsed successfully!");
      setTitle("");
      setResume(null);
      setShowuploadresume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(error.message || "Failed to upload resume");
    } finally {
      setIsLoading(false);
    }
  };

  const editTitle = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/api/resumes/update`, // Or `/api/resumes/update/${editresumeId}`
        {
          resumeId: editresumeId,
          title: title // Flat structure is often preferred
        },
        {
          headers: {
            // Add "Bearer " if your backend requires it
            Authorization: token
          }
        }
      );

      setAllResumes(allResumes.map(resume =>
        resume._id === editresumeId ? { ...resume, title } : resume
      ));

      setEditresumeId("");
      setTitle("");
      toast.success("Resume title updated");
    } catch (error) {
      console.error("Edit Error:", error);
      toast.error(error.response?.data?.message || "Failed to update resume title");
    }
  };
  const deleteResume = async (resumeId) => {
    // 1. Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    try {
      // 2. API Call
      await api.delete(`/api/resumes/delete/${resumeId}`, {
        headers: {
          Authorization: token,
        },
      });

      // 3. Update State (Remove from UI immediately)
      setAllResumes((prev) => prev.filter((resume) => resume._id !== resumeId));

      // 4. Success Toast
      toast.success("Resume deleted successfully");

    } catch (error) {
      console.error("Delete Error:", error);
      // 5. Error Toast
      toast.error(error.response?.data?.message || "Failed to delete resume");
    }
  };
  useEffect(() => {
    const loadAllResumes = async () => {
      if (!token) return;
      setFetchingResumes(true);
      try {
        const { data } = await api.get("/api/users/resumes", {
          headers: {
            Authorization: token.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`,
          },
        });
        setAllResumes(data.resumes || []);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
        } else {
          console.error("Load Error:", error);
          toast.error("Failed to load resumes");
        }
      } finally {
        setFetchingResumes(false);
      }
    };
    loadAllResumes();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col px-6 sm:px-10 py-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <FilePenLineIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">{user?.name}</span>
            </h1>
          </div>
        </div>
        <p className="mt-3 text-base ml-[4.5rem] text-slate-500">
          Manage your resumes or start building a new one
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-5xl mx-auto justify-center items-stretch">
        {/* Create Resume */}
        <button
          onClick={() => setShowcreateresume(true)}
          className="group relative flex-1 rounded-2xl p-8 shadow-md hover:shadow-xl border transition-all duration-300 overflow-hidden bg-white border-slate-200 hover:border-emerald-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform duration-300">
              <PlusIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <span className="text-lg font-semibold block mb-1 text-slate-800">Create Resume</span>
              <span className="text-sm text-slate-500">Build from scratch with our editor</span>
            </div>
          </div>
        </button>

        {/* Upload Resume */}
        <button
          onClick={() => setShowuploadresume(true)}
          className="group relative flex-1 rounded-2xl p-8 shadow-md hover:shadow-xl border transition-all duration-300 overflow-hidden bg-white border-slate-200 hover:border-blue-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
              <UploadCloudIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <span className="text-lg font-semibold block mb-1 text-slate-800">Upload Resume</span>
              <span className="text-sm text-slate-500">Import existing PDF resume</span>
            </div>
          </div>
        </button>

        {/* Interview Agent */}
        <Link to="/interview-agent" className="group relative flex-1 rounded-2xl p-8 shadow-md hover:shadow-xl border transition-all duration-300 overflow-hidden bg-white border-slate-200 hover:border-purple-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <span className="text-lg font-semibold block mb-1 text-slate-800">Interview Agent</span>
              <span className="text-sm text-slate-500">AI-powered practice sessions</span>
            </div>
          </div>
        </Link>
        {/* Analyze Resume */}
        <Link
          to="/analyze-resume"
          className="group relative flex-1 rounded-2xl p-8 shadow-md hover:shadow-xl border transition-all duration-300 overflow-hidden bg-white border-slate-200 hover:border-emerald-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <span className="text-lg font-semibold block mb-1 text-slate-800">Analyze Resume</span>
              <span className="text-sm text-slate-500">AI analysis and suggestions</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Section Divider */}
      <div className="w-full max-w-6xl mx-auto mt-14 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <span className="text-sm font-medium uppercase tracking-wider text-slate-400">Your Resumes</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>
      </div>

      {/* Resume Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
  {fetchingResumes ? (
    <div className="col-span-full flex justify-center items-center py-24">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
        <span className="text-sm text-slate-500">Loading your resumes...</span>
      </div>
    </div>
  ) : allResumes.length === 0 ? (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <FilePenLineIcon className="w-10 h-10 text-slate-300" />
      </div>
      <p className="text-lg font-medium text-slate-600">No resumes yet</p>
      <p className="text-sm text-slate-400 mt-1">Create or upload one above to get started!</p>
    </div>
  ) : (
    allResumes.map((resume, index) => {
      const baseColor = colors[index % colors.length];
      return (
        <div
          key={index}
          onClick={() => navigate(`/app/builder/${resume._id}`)}
          className="group relative rounded-2xl p-6 shadow-md hover:shadow-xl border transition-all duration-300 cursor-pointer overflow-hidden bg-white border-slate-200"
        >
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: baseColor }} />
          <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{ backgroundColor: baseColor }} />

          {/* Icon */}
          <div
            className="w-12 h-12 flex items-center justify-center rounded-xl mb-4 mt-2"
            style={{ backgroundColor: baseColor + "20" }}
          >
            <FilePenLineIcon className="w-6 h-6" style={{ color: baseColor }} />
          </div>

          {/* Title */}
          <p className="font-semibold text-base truncate pr-16 text-slate-800">
            {resume.title}
          </p>

          {/* Date */}
          <p className="text-xs mt-2 flex items-center gap-1 text-slate-400">
            <span>Updated</span>
            {new Date(resume.updateAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          {/* Hover Actions */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
          >
            <button className="p-2 rounded-lg transition-colors bg-slate-100 hover:bg-red-50" title="Delete">
              <TrashIcon onClick={() => deleteResume(resume._id)} className="w-4 h-4 text-red-500" />
            </button>
            <button className="p-2 rounded-lg transition-colors bg-slate-100 hover:bg-blue-50" title="Edit">
              <PencilIcon
                onClick={() => { setEditresumeId(resume._id); setTitle(resume.title); }}
                className="w-4 h-4 text-blue-500"
              />
            </button>
          </div>
        </div>
      );
    })
  )}
      </div>

      {
        showcreatereume && (
          <div
            onClick={() => setShowcreateresume(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          >
            <form
              onSubmit={createResume}
              onClick={(e) => e.stopPropagation()}
              className="relative rounded-3xl shadow-2xl p-8 w-[90%] max-w-md flex flex-col gap-5 border transition-all duration-300 scale-100 hover:scale-[1.02] bg-white border-slate-200"
            >
              {/* Close Icon */}
              <button
                type="button"
                onClick={() => {
                  setShowcreateresume(false);
                  setTitle("");
                }}
                className="absolute top-4 right-4 p-2 rounded-lg transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <XIcon className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200 mx-auto mt-2">
                <PlusIcon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center mt-2 text-slate-800">
                Create New Resume
              </h2>
              <p className="text-sm text-center -mt-2 text-slate-500">
                Give your resume a title to start building
              </p>

              {/* Input Field */}
              <input
                type="text"
                placeholder="Enter resume title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border rounded-xl px-4 py-3 transition-all outline-none border-slate-300 bg-slate-50 text-slate-700 focus:ring-emerald-500 focus:border-emerald-500"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowcreateresume(false);
                    setTitle("");
                  }}
                  className="px-5 py-2.5 rounded-xl border font-medium transition-all border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 flex gap-2 items-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LoaderCircleIcon className="animate-spin w-4 h-4" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-4 h-4" />
                      Create Resume
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )
      }

      {
        showuploadresume && (
          <div
            onClick={() => setShowuploadresume(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          >
            <form
              onSubmit={uploadResume}
              onClick={(e) => e.stopPropagation()}
              className="relative rounded-3xl shadow-2xl p-8 w-[90%] max-w-md flex flex-col gap-5 border transition-all duration-300 scale-100 hover:scale-[1.02] bg-white border-slate-200"
            >
              {/* Close Icon */}
              <button
                type="button"
                onClick={() => {
                  setShowuploadresume(false);
                  setTitle("");
                }}
                className="absolute top-4 right-4 p-2 rounded-lg transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <XIcon className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 mx-auto mt-2">
                <UploadCloudIcon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center mt-2 text-slate-800">
                Upload Resume
              </h2>
              <p className="text-sm text-center -mt-2 text-slate-500">
                Import your existing PDF resume
              </p>

              {/* Input Field */}
              <input
                type="text"
                placeholder="Enter resume title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border rounded-xl px-4 py-3 transition-all outline-none border-slate-300 bg-slate-50 text-slate-700 focus:ring-blue-500 focus:border-blue-500"
              />

              <div>
                <label className="text-sm font-medium block mb-2 text-slate-700">Select Resume File</label>
                <input type="file" accept=".pdf" hidden id="resume-input" onChange={(e) => setResume(e.target.files[0])} />
                <div
                  onClick={() => document.getElementById('resume-input').click()}
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 bg-slate-50 hover:bg-blue-50 border-slate-300 hover:border-blue-400"
                >
                  {resume ? (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-2">
                        <FilePenLineIcon className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="text-sm font-medium text-slate-800">{resume.name}</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="size-12 stroke-1 text-blue-500 mb-2" />
                      <p className="font-medium text-slate-600">Click to upload PDF</p>
                      <p className="text-xs mt-1 text-slate-400">PDF format only</p>
                    </>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowuploadresume(false);
                    setTitle("");
                  }}
                  className="px-5 py-2.5 rounded-xl border font-medium transition-all border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                {loading ? (
                  <button type="button" className="px-6 py-2.5 flex gap-2 items-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-200">
                    <LoaderCircleIcon className="animate-spin w-4 h-4" />
                    Uploading...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 flex gap-2 items-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all"
                  >
                    <UploadCloudIcon className="w-4 h-4" />
                    Upload Resume
                  </button>
                )}
              </div>
            </form>
          </div>
        )
      }

      {
        editresumeId && (
          <div
            onClick={() => setEditresumeId(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          >
            <form
              onSubmit={editTitle}
              onClick={(e) => e.stopPropagation()}
              className="relative rounded-3xl shadow-2xl p-8 w-[90%] max-w-md flex flex-col gap-5 border transition-all duration-300 scale-100 hover:scale-[1.02] bg-white border-slate-200"
            >
              {/* Close Icon */}
              <button
                type="button"
                onClick={() => {
                  setEditresumeId(false);
                  setTitle("");
                }}
                className="absolute top-4 right-4 p-2 rounded-lg transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <XIcon className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 mx-auto mt-2">
                <PencilIcon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center mt-2 text-slate-800">
                Edit Resume Title
              </h2>

              {/* Input Field */}
              <input
                type="text"
                placeholder="Enter resume title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border rounded-xl px-4 py-3 transition-all outline-none border-slate-300 bg-slate-50 text-slate-700 focus:ring-blue-500 focus:border-blue-500"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditresumeId(false);
                    setTitle("");
                  }}
                  className="px-5 py-2.5 rounded-xl border font-medium transition-all border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 flex gap-2 items-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all"
                >
                  <PencilIcon className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )
      }


      {/* Nested Routes */}
      <div className="w-full max-w-6xl mt-12 mx-auto">
        <div className="rounded-2xl shadow-md border p-6 bg-white border-slate-200">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
