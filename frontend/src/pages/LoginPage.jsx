import { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Row, Col, Card, Form, Button, Container,
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

  const validation = Yup.object({
    username: Yup.string().required(t('signup.errors.usernameRequired')),
    password: Yup.string().required(t('signup.errors.passwordRequired')),
  })

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: validation,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
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
    },
  })

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
                <Form onSubmit={formik.handleSubmit}>
                  <h1 className="text-center mb-4">{t('login.title')}</h1>
                  <Form.Group controlId="username" className="form-floating mb-3">
                    <Form.Control
                      type="text" placeholder={t('login.username')}
                      value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      isInvalid={!!formik.errors.username && formik.touched.username}
                      disabled={formik.isSubmitting || loading} ref={inputRef}
                    />
                    <Form.Label>{t('login.username')}</Form.Label>
                    {formik.errors.username && formik.touched.username && (
                      <div className="invalid-tooltip">{formik.errors.username}</div>
                    )}
                  </Form.Group>
                  <Form.Group controlId="password" className="form-floating mb-4">
                    <Form.Control
                      type="password" placeholder={t('login.password')}
                      value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      isInvalid={authFailed || (!!formik.errors.password && formik.touched.password)}
                      disabled={formik.isSubmitting || loading}
                    />
                    <Form.Label>{t('login.password')}</Form.Label>
                    {authFailed && (
                      <div className="invalid-tooltip">{t('errors.auth.unauthorized')}</div>
                    )}
                    {!authFailed && formik.errors.password && formik.touched.password && (
                      <div className="invalid-tooltip">{formik.errors.password}</div>
                    )}
                  </Form.Group>
                  <Button variant="outline-primary" type="submit" className="w-100 mb-3" disabled={formik.isSubmitting || loading}>
                    {formik.isSubmitting || loading ? t('chat.sending') : t('login.submit')}
                  </Button>
                </Form>
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