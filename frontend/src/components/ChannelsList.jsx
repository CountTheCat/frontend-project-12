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

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId))
  }

  const handleRename = (channel) => {
    setSelectedChannel(channel)
    setShowRenameModal(true)
  }

  const handleRemove = (channel) => {
    setSelectedChannel(channel)
    setShowRemoveModal(true)
  }

  const isRemovable = (channel) => {
    return channel.removable !== false
  }

  return (
    <div className="d-flex flex-column h-100 w-100">
      <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom flex-shrink-0" style={{ minHeight: '48px' }}>
        <span className="fw-bold text-secondary small text-uppercase">{t('chat.channels')}</span>
        <button
          type="button"
          className="btn btn-link p-0 text-primary"
          onClick={() => setShowAddModal(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="18"
            height="18"
            fill="currentColor"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul className="nav flex-column px-2 overflow-auto flex-grow-1" id="channels-box">
        {channels.map((channel) => {
          const isActive = currentChannelId === channel.id
          return (
            <li key={channel.id} className="nav-item w-100" style={{ minHeight: '36px', flexShrink: 0 }}>
              <div
                className={`d-flex align-items-center w-100 ${isActive ? 'active-channel' : ''}`}
                style={{
                  borderRadius: '4px',
                  backgroundColor: isActive ? '#6c757d' : 'transparent',
                  transition: 'all 0.15s ease',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f8f9fa'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <button
                  type="button"
                  onClick={() => handleChannelClick(channel.id)}
                  style={{
                    border: 'none',
                    borderRadius: '4px 0 0 4px',
                    padding: '6px 6px 6px 12px',
                    fontWeight: isActive ? '600' : '400',
                    color: isActive ? '#fff' : '#212529',
                    background: 'transparent',
                    transition: 'all 0.15s ease',
                    flex: 1,
                    minHeight: '36px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'left'
                  }}
                >
                  <span className="me-1" style={{ color: isActive ? '#fff' : '#6c757d' }}>#</span>
                  {channel.name}
                </button>
                {isRemovable(channel) && (
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`flex-grow-0 dropdown-toggle dropdown-toggle-split btn btn-sm ${isActive ? 'btn-secondary' : ''}`}
                      id={`dropdownMenu-${channel.id}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        border: 'none',
                        background: isActive ? '#6c757d' : 'transparent',
                        color: isActive ? '#fff' : '#6c757d',
                        padding: '6px 10px 6px 6px',
                        borderRadius: '0 4px 4px 0',
                        minHeight: '36px',
                        minWidth: '28px',
                        transition: 'none',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <span className="visually-hidden">{t('modals.channelManagement')}</span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby={`dropdownMenu-${channel.id}`}>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleRename(channel)}
                        >
                          {t('modals.renameChannel.title')}
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleRemove(channel)}
                        >
                          {t('modals.removeChannel.title')}
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {showAddModal && <AddChannelModal onClose={() => setShowAddModal(false)} />}
      {showRenameModal && selectedChannel && (
        <RenameChannelModal channel={selectedChannel} onClose={() => setShowRenameModal(false)} />
      )}
      {showRemoveModal && selectedChannel && (
        <RemoveChannelModal channel={selectedChannel} onClose={() => setShowRemoveModal(false)} />
      )}
    </div>
  )
}

export default ChannelsList