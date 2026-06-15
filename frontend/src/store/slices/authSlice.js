import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', { username, password })
      const { token, username: userName } = response.data
      
      if (!token) {
        throw new Error('Сервер не вернул токен')
      }
      
      localStorage.setItem('token', token)
      return { token, username: userName }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка авторизации')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token')
  return null
})

const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token') || null,
  username: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.username = action.payload.username
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.token = null
        state.username = null
        state.error = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer