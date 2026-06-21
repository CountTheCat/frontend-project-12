import { io } from 'socket.io-client'

const getToken = () => localStorage.getItem('token')

const socket = io('/', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  auth: (cb) => {
    cb({ token: getToken() })
  },
})

socket.on('connect', () => {
  console.log('Socket connected:', socket.id)
})

socket.on('disconnect', () => {
  console.log('Socket disconnected')
})

socket.on('connect_error', (error) => {
  console.error('Socket error:', error.message)
})

export default socket
