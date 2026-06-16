import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { logout } from '../store/slices/authSlice'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-light bg-light px-3 border-bottom flex-shrink-0">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          {t('header.brand')}
        </Link>
        {isAuthenticated && (
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            {t('header.logout')}
          </button>
        )}
      </div>
    </nav>
  )
}

export default Header