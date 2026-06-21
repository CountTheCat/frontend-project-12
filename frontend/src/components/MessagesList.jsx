import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const MessagesList = () => {
  const { t } = useTranslation()
  const { messages } = useSelector(state => state.messages)
  const { currentChannelId } = useSelector(state => state.channels)
  const messagesEndRef = useRef(null)

  const channelMessages = messages.filter(
    message => message.channelId === currentChannelId,
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
    }
    catch {
      return ''
    }
  }

  if (channelMessages.length === 0) {
    return (
      <div className="flex-grow-1 overflow-auto px-4 py-3">
        <div className="text-center text-muted mt-5">
          {t('chat.noMessages')}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-grow-1 overflow-auto px-4 py-3">
      {channelMessages.map(message => (
        <div key={message.id} className="mb-1" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <strong style={{ fontSize: '14px', color: '#212529' }}>
            {message.username}
            :
          </strong>
          <span style={{ fontSize: '14px', color: '#212529' }}>{message.body}</span>
          <span className="text-muted" style={{ fontSize: '11px', marginLeft: 'auto' }}>
            {formatTime(message.createdAt)}
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessagesList
