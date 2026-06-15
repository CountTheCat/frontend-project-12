import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import { fetchChannels } from '../store/slices/channelsSlice'
import { fetchMessages, addMessage } from '../store/slices/messagesSlice'
import socket from '../services/socket'
import ChannelsList from '../components/ChannelsList'
import ChatArea from '../components/ChatArea'

const ChatPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, token, username } = useSelector((state) => state.auth)
  const { loading: channelsLoading } = useSelector((state) => state.channels)
  const { loading: messagesLoading } = useSelector((state) => state.messages)

  const onNewMessage = useCallback((message) => {
    const normalizedMessage = {
      id: message.id,
      channelId: message.channelId,
      body: message.body,
      username: message.username || message.user?.username || 'Аноним',
      createdAt: message.createdAt || new Date().toISOString()
    }
    dispatch(addMessage(normalizedMessage))
  }, [dispatch])

  useEffect(() => {
    const hasToken = !!token
    const hasUsername = !!username
    const isAuthValid = hasToken && hasUsername && isAuthenticated

    if (!isAuthValid) {
      console.log('Auth check failed:', { hasToken, hasUsername, isAuthenticated })
      dispatch(logout())
      navigate('/login')
      return
    }
    
    dispatch(fetchChannels())
    dispatch(fetchMessages())

    socket.on('newMessage', onNewMessage)

    return () => {
      socket.off('newMessage', onNewMessage)
    }
  }, [dispatch, isAuthenticated, token, username, navigate, onNewMessage])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid position-relative vh-100 d-flex flex-column">
      <div className="row flex-grow-1 overflow-hidden">
        <div className="col-4 col-md-3 p-0 h-100">
          <ChannelsList />
        </div>
        <div className="col-8 col-md-9 p-0 h-100 d-flex flex-column">
          <ChatArea />
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="btn btn-outline-danger position-absolute bottom-0 start-0 m-3"
        style={{ zIndex: 1000 }}
      >
        Выйти
      </button>
    </div>
  )
}

export default ChatPage