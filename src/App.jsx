import React, { useEffect, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import api from './config/api.js'
import { login, setLoading } from './app/features/authSlice.js'

// ✅ Lazy Loading
const Home = React.lazy(() => import('./pages/Home.jsx'))
const Layout = React.lazy(() => import('./pages/Layout.jsx'))
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'))
const ResumeBuilder = React.lazy(() => import('./pages/ResumeBuilder.jsx'))
const ResumeAnalyzer = React.lazy(() => import('./components/ResumeAnalyzer.jsx'))
const Preview = React.lazy(() => import('./pages/Preview.jsx'))
const Login = React.lazy(() => import('./pages/Login.jsx'))
const InterviewAgent = React.lazy(() => import('./components/InterviewAgent.jsx'))

// ✅ Loading Spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent" />
  </div>
)

const App = () => {
  const dispatch = useDispatch();

  const getuserData = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const { data } = await api.get('/api/users/data', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (data.user) {
          dispatch(login({ user: data.user, token }));
        }
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.log("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    getuserData();
  }, []);

  return (
    <>
      {/* ✅ Duplicate Toaster hata diya */}
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='app' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='builder/:resumeId' element={<ResumeBuilder />} />
          </Route>
          <Route path='view/:resumeId' element={<Preview />} />
          <Route path='/analyze-resume' element={<ResumeAnalyzer />} />
          <Route path='/interview-agent' element={<InterviewAgent />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App