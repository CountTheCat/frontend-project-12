import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { login, clearError } from '../store/slices/authSlice'

const LoginPage = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  const validate = (values) => {
    const errors = {}
    const trimmedUsername = values.username?.trim() || ''
    const trimmedPassword = values.password?.trim() || ''
    
    if (!trimmedUsername) {
      errors.username = t('signup.errors.usernameRequired')
    } else if (trimmedUsername.length < 3) {
      errors.username = t('signup.errors.usernameMin')
    } else if (trimmedUsername.length > 20) {
      errors.username = t('signup.errors.usernameMax')
    }
    
    if (!trimmedPassword) {
      errors.password = t('signup.errors.passwordRequired')
    } else if (trimmedPassword.length < 5) {
      errors.password = t('signup.errors.passwordMin')
    }
    
    return errors
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">{t('login.title')}</h2>
          
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
                    {t('login.username')}
                  </label>
                  <Field
                    type="text"
                    name="username"
                    autoComplete="username"
                    className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                    placeholder={t('login.username')}
                  />
                  <ErrorMessage name="username" component="div" className="invalid-feedback" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    {t('login.password')}
                  </label>
                  <Field
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                    placeholder={t('login.password')}
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
                  {isSubmitting || loading ? t('chat.sending') : t('login.submit')}
                </button>

                <div className="mt-3 text-center">
                  <Link to="/signup">{t('login.signupLink')}</Link>
                </div>
              </Form>
            )}
          </Formik>
          
          <div className="mt-3 text-center text-muted">
            <small>{t('login.testUser')}</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage