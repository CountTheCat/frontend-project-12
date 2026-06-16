import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { showNetworkError, showLoadError } from '../../utils/toasts'

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/messages')
      return response.data
    } catch (error) {
      if (!error.response) {
        showNetworkError()
      } else {
        showLoadError()
      }
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки сообщений')
    }
  }
)

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ channelId, body, username }, { rejectWithValue }) => {
    try {
      const response = await api.post('/messages', { channelId, body, username })
      return response.data
    } catch (error) {
      if (!error.response) {
        showNetworkError()
      }
      return rejectWithValue(error.response?.data?.message || 'Ошибка отправки сообщения')
    }
  }
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      const exists = state.messages.some(msg => msg.id === action.payload.id)
      if (!exists) {
        state.messages.push(action.payload)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(sendMessage.pending, (state) => {
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const exists = state.messages.some(msg => msg.id === action.payload.id)
        if (!exists) {
          state.messages.push(action.payload)
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { addMessage } = messagesSlice.actions
export default messagesSlice.reducer