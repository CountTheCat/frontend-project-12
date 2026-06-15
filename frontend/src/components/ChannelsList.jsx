import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentChannel } from '../store/slices/channelsSlice'
import AddChannelModal from './modals/AddChannelModal'
import RenameChannelModal from './modals/RenameChannelModal'
import RemoveChannelModal from './modals/RemoveChannelModal'

const ChannelsList = () => {
  const dispatch = useDispatch()
  const { channels, currentChannelId } = useSelector((state) => state.channels)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId))
  }

  const handleRename = (channel) => {
    setSelectedChannel(channel)
    setShowRenameModal(true)
    setOpenMenuId(null)
  }

  const handleRemove = (channel) => {
    setSelectedChannel(channel)
    setShowRemoveModal(true)
    setOpenMenuId(null)
  }

  const isRemovable = (channel) => {
    return channel.removable !== false
  }

  return (
    <>
      <div className="channels-sidebar border-end vh-100 d-flex flex-column" style={{ width: '260px', minWidth: '200px' }}>
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Каналы</h5>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            +
          </button>
        </div>
        <div className="list-group list-group-flush overflow-auto flex-grow-1">
          {channels.map((channel) => (
            <div key={channel.id} className="list-group-item p-0">
              <div className="d-flex justify-content-between align-items-center">
                <button
                  onClick={() => handleChannelClick(channel.id)}
                  className={`btn text-start flex-grow-1 ps-3 py-2 ${
                    currentChannelId === channel.id ? 'bg-primary text-white' : ''
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  # {channel.name}
                </button>
                {isRemovable(channel) && (
                  <div className="dropdown me-2">
                    <button
                      className="btn btn-sm btn-link text-secondary"
                      onClick={() => setOpenMenuId(openMenuId === channel.id ? null : channel.id)}
                    >
                      ⋮
                    </button>
                    {openMenuId === channel.id && (
                      <div className="dropdown-menu show position-absolute" style={{ right: 0, left: 'auto' }}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleRename(channel)}
                        >
                          Переименовать
                        </button>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleRemove(channel)}
                        >
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && <AddChannelModal onClose={() => setShowAddModal(false)} />}
      {showRenameModal && selectedChannel && (
        <RenameChannelModal channel={selectedChannel} onClose={() => setShowRenameModal(false)} />
      )}
      {showRemoveModal && selectedChannel && (
        <RemoveChannelModal channel={selectedChannel} onClose={() => setShowRemoveModal(false)} />
      )}
    </>
  )
}

export default ChannelsList