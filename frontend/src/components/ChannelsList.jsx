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
      <div 
        className="border-end d-flex flex-column p-0" 
        style={{ 
          width: '260px', 
          minWidth: '260px', 
          maxWidth: '260px',
          flexShrink: 0,
          height: '100vh',
          backgroundColor: '#f8f9fa'
        }}
      >
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: '#ffffff' }}>
          <h5 className="mb-0" style={{ fontWeight: 600, color: '#2d3748' }}>
            {t('chat.channels')}
          </h5>
          <button
            className="btn btn-sm"
            onClick={() => setShowAddModal(true)}
            style={{
              width: '28px',
              height: '28px',
              padding: 0,
              borderRadius: '50%',
              backgroundColor: '#4f46e5',
              color: '#fff',
              border: 'none',
              fontSize: '18px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4338ca'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4f46e5'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            +
          </button>
        </div>
        <div className="list-group list-group-flush overflow-auto flex-grow-1" style={{ padding: '4px 0' }}>
          {channels.map((channel) => (
            <div key={channel.id} className="list-group-item p-0 border-0" style={{ backgroundColor: 'transparent' }}>
              <div className="d-flex justify-content-between align-items-center" style={{ padding: '0 8px' }}>
                <button
                  onClick={() => handleChannelClick(channel.id)}
                  style={{
                    flex: 1,
                    textAlign: 'left',
                    padding: '8px 12px',
                    border: 'none',
                    background: currentChannelId === channel.id ? '#4f46e5' : 'transparent',
                    color: currentChannelId === channel.id ? '#ffffff' : '#4a5568',
                    borderRadius: '8px',
                    fontWeight: currentChannelId === channel.id ? 500 : 400,
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (currentChannelId !== channel.id) {
                      e.currentTarget.style.backgroundColor = '#edf2f7'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentChannelId !== channel.id) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <span style={{ color: currentChannelId === channel.id ? '#ffffff' : '#a0aec0', fontWeight: 300 }}>
                    #
                  </span>
                  {channel.name}
                </button>
                {isRemovable(channel) && (
                  <div className="dropdown" style={{ position: 'relative' }}>
                    <button
                      className="btn btn-sm"
                      onClick={() => setOpenMenuId(openMenuId === channel.id ? null : channel.id)}
                      style={{
                        padding: '4px 8px',
                        border: 'none',
                        background: 'transparent',
                        color: '#a0aec0',
                        fontSize: '10px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#4a5568'
                        e.currentTarget.style.backgroundColor = '#edf2f7'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#a0aec0'
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      ▼
                    </button>
                    {openMenuId === channel.id && (
                      <div className="dropdown-menu show position-absolute" style={{ 
                        right: 0, 
                        left: 'auto',
                        top: '100%',
                        marginTop: '4px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        minWidth: '140px',
                        padding: '4px 0',
                        zIndex: 1000
                      }}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleRename(channel)}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '8px 16px',
                            border: 'none',
                            background: 'transparent',
                            textAlign: 'left',
                            fontSize: '13px',
                            color: '#2d3748',
                            transition: 'all 0.1s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f7fafc'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          ✏️ {t('modals.renameChannel.title')}
                        </button>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleRemove(channel)}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '8px 16px',
                            border: 'none',
                            background: 'transparent',
                            textAlign: 'left',
                            fontSize: '13px',
                            color: '#e53e3e',
                            transition: 'all 0.1s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff5f5'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          🗑️ {t('modals.removeChannel.title')}
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