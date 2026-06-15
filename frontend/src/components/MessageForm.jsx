import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessage } from '../store/slices/messagesSlice'

const MessageForm = () => {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const dispatch = useDispatch()
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
    <div className="border-top p-3">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Введите сообщение..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSending || !message.trim()}
          >
            {isSending ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageForm