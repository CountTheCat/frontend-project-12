import { useEffect, useState } from 'react'
import { Formik, Form as FormikForm, Field } from 'formik'
import * as Yup from 'yup'
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

  const validation = Yup.object({
    username: Yup.string()
      .min(3, t('signup.errors.usernameMin'))
      .max(20, t('signup.errors.usernameMax'))
      .matches(/^[a-zA-Zа-яА-Я0-9_-]+$/, t('signup.errors.usernameInvalid'))
      .required(t('signup.errors.usernameRequired')),
    password: Yup.string()
      .min(6, t('signup.errors.passwordMin'))
      .required(t('signup.errors.passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('signup.errors.confirmPasswordMatch'))
      .required(t('signup.errors.confirmPasswordRequired')),
  })

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setFailedRegistration(false)
    try {
      await dispatch(signup({
        username: values.username.trim(),
        password: values.password.trim(),
      })).unwrap()
    } catch (err) {
      if (err === '409') {
        setFailedRegistration(true)
        setFieldError('username', t('signup.errors.userExists'))
      } else {
        setFieldError('general', err || t('signup.errors.registrationError'))
      }
    } finally {
      setSubmitting(false)
    }
  }

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
                  alt={t('signup.title')}
                  width="150"
                  height="150"
                />
              </div>
              <Formik
                initialValues={{ username: '', password: '', confirmPassword: '' }}
                validationSchema={validation}
                onSubmit={handleSubmit}
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
                        <Form.Control.Feedback type="invalid">
                          {errors.username || (failedRegistration ? t('signup.errors.userExists') : '')}
                        </Form.Control.Feedback>
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
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
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
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
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