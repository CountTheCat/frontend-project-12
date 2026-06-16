import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { signup } from '../store/slices/authSlice'

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .matches(/^[a-zA-Zа-яА-Я0-9]+$/, 'Только буквы и цифры')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
    .required('Обязательное поле'),
})

const SignupPage = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await dispatch(signup({
        username: values.username,
        password: values.password,
      })).unwrap()
    } catch (err) {
      if (err === '409') {
        setFieldError('username', 'Пользователь с таким именем уже существует')
      } else {
        setFieldError('general', err || 'Ошибка регистрации')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Регистрация</h2>
          
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
                    Имя пользователя
                  </label>
                  <Field
                    type="text"
                    name="username"
                    autoComplete="username"
                    className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                    placeholder="Введите имя пользователя"
                  />
                  <ErrorMessage name="username" component="div" className="invalid-feedback" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Пароль
                  </label>
                  <Field
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                    placeholder="Введите пароль"
                  />
                  <ErrorMessage name="password" component="div" className="invalid-feedback" />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Подтверждение пароля
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Подтвердите пароль"
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
                  {isSubmitting || loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>

                <div className="mt-3 text-center">
                  <Link to="/login">Уже есть аккаунт? Войти</Link>
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