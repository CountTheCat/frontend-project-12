import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/channels')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки каналов')
    }
  }
)


export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (channelData, { rejectWithValue }) => {
    try {
      const response = await api.post('/channels', channelData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания канала')
    }
  }
)

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/channels/${id}`, { name })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка переименования канала')
    }
  }
)

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/channels/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления канала')
    }
  }
)

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    currentChannelId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload)
    },
    updateChannel: (state, action) => {
      const { id, name } = action.payload
      const channel = state.channels.find((ch) => ch.id === id)
      if (channel) {
        channel.name = name
      }
    },
    deleteChannel: (state, action) => {
      const id = action.payload
      state.channels = state.channels.filter((ch) => ch.id !== id)
      if (state.currentChannelId === id) {
        state.currentChannelId = state.channels[0]?.id || null
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchChannels
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false
        state.channels = action.payload
        if (!state.currentChannelId && state.channels.length > 0) {
          state.currentChannelId = state.channels[0].id
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // createChannel
      .addCase(createChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload)
      })
      // renameChannel
      .addCase(renameChannel.fulfilled, (state, action) => {
        const { id, name } = action.payload
        const channel = state.channels.find((ch) => ch.id === id)
        if (channel) {
          channel.name = name
        }
      })
      // removeChannel
      .addCase(removeChannel.fulfilled, (state, action) => {
        const id = action.payload
        state.channels = state.channels.filter((ch) => ch.id !== id)
        if (state.currentChannelId === id && state.channels.length > 0) {
          state.currentChannelId = state.channels[0].id
        }
      })
  },
})

export const { setCurrentChannel, addChannel, updateChannel, deleteChannel } = channelsSlice.actions
export default channelsSlice.reducer