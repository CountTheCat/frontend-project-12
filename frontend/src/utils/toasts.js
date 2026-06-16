import { toast } from 'react-toastify'
import i18n from '../i18n'

const t = i18n.t.bind(i18n)

export const showSuccess = (message) => {
  toast.success(message)
}

export const showError = (message) => {
  toast.error(message)
}

export const showInfo = (message) => {
  toast.info(message)
}

export const showNetworkError = () => {
  toast.error(t('toasts.networkError'))
}

export const showLoadError = () => {
  toast.error(t('toasts.loadError'))
}

export const showChannelCreated = (name) => {
  toast.success(`${t('toasts.channelCreated')}: #${name}`)
}

export const showChannelRenamed = (name) => {
  toast.success(`${t('toasts.channelRenamed')}: #${name}`)
}

export const showChannelRemoved = (name) => {
  toast.success(`${t('toasts.channelRemoved')}: #${name}`)
}