import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/messages')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки сообщений')
    }
  }
)

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await api.post('/messages', messageData)
      return response.data
    } catch (error) {
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
      state.messages.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMessages
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
      // sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload)
      })
  },
})

export const { addMessage } = messagesSlice.actions
export default messagesSlice.reducer