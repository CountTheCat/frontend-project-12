import { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { signup } from '../store/slices/authSlice'

const SignupPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t('signup.errors.usernameMin'))
      .max(20, t('signup.errors.usernameMax'))
      .matches(/^[a-zA-Zа-яА-Я0-9]+$/, t('signup.errors.usernameInvalid'))
      .required(t('signup.errors.usernameRequired')),
    password: Yup.string()
      .min(6, t('signup.errors.passwordMin'))
      .required(t('signup.errors.passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('signup.errors.confirmPasswordMatch'))
      .required(t('signup.errors.confirmPasswordRequired')),
  })

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    console.log('📤 Отправка регистрации:', { username: values.username, password: values.password })
    try {
      const result = await dispatch(signup({
        username: values.username,
        password: values.password,
      })).unwrap()
      console.log('✅ Регистрация успешна:', result)
      navigate('/')
    } catch (err) {
      console.error('❌ Ошибка регистрации:', err)
      if (err === '409') {
        setFieldError('username', t('signup.errors.userExists'))
      } else {
        setFieldError('general', err || t('signup.errors.registrationError'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">{t('signup.title')}</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <Formik
            initialValues={{ username: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    {t('signup.username')}
                  </label>
                  <Field
                    type="text"
                    name="username"
                    autoComplete="username"
                    className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                    placeholder={t('signup.username')}
                  />
                  <ErrorMessage name="username" component="div" className="invalid-feedback" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    {t('signup.password')}
                  </label>
                  <Field
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                    placeholder={t('signup.password')}
                  />
                  <ErrorMessage name="password" component="div" className="invalid-feedback" />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    {t('signup.confirmPassword')}
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder={t('signup.confirmPassword')}
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
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

                <div className="mt-3 text-center">
                  <Link to="/login">{t('signup.loginLink')}</Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default SignupPage