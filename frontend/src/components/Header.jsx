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
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white" style={{ marginTop: 0 }}>
      <div className="container">
        <Link to="/" className="navbar-brand">
          {t('header.brand')}
        </Link>
        {isAuthenticated && (
          <button className="btn btn-primary" onClick={handleLogout}>
            {t('header.logout')}
          </button>
        )}
      </div>
    </nav>
  )
}

export default Header