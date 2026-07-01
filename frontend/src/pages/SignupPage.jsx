import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Row, Col, Card, Form, Button, Container,
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
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  const validation = Yup.object({
    username: Yup.string()
      .min(3, t('signup.errors.usernameMin')).max(20, t('signup.errors.usernameMax'))
      .matches(/^[a-zA-Zа-яА-Я0-9_-]+$/, t('signup.errors.usernameInvalid'))
      .required(t('signup.errors.usernameRequired')),
    password: Yup.string()
      .min(6, t('signup.errors.passwordMin')).required(t('signup.errors.passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('signup.errors.confirmPasswordMatch'))
      .required(t('signup.errors.confirmPasswordRequired')),
  })

  const formik = useFormik({
    initialValues: { username: '', password: '', confirmPassword: '' },
    validationSchema: validation,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setFailedRegistration(false)
      try {
        await dispatch(signup({ username: values.username.trim(), password: values.password.trim() })).unwrap()
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
    },
  })

  return (
    <Container className="container-fluid h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <img src={avatar1} className="rounded-circle" alt={t('signup.title')} width="150" height="150" />
              </Col>
              <Col xs={12} md={6}>
                <Form onSubmit={formik.handleSubmit}>
                  <h1 className="text-center mb-4">{t('signup.title')}</h1>
                  <Form.Group controlId="username" className="form-floating mb-3">
                    <Form.Control
                      type="text" placeholder={t('signup.username')}
                      value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      isInvalid={(!!formik.errors.username && formik.touched.username) || failedRegistration}
                      disabled={formik.isSubmitting || loading}
                    />
                    <Form.Label>{t('signup.username')}</Form.Label>
                    {formik.errors.username && formik.touched.username && (
                      <div className="invalid-tooltip">{formik.errors.username}</div>
                    )}
                    {failedRegistration && !formik.errors.username && (
                      <div className="invalid-tooltip">{t('signup.errors.userExists')}</div>
                    )}
                  </Form.Group>
                  <Form.Group controlId="password" className="form-floating mb-3">
                    <Form.Control
                      type="password" placeholder={t('signup.password')}
                      value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      isInvalid={!!formik.errors.password && formik.touched.password}
                      disabled={formik.isSubmitting || loading}
                    />
                    <Form.Label>{t('signup.password')}</Form.Label>
                    {formik.errors.password && formik.touched.password && (
                      <div className="invalid-tooltip">{formik.errors.password}</div>
                    )}
                  </Form.Group>
                  <Form.Group controlId="confirmPassword" className="form-floating mb-4">
                    <Form.Control
                      type="password" placeholder={t('signup.confirmPassword')}
                      value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      isInvalid={!!formik.errors.confirmPassword && formik.touched.confirmPassword}
                      disabled={formik.isSubmitting || loading}
                    />
                    <Form.Label>{t('signup.confirmPassword')}</Form.Label>
                    {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                      <div className="invalid-tooltip">{formik.errors.confirmPassword}</div>
                    )}
                  </Form.Group>
                  <Button variant="outline-primary" type="submit" className="w-100 mb-3" disabled={formik.isSubmitting || loading}>
                    {formik.isSubmitting || loading ? t('chat.sending') : t('signup.submit')}
                  </Button>
                </Form>
              </Col>
            </Card.Body>
            <Card.Footer className="p-4 text-center">
              <Link to="/login">{t('signup.loginLink')}</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default SignupPage