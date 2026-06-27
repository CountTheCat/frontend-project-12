import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ChatPage from './pages/ChatPage'
import NotFoundPage from './pages/NotFoundPage'
import Header from './components/Header'

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <BrowserRouter>
      <div className="App d-flex flex-column vh-100">
        <Header />
        <div className="flex-grow-1 overflow-hidden">
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  )
}

export default App