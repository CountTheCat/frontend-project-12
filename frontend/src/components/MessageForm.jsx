import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessage } from '../store/slices/messagesSlice'

const MessageForm = () => {
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()
  const { currentChannelId } = useSelector((state) => state.channels)
  const { username } = useSelector((state) => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      dispatch(sendMessage({
        channelId: currentChannelId,
        body: message,
        username,
      }))
      setMessage('')
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
          />
          <button type="submit" className="btn btn-primary">
            Отправить
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageForm