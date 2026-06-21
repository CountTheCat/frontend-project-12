import { useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchChannels } from '../store/slices/channelsSlice'
import { fetchMessages, addMessage } from '../store/slices/messagesSlice'
import socket from '../services/socket'
import ChannelsList from '../components/ChannelsList'
import ChatArea from '../components/ChatArea'

const ChatPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isAuthenticated } = useSelector(state => state.auth)
  const { loading: channelsLoading } = useSelector(state => state.channels)
  const { loading: messagesLoading } = useSelector(state => state.messages)
  const hasLoaded = useRef(false)

  const onNewMessage = useCallback((message) => {
    const normalizedMessage = {
      id: message.id,
      channelId: message.channelId,
      body: message.body,
      username: message.username || message.user?.username || 'Аноним',
      createdAt: message.createdAt || new Date().toISOString(),
    }
    dispatch(addMessage(normalizedMessage))
  }, [dispatch])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (hasLoaded.current) return
    hasLoaded.current = true

    dispatch(fetchChannels())
    dispatch(fetchMessages())

    socket.on('newMessage', onNewMessage)

    return () => {
      socket.off('newMessage', onNewMessage)
    }
  }, [dispatch, isAuthenticated, navigate, onNewMessage])

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{t('chat.loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container h-100">
      <div className="row h-100 overflow-hidden" style={{ marginTop: '8px' }}>
        <div className="col-4 col-md-3 col-lg-2 p-0 bg-light border-end h-100">
          <ChannelsList />
        </div>
        <div className="col p-0 h-100">
          <ChatArea />
        </div>
      </div>
    </div>
  )
}

export default ChatPage
