import { useSelector, useDispatch } from 'react-redux'
import { setCurrentChannel } from '../store/slices/channelsSlice'

const ChannelsList = () => {
  const dispatch = useDispatch()
  const { channels, currentChannelId } = useSelector((state) => state.channels)

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId))
  }

  return (
    <div className="col-4 col-md-3 border-end vh-100 d-flex flex-column">
      <div className="p-3 border-bottom">
        <h5>Каналы</h5>
      </div>
      <div className="list-group list-group-flush">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => handleChannelClick(channel.id)}
            className={`list-group-item list-group-item-action text-start ${
              currentChannelId === channel.id ? 'active' : ''
            }`}
          >
            # {channel.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChannelsList