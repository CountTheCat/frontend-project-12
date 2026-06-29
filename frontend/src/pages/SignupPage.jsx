import { useEffect, useState } from 'react'
import { Formik, Form as FormikForm, Field } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Button, Form, Col, Container, Card, Row, FloatingLabel,
} from 'react-bootstrap'
import { signup } from '../store/slices/authSlice'
import avatar1 from '../assets/avatar_1.jpg'

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
    <Container className="container-fluid h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img
                  src={avatar1}
                  className="rounded-circle"
                  alt="Registration Avatar"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
              <Formik
                initialValues={{ username: '', password: '', confirmPassword: '' }}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                  setFailedRegistration(false)

                  const errors = {}
                  const trimmedUsername = values.username?.trim() || ''
                  const trimmedPassword = values.password?.trim() || ''
                  const trimmedConfirmPassword = values.confirmPassword?.trim() || ''

                  if (!trimmedUsername) errors.username = t('signup.errors.usernameRequired')
                  else if (trimmedUsername.length < 3) errors.username = t('signup.errors.usernameMin')
                  else if (trimmedUsername.length > 20) errors.username = t('signup.errors.usernameMax')
                  else if (!/^[a-zA-Zа-яА-Я0-9_-]+$/.test(trimmedUsername)) errors.username = t('signup.errors.usernameInvalid')

                  if (!trimmedPassword) errors.password = t('signup.errors.passwordRequired')
                  else if (trimmedPassword.length < 6) errors.password = t('signup.errors.passwordMin')

                  if (!trimmedConfirmPassword) errors.confirmPassword = t('signup.errors.confirmPasswordRequired')
                  else if (trimmedConfirmPassword !== trimmedPassword) errors.confirmPassword = t('signup.errors.confirmPasswordMatch')

                  if (Object.keys(errors).length > 0) {
                    setErrors(errors)
                    setSubmitting(false)
                    return
                  }

                  try {
                    await dispatch(signup({ username: trimmedUsername, password: trimmedPassword })).unwrap()
                  } catch (err) {
                    if (err === '409') {
                      setFailedRegistration(true)
                      setErrors({ username: t('signup.errors.userExists') })
                    } else {
                      setErrors({ general: err || t('signup.errors.registrationError') })
                    }
                  } finally {
                    setSubmitting(false)
                  }
                }}
              >
                {({ isSubmitting, errors, touched, handleSubmit }) => (
                  <Form className="w-50" onSubmit={handleSubmit}>
                    <h1 className="text-center mb-4">{t('signup.title')}</h1>
                    <fieldset disabled={isSubmitting || loading}>
                      <Form.Group className="form-floating mb-3">
                        <FloatingLabel controlId="username" label={t('signup.username')}>
                          <Field
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            placeholder={t('signup.username')}
                            className={`form-control ${(touched.username && errors.username) || failedRegistration ? 'is-invalid' : ''}`}
                          />
                        </FloatingLabel>
                        {errors.username && touched.username && (
                          <div className="invalid-feedback">{errors.username}</div>
                        )}
                        {failedRegistration && !errors.username && (
                          <div className="invalid-feedback">{t('signup.errors.userExists')}</div>
                        )}
                      </Form.Group>

                      <Form.Group className="form-floating mb-3">
                        <FloatingLabel controlId="password" label={t('signup.password')}>
                          <Field
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="new-password"
                            placeholder={t('signup.password')}
                            className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                          />
                        </FloatingLabel>
                        {errors.password && touched.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </Form.Group>

                      <Form.Group className="form-floating mb-3">
                        <FloatingLabel controlId="confirmPassword" label={t('signup.confirmPassword')}>
                          <Field
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            autoComplete="new-password"
                            placeholder={t('signup.confirmPassword')}
                            className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                          />
                        </FloatingLabel>
                        {errors.confirmPassword && touched.confirmPassword && (
                          <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                      </Form.Group>

                      <Button type="submit" disabled={isSubmitting || loading} className="w-100" variant="outline-primary">
                        {isSubmitting || loading ? t('chat.sending') : t('signup.submit')}
                      </Button>
                    </fieldset>
                    <div className="mt-3 text-center">
                      <Link to="/login">{t('signup.loginLink')}</Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default SignupPage