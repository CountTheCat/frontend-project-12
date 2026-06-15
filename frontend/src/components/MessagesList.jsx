import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'

const MessagesList = () => {
  const { messages } = useSelector((state) => state.messages)
  const { currentChannelId } = useSelector((state) => state.channels)
  const { username } = useSelector((state) => state.auth)
  const messagesEndRef = useRef(null)

  const channelMessages = messages.filter(
    (message) => message.channelId === currentChannelId
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [channelMessages])

  return (
    <div className="flex-grow-1 overflow-auto p-3">
      {channelMessages.map((message) => (
        <div key={message.id} className="mb-2">
          <strong>{message.username}</strong>
          <span className="text-muted ms-2 small">
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
          <p className="mb-0">{message.body}</p>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessagesList