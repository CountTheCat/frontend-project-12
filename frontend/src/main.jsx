import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'
import { store } from './store'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import './i18n'

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.MODE || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary fallbackUI={({ error, resetError }) => (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Что-то пошло не так</h2>
            <p>Мы уже работаем над исправлением.</p>
            <button onClick={resetError} className="btn btn-primary">
              Попробовать снова
            </button>
          </div>
        )}>
          <App />
        </ErrorBoundary>
      </RollbarProvider>
    </ReduxProvider>
  </React.StrictMode>,
)