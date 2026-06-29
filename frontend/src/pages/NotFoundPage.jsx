import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import imagePath from '../assets/notFound.jpg'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <div className="text-center">
      <img alt="Страница не найдена" className="img-fluid h-25" src={imagePath} />
      <h1 className="h4 text-muted">{t('errors.notFound.title')}</h1>
      <p className="text-muted">
        {t('errors.notFound.message')}
        {' '}
        <Link to="/">{t('errors.notFound.back')}</Link>
      </p>
    </div>
  )
}

export default NotFoundPage