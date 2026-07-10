import { useEffect, useRef, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Col, Container, Card, Row } from 'react-bootstrap'
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

  const validation = Yup.object({
    username: Yup.string().required(t('signup.errors.usernameRequired')),
    password: Yup.string().required(t('signup.errors.passwordRequired')),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearError())
    setAuthFailed(false)
    try {
      await dispatch(login({ username: values.username.trim(), password: values.password.trim() })).unwrap()
    } catch (err) {
      setAuthFailed(true)
      inputRef.current?.select()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container className="h-100" fluid>
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <img src={avatar} className="rounded-circle" alt={t('login.title')} width="150" height="150" />
              </Col>
              <Col xs={12} md={6}>
                <Formik
                  initialValues={{ username: '', password: '' }}
                  validationSchema={validation}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                      <h1 className="text-center mb-4">{t('login.title')}</h1>
                      <div className="form-floating mb-3">
                        <Field
                          type="text"
                          name="username"
                          id="username"
                          autoComplete="off"
                          className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                          placeholder={t('login.username')}
                          innerRef={inputRef}
                        />
                        <label htmlFor="username">{t('login.username')}</label>
                        {errors.username && touched.username && (
                          <div className="invalid-tooltip">{errors.username}</div>
                        )}
                      </div>
                      <div className="form-floating mb-4">
                        <Field
                          type="password"
                          name="password"
                          id="password"
                          autoComplete="off"
                          className={`form-control ${authFailed || (errors.password && touched.password) ? 'is-invalid' : ''}`}
                          placeholder={t('login.password')}
                        />
                        <label htmlFor="password">{t('login.password')}</label>
                        {authFailed && (
                          <div className="invalid-tooltip">{t('errors.auth.unauthorized')}</div>
                        )}
                        {!authFailed && errors.password && touched.password && (
                          <div className="invalid-tooltip">{errors.password}</div>
                        )}
                      </div>
                      <Button variant="outline-primary" type="submit" className="w-100 mb-3" disabled={isSubmitting || loading}>
                        {isSubmitting || loading ? t('chat.sending') : t('login.submit')}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Card.Body>
            <Card.Footer className="p-4 text-center">
              <span>{t('login.noAccount')}</span>{' '}
              <Link to="/signup">{t('login.signupLink')}</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginPage