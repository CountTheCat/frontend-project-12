import { useEffect, useRef } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { renameChannel } from '../../store/slices/channelsSlice'
import { filterText } from '../../utils/filter'

const RenameChannelModal = ({ channel, onClose }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { channels, loading } = useSelector(state => state.channels)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const channelsName = channels
    .filter(ch => ch.id !== channel.id)
    .map(ch => ch.name)

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required(t('modals.renameChannel.errors.required'))
      .min(3, t('modals.renameChannel.errors.min'))
      .max(20, t('modals.renameChannel.errors.max'))
      .notOneOf(channelsName, t('modals.renameChannel.errors.unique')),
  })

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const filteredName = filterText(values.name)
      await dispatch(renameChannel({ id: channel.id, name: filteredName })).unwrap()
      onClose()
    }
    catch {
      setFieldError('name', t('modals.renameChannel.errors.renameError'))
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop show">
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{t('modals.renameChannel.title')}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <Formik
              initialValues={{ name: channel.name }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <FloatingLabel controlId="name" label={t('modals.renameChannel.name')} className="mb-3">
                      <Field
                        innerRef={inputRef}
                        type="text"
                        name="name"
                        id="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder={t('modals.renameChannel.name')}
                      />
                      <ErrorMessage name="name" component="div" className="invalid-feedback" />
                    </FloatingLabel>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                      {t('modals.renameChannel.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading ? t('modals.renameChannel.submitting') : t('modals.renameChannel.submit')}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RenameChannelModal