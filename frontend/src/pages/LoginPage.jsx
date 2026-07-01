import { useEffect, useRef, useState } from 'react'
import { Formik, Form as FormikForm, Field } from 'formik'
import * as Yup from 'yup'
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

  const validation = Yup.object({
    username: Yup.string().required(t('signup.errors.usernameRequired')),
    password: Yup.string().required(t('signup.errors.passwordRequired')),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearError())
    setAuthFailed(false)

    try {
      await dispatch(login({
        username: values.username.trim(),
        password: values.password.trim(),
      })).unwrap()
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
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="p-5 row">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src={avatar}
                  className="rounded-circle"
                  alt={t('login.title')}
                  width="150"
                  height="150"
                />
              </div>
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={validation}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched, handleSubmit }) => (
                  <Form className="col-12 col-md-6 mt-3 mt-md-0" onSubmit={handleSubmit}>
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
                            className={`form-control ${(touched.username && errors.username) ? 'is-invalid' : ''}`}
                            innerRef={inputRef}
                          />
                        </FloatingLabel>
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
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
                        <Form.Control.Feedback type="invalid" className="d-block">
                          {authFailed ? t('errors.auth.unauthorized') : errors.password}
                        </Form.Control.Feedback>
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