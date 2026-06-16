import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { removeChannel } from '../../store/slices/channelsSlice'

const RemoveChannelModal = ({ channel, onClose }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
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
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t('modals.removeChannel.title')}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>
              {t('modals.removeChannel.confirm')} <strong>#{channel.name}</strong>?
            </p>
            <p className="text-danger">{t('modals.removeChannel.warning')}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t('modals.removeChannel.cancel')}
            </button>
            <button type="button" className="btn btn-danger" onClick={handleRemove} disabled={loading}>
              {loading ? t('modals.removeChannel.submitting') : t('modals.removeChannel.submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveChannelModal