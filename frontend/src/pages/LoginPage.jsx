import { Formik, Form, Field, ErrorMessage } from 'formik'

const LoginPage = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Вход в чат</h2>
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={(values) => {
              console.log('Form data:', values)
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Имя пользователя
                  </label>
                  <Field
                    type="text"
                    name="username"
                    autoComplete="username"
                    className="form-control"
                    placeholder="Введите имя пользователя"
                  />
                  <ErrorMessage name="username" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Пароль
                  </label>
                  <Field
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    className="form-control"
                    placeholder="Введите пароль"
                  />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                  Войти
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default LoginPage