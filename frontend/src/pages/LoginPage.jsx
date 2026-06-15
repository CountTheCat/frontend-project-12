import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { login, clearError } from '../store/slices/authSlice'

const validate = (values) => {
  const errors = {}
  const trimmedUsername = values.username?.trim() || ''
  const trimmedPassword = values.password?.trim() || ''
  
  if (!trimmedUsername) {
    errors.username = 'Имя пользователя обязательно'
  } else if (trimmedUsername.length < 3) {
    errors.username = 'Минимум 3 символа'
  } else if (trimmedUsername.length > 20) {
    errors.username = 'Максимум 20 символов'
  }
  
  if (!trimmedPassword) {
    errors.password = 'Пароль обязателен'
  } else if (trimmedPassword.length < 5) {
    errors.password = 'Минимум 5 символов'
  }
  
  return errors
}

const LoginPage = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Вход в чат</h2>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <Formik
            initialValues={{ username: '', password: '' }}
            validate={validate}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              dispatch(clearError())
              
              const trimmedValues = {
                username: values.username.trim(),
                password: values.password.trim()
              }
              
              try {
                await dispatch(login(trimmedValues)).unwrap()
              } catch (err) {
                setFieldError('general', err)
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Имя пользователя
                  </label>
                  <Field
                    type="text"
                    name="username"
                    autoComplete="username"
                    className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                    placeholder="Введите имя пользователя"
                  />
                  <ErrorMessage name="username" component="div" className="invalid-feedback" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Пароль
                  </label>
                  <Field
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                    placeholder="Введите пароль"
                  />
                  <ErrorMessage name="password" component="div" className="invalid-feedback" />
                </div>

                {errors.general && (
                  <div className="alert alert-danger">{errors.general}</div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary w-100" 
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? 'Вход...' : 'Войти'}
                </button>
              </Form>
            )}
          </Formik>
          
          <div className="mt-3 text-center text-muted">
            <small>Тестовый пользователь: admin / admin</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage