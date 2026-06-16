import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { sendMessage } from '../store/slices/messagesSlice'

const MessageForm = () => {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { currentChannelId } = useSelector((state) => state.channels)
  const { username } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedMessage = message.trim()
    
    if (!trimmedMessage || isSending) return
    
    setIsSending(true)
    
    try {
      await dispatch(sendMessage({
        channelId: currentChannelId,
        body: trimmedMessage,
        username,
      })).unwrap()
      setMessage('')
    } catch (error) {
      console.error('Ошибка отправки:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="border-top p-3" style={{ backgroundColor: '#f8f9fa' }}>
      <form onSubmit={handleSubmit}>
        <div className="input-group" style={{ gap: '8px' }}>
          <input
            type="text"
            className="form-control"
            placeholder={t('chat.messagePlaceholder')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
            style={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '10px 14px',
              fontSize: '14px'
            }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSending || !message.trim()}
            style={{
              borderRadius: '8px',
              padding: '10px 20px',
              backgroundColor: '#4f46e5',
              border: 'none',
              fontWeight: 500,
              fontSize: '14px',
              flexShrink: 0,
              marginLeft: '0px'
            }}
          >
            {isSending ? t('chat.sending') : t('chat.send')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageForm