import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App