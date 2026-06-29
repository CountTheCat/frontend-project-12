import { useEffect, useRef, useState } from 'react'
import { Formik, Form as FormikForm, Field } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Button, Form, Col, Container, Card, Row, FloatingLabel,
} from 'react-bootstrap'
import { login, clearError } from '../store/slices/authSlice'
import avatar from '../assets/avatar.jpg'

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
    <Container className="h-100" fluid>
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="p-5 row">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src={avatar}
                  className="rounded-circle"
                  alt="Log in page"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
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
                {({ isSubmitting, errors, touched, handleSubmit }) => (
                  <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={handleSubmit}>
                    <h1 className="text-center mb-4">{t('login.title')}</h1>
                    <fieldset disabled={isSubmitting || loading}>
                      <Form.Group className="form-floating mb-3">
                        <FloatingLabel controlId="username" label={t('login.username')}>
                          <Field
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            placeholder={t('login.username')}
                            className={`form-control ${(touched.username && errors.username) || authFailed ? 'is-invalid' : ''}`}
                            innerRef={inputRef}
                          />
                        </FloatingLabel>
                        {errors.username && touched.username && (
                          <div className="invalid-feedback">{errors.username}</div>
                        )}
                      </Form.Group>

                      <Form.Group className="form-floating mb-3">
                        <FloatingLabel controlId="password" label={t('login.password')}>
                          <Field
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="current-password"
                            placeholder={t('login.password')}
                            className={`form-control ${(touched.password && errors.password) || authFailed ? 'is-invalid' : ''}`}
                          />
                        </FloatingLabel>
                        {authFailed && (
                          <div className="invalid-feedback d-block">{t('errors.auth.unauthorized')}</div>
                        )}
                        {!authFailed && errors.password && touched.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </Form.Group>

                      <Button type="submit" disabled={isSubmitting || loading} variant="outline-primary" className="w-100 mb-3">
                        {isSubmitting || loading ? t('chat.sending') : t('login.submit')}
                      </Button>
                    </fieldset>
                  </Form>
                )}
              </Formik>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('login.noAccount')}</span>
                {' '}
                <Link to="/signup">{t('login.signupLink')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginPage