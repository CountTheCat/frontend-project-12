import { useEffect, useState } from 'react'
import { Formik, Form as FormikForm, Field } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Form } from 'react-bootstrap'
import { signup } from '../store/slices/authSlice'

const SignupPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)
  const [failedRegistration, setFailedRegistration] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">{t('signup.title')}</h2>

          <Formik
            initialValues={{ username: '', password: '', confirmPassword: '' }}
            onSubmit={async (values, { setSubmitting, setFieldError, setErrors }) => {
              setFailedRegistration(false)

              const errors = {}
              const trimmedUsername = values.username?.trim() || ''
              const trimmedPassword = values.password?.trim() || ''
              const trimmedConfirmPassword = values.confirmPassword?.trim() || ''

              // Валидация имени пользователя
              if (!trimmedUsername) {
                errors.username = t('signup.errors.usernameRequired')
              } else if (trimmedUsername.length < 3) {
                errors.username = t('signup.errors.usernameMin')
              } else if (trimmedUsername.length > 20) {
                errors.username = t('signup.errors.usernameMax')
              } else if (!/^[a-zA-Zа-яА-Я0-9_-]+$/.test(trimmedUsername)) {
                errors.username = t('signup.errors.usernameInvalid')
              }

              // Валидация пароля
              if (!trimmedPassword) {
                errors.password = t('signup.errors.passwordRequired')
              } else if (trimmedPassword.length < 6) {
                errors.password = t('signup.errors.passwordMin')
              }

              // Валидация подтверждения пароля
              if (!trimmedConfirmPassword) {
                errors.confirmPassword = t('signup.errors.confirmPasswordRequired')
              } else if (trimmedConfirmPassword !== trimmedPassword) {
                errors.confirmPassword = t('signup.errors.confirmPasswordMatch')
              }

              if (Object.keys(errors).length > 0) {
                setErrors(errors)
                setSubmitting(false)
                return
              }

              try {
                await dispatch(signup({
                  username: trimmedUsername,
                  password: trimmedPassword,
                })).unwrap()
              } catch (err) {
                if (err === '409') {
                  setFailedRegistration(true)
                  setErrors({ username: t('signup.errors.userExists') })
                } else {
                  setFieldError('general', err || t('signup.errors.registrationError'))
                }
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <FormikForm>
                <div className="form-floating mb-3">
                  <Field
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className={`form-control ${(touched.username && errors.username) || failedRegistration ? 'is-invalid' : ''}`}
                    placeholder={t('signup.username')}
                  />
                  <label htmlFor="username">{t('signup.username')}</label>
                  <Form.Control.Feedback type="invalid" className="invalid-tooltip">
                    {errors.username || (failedRegistration ? t('signup.errors.userExists') : '')}
                  </Form.Control.Feedback>
                </div>

                <div className="form-floating mb-3">
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="new-password"
                    className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                    placeholder={t('signup.password')}
                  />
                  <label htmlFor="password">{t('signup.password')}</label>
                  <Form.Control.Feedback type="invalid" className="invalid-tooltip">
                    {errors.password}
                  </Form.Control.Feedback>
                </div>

                <div className="form-floating mb-3">
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    autoComplete="new-password"
                    className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder={t('signup.confirmPassword')}
                  />
                  <label htmlFor="confirmPassword">{t('signup.confirmPassword')}</label>
                  <Form.Control.Feedback type="invalid" className="invalid-tooltip">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </div>

                {errors.general && (
                  <div className="alert alert-danger">{errors.general}</div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? t('chat.sending') : t('signup.submit')}
                </button>
              </FormikForm>
            )}
          </Formik>

          <div className="mt-3 text-center">
            <Link to="/login">{t('signup.loginLink')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage