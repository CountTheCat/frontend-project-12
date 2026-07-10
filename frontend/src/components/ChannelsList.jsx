import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { BsPlusSquare } from 'react-icons/bs'
import { Button, Nav, ButtonGroup, Dropdown } from 'react-bootstrap'
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
      <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom flex-shrink-0">
        <span className="fw-bold text-secondary small text-uppercase">{t('chat.channels')}</span>
        <Button
          variant="group-vertical"
          className="p-0 text-primary"
          onClick={() => setShowAddModal(true)}
        >
          <BsPlusSquare size={18} />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <Nav className="flex-column px-2 overflow-auto flex-grow-1" as="ul">
        {channels.map((channel) => {
          const isActive = currentChannelId === channel.id
          if (!isRemovable(channel)) {
            return (
              <Nav.Item key={channel.id} className="w-100" as="li">
                <Button
                  variant={isActive ? 'secondary' : 'light'}
                  className="w-100 rounded-0 text-start text-truncate"
                  onClick={() => handleChannelClick(channel.id)}
                >
                  <span className="me-1">#</span>
                  {channel.name}
                </Button>
              </Nav.Item>
            )
          }
          return (
            <Nav.Item key={channel.id} className="w-100" as="li">
              <Dropdown as={ButtonGroup} className="d-flex">
                <Button
                  variant={isActive ? 'secondary' : 'light'}
                  className="w-100 rounded-0 text-start text-truncate"
                  onClick={() => handleChannelClick(channel.id)}
                >
                  <span className="me-1">#</span>
                  {channel.name}
                </Button>
                <Dropdown.Toggle
                  variant={isActive ? 'secondary' : 'light'}
                  className="flex-grow-0 dropdown-toggle-split"
                >
                  <span className="visually-hidden">{t('modals.channelManagement')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleRename(channel)}>
                    {t('modals.renameChannel.title')}
                  </Dropdown.Item>
                  <Dropdown.Item className="text-danger" onClick={() => handleRemove(channel)}>
                    {t('modals.removeChannel.title')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav.Item>
          )
        })}
      </Nav>

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