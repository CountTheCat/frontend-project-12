import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import MessagesList from './MessagesList'
import MessageForm from './MessageForm'

const ChatArea = () => {
  const { t } = useTranslation()
  const { currentChannelId, channels } = useSelector((state) => state.channels)
  const { messages } = useSelector((state) => state.messages)
  const currentChannel = channels.find((ch) => ch.id === currentChannelId)

  const channelMessages = messages.filter(
    (message) => message.channelId === currentChannelId,
  )

  return (
    <div className="d-flex flex-column h-100 bg-white" style={{ borderRadius: '0 12px 12px 0', paddingBottom: '30px' }}>
      <div className="bg-light px-4 py-2 border-bottom flex-shrink-0" style={{ minHeight: '48px' }}>
        <p className="m-0" style={{ fontSize: '16px', fontWeight: 600 }}>
          #
          {' '}
          {currentChannel?.name || t('chat.selectChannel')}
        </p>
        <span className="text-muted" style={{ fontSize: '13px' }}>
          {t('chat.messagesCount', { count: channelMessages.length })}
        </span>
      </div>
      <MessagesList />
      <MessageForm />
    </div>
  )
}

export default ChatArea