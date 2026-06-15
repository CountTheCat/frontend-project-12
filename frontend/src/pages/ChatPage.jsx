import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import { fetchChannels } from '../store/slices/channelsSlice'
import { fetchMessages } from '../store/slices/messagesSlice'
import ChannelsList from '../components/ChannelsList'
import ChatArea from '../components/ChatArea'

const ChatPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { username, isAuthenticated } = useSelector((state) => state.auth)
  const { loading: channelsLoading } = useSelector((state) => state.channels)
  const { loading: messagesLoading } = useSelector((state) => state.messages)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch, isAuthenticated, navigate])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <ChannelsList />
        <ChatArea />
      </div>
      <button
        onClick={handleLogout}
        className="btn btn-outline-danger position-fixed bottom-0 end-0 m-3"
      >
        Выйти
      </button>
    </div>
  )
}

export default ChatPage