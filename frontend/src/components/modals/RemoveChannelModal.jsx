import { useDispatch, useSelector } from 'react-redux'
import { removeChannel } from '../../store/slices/channelsSlice'

const RemoveChannelModal = ({ channel, onClose }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.channels)

  const handleRemove = async () => {
    try {
      await dispatch(removeChannel(channel.id)).unwrap()
      onClose()
    } catch (error) {
      console.error('Ошибка удаления канала:', error)
    }
  }

  return (
    <div className="modal show d-block" tabIndex="-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Удалить канал</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Вы уверены, что хотите удалить канал <strong>#{channel.name}</strong>?</p>
            <p className="text-danger">Все сообщения канала будут удалены.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="button" className="btn btn-danger" onClick={handleRemove} disabled={loading}>
              {loading ? 'Удаление...' : 'Удалить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveChannelModal