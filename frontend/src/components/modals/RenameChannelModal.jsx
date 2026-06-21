import { useEffect, useRef } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
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

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('modals.renameChannel.errors.min'))
      .max(20, t('modals.renameChannel.errors.max'))
      .matches(/^[a-zA-Zа-яА-Я0-9]+$/, t('modals.renameChannel.errors.invalid'))
      .required(t('modals.renameChannel.errors.required'))
      .test('unique', t('modals.renameChannel.errors.unique'), function (value) {
        return !channels.some(ch => ch.name === value && ch.id !== channel.id)
      })
      .test('profanity', 'Название содержит недопустимые слова', function (value) {
        const filtered = filterText(value)
        return filtered === value
      }),
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
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      {t('modals.renameChannel.name')}
                    </label>
                    <Field
                      innerRef={inputRef}
                      type="text"
                      name="name"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      placeholder={t('modals.renameChannel.namePlaceholder')}
                    />
                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                  </div>
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
  )
}

export default RenameChannelModal
