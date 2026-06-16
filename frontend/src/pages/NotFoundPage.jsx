import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <div className="container text-center mt-5">
      <h1>404</h1>
      <h2>{t('errors.notFound.title')}</h2>
      <p>{t('errors.notFound.message')}</p>
      <Link to="/" className="btn btn-primary">
        {t('errors.notFound.back')}
      </Link>
    </div>
  )
}

export default NotFoundPage