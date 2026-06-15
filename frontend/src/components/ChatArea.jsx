import { useSelector } from 'react-redux'
import MessagesList from './MessagesList'
import MessageForm from './MessageForm'

const ChatArea = () => {
  const { currentChannelId, channels } = useSelector((state) => state.channels)
  const currentChannel = channels.find((ch) => ch.id === currentChannelId)

  return (
    <div className="d-flex flex-column h-100">
      <div className="p-3 border-bottom">
        <h5 className="mb-0"># {currentChannel?.name || 'Выберите канал'}</h5>
      </div>
      <div className="flex-grow-1 overflow-hidden d-flex flex-column">
        <MessagesList />
      </div>
      <MessageForm />
    </div>
  )
}

export default ChatArea