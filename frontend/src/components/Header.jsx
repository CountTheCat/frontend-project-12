import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-light bg-light px-3 border-bottom flex-shrink-0">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          Hexlet Chat
        </Link>
        {isAuthenticated && (
          <button className="btn btn-outline-secondary" onClick={handleLogout}>
            Выйти
          </button>
        )}
      </div>
    </nav>
  )
}

export default Header