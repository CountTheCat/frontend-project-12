import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setCurrentChannel } from '../store/slices/channelsSlice'
import AddChannelModal from './modals/AddChannelModal'
import RenameChannelModal from './modals/RenameChannelModal'
import RemoveChannelModal from './modals/RemoveChannelModal'

const ChannelsList = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
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
      <div className="channels-sidebar border-end d-flex flex-column p-0">
        <div className="channels-header">
          <h5>{t('chat.channels')}</h5>
          <button
            className="channels-add-btn"
            onClick={() => setShowAddModal(true)}
          >
            +
          </button>
        </div>
        <div className="channels-list list-group list-group-flush">
          {channels.map((channel) => (
            <div key={channel.id} className="list-group-item p-0 border-0" style={{ backgroundColor: 'transparent' }}>
              <div className="channel-item d-flex justify-content-between align-items-center">
                <button
                  onClick={() => handleChannelClick(channel.id)}
                  className={`channel-btn ${currentChannelId === channel.id ? 'active' : ''}`}
                >
                  <span className="channel-hash">#</span>
                  {channel.name}
                </button>
                {isRemovable(channel) && (
                  <div className="dropdown" style={{ position: 'relative' }}>
                    <button
                      className="channel-menu-btn"
                      onClick={() => setOpenMenuId(openMenuId === channel.id ? null : channel.id)}
                    >
                      ▼
                    </button>
                    {openMenuId === channel.id && (
                      <div className="channel-dropdown">
                        <button
                          className="dropdown-item-custom"
                          onClick={() => handleRename(channel)}
                        >
                          {t('modals.renameChannel.title')}
                        </button>
                        <button
                          className="dropdown-item-custom danger"
                          onClick={() => handleRemove(channel)}
                        >
                          {t('modals.removeChannel.title')}
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