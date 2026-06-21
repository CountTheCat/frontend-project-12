import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { sendMessage } from '../store/slices/messagesSlice'
import { filterText } from '../utils/filter'

const MessageForm = () => {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { currentChannelId } = useSelector(state => state.channels)
  const { username } = useSelector(state => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedMessage = message.trim()

    if (!trimmedMessage || isSending) return

    setIsSending(true)

    try {
      const filteredMessage = filterText(trimmedMessage)
      await dispatch(sendMessage({
        channelId: currentChannelId,
        body: filteredMessage,
        username,
      })).unwrap()
      setMessage('')
    }
    catch (error) {
      console.error('Error sending message:', error)
    }
    finally {
      setIsSending(false)
    }
  }

  return (
    <div className="px-4 py-2 border-top bg-white flex-shrink-0">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder={t('chat.messagePlaceholder')}
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={isSending}
          />
          <button
            type="submit"
            className="btn btn-outline-secondary"
            disabled={isSending || !message.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
            </svg>
            <span className="visually-hidden">{t('chat.send')}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageForm
