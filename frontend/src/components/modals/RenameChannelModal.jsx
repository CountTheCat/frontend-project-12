import { useEffect, useRef } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { renameChannel } from '../../store/slices/channelsSlice'

const validationSchema = (channels, currentId) => Yup.object({
  name: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .matches(/^[a-zA-Zа-яА-Я0-9]+$/, 'Только буквы и цифры')
    .required('Обязательное поле')
    .test('unique', 'Канал с таким именем уже существует', function(value) {
      return !channels.some(ch => ch.name === value && ch.id !== currentId)
    })
})

const RenameChannelModal = ({ channel, onClose }) => {
  const dispatch = useDispatch()
  const { channels, loading } = useSelector((state) => state.channels)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await dispatch(renameChannel({ id: channel.id, name: values.name })).unwrap()
      onClose()
    } catch (error) {
      setFieldError('name', error.response?.data?.message || 'Ошибка переименования канала')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal show d-block" tabIndex="-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Переименовать канал</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <Formik
            initialValues={{ name: channel.name }}
            validationSchema={validationSchema(channels, channel.id)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Имя канала</label>
                    <Field
                      innerRef={inputRef}
                      type="text"
                      name="name"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Введите новое имя канала"
                    />
                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Отмена
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting || loading ? 'Переименование...' : 'Переименовать'}
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