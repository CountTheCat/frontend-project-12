import { useSelector } from 'react-redux'
import MessagesList from './MessagesList'
import MessageForm from './MessageForm'

const ChatArea = () => {
  const { currentChannelId, channels } = useSelector((state) => state.channels)
  const currentChannel = channels.find((ch) => ch.id === currentChannelId)

  return (
    <div className="col-8 col-md-9 d-flex flex-column vh-100">
      <div className="p-3 border-bottom">
        <h5># {currentChannel?.name}</h5>
      </div>
      <MessagesList />
      <MessageForm />
    </div>
  )
}

export default ChatArea