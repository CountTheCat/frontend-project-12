import { useEffect, useRef, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { login, clearError } from '../store/slices/authSlice'

const LoginPage = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)
  const [authFailed, setAuthFailed] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">{t('login.title')}</h2>

          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              dispatch(clearError())
              setAuthFailed(false)

              const errors = {}
              const trimmedUsername = values.username?.trim() || ''
              const trimmedPassword = values.password?.trim() || ''

              if (!trimmedUsername) errors.username = t('signup.errors.usernameRequired')
              if (!trimmedPassword) errors.password = t('signup.errors.passwordRequired')

              if (Object.keys(errors).length > 0) {
                setErrors(errors)
                setSubmitting(false)
                return
              }

              try {
                await dispatch(login({ username: trimmedUsername, password: trimmedPassword })).unwrap()
              } catch (err) {
                setAuthFailed(true)
                inputRef.current?.select()
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="form-floating mb-3">
                  <Field
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                    placeholder={t('login.username')}
                    innerRef={inputRef}
                  />
                  <label htmlFor="username">{t('login.username')}</label>
                  {errors.username && touched.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>

                <div className="form-floating mb-3">
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    className={`form-control ${(touched.password && errors.password) || authFailed ? 'is-invalid' : ''}`}
                    placeholder={t('login.password')}
                  />
                  <label htmlFor="password">{t('login.password')}</label>
                  {authFailed && (
                    <div className="invalid-feedback d-block">{t('errors.auth.unauthorized')}</div>
                  )}
                  {!authFailed && errors.password && touched.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? t('chat.sending') : t('login.submit')}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-3 text-center">
            <span>{t('login.noAccount')}</span>
            {' '}
            <Link to="/signup">{t('login.signupLink')}</Link>
          </div>

          <div className="mt-3 text-center text-muted">
            <small>{t('login.testUser')}</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage