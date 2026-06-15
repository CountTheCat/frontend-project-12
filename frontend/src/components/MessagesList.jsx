import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'

const MessagesList = () => {
  const { messages } = useSelector((state) => state.messages)
  const { currentChannelId } = useSelector((state) => state.channels)
  const messagesEndRef = useRef(null)

  const channelMessages = messages.filter(
    (message) => message.channelId === currentChannelId
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [channelMessages])

  const formatTime = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      return date.toLocaleTimeString()
    } catch {
      return ''
    }
  }

  if (channelMessages.length === 0) {
    return (
      <div className="flex-grow-1 overflow-auto p-3">
        <div className="text-center text-muted mt-5">
          Нет сообщений. Напишите первое!
        </div>
      </div>
    )
  }

  return (
    <div className="flex-grow-1 overflow-auto p-3">
      {channelMessages.map((message) => (
        <div key={message.id} className="mb-2">
          <strong>{message.username}</strong>
          <span className="text-muted ms-2 small">
            {formatTime(message.createdAt)}
          </span>
          <p className="mb-0 word-break">{message.body}</p>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessagesList