import { useEffect, useRef } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { createChannel } from '../../store/slices/channelsSlice'
import { filterText } from '../../utils/filter'

const AddChannelModal = ({ onClose }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { channels, loading } = useSelector(state => state.channels)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('modals.addChannel.errors.min'))
      .max(20, t('modals.addChannel.errors.max'))
      .matches(/^[a-zA-Zа-яА-Я0-9]+$/, t('modals.addChannel.errors.invalid'))
      .required(t('modals.addChannel.errors.required'))
      .test('unique', t('modals.addChannel.errors.unique'), function (value) {
        return !channels.some(ch => ch.name === value)
      })
      .test('profanity', 'Название содержит недопустимые слова', function (value) {
        const filtered = filterText(value)
        return filtered === value
      }),
  })

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const filteredName = filterText(values.name)
      await dispatch(createChannel({ name: filteredName })).unwrap()
      onClose()
    }
    catch {
      setFieldError('name', t('modals.addChannel.errors.createError'))
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
            <h5 className="modal-title">{t('modals.addChannel.title')}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <Formik
            initialValues={{ name: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      {t('modals.addChannel.name')}
                    </label>
                    <Field
                      innerRef={inputRef}
                      type="text"
                      name="name"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      placeholder={t('modals.addChannel.namePlaceholder')}
                    />
                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    {t('modals.addChannel.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting || loading ? t('modals.addChannel.submitting') : t('modals.addChannel.submit')}
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

export default AddChannelModal
