import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import {
  showNetworkError,
  showLoadError,
  showChannelCreated,
  showChannelRenamed,
  showChannelRemoved,
} from '../../utils/toasts'

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/channels')
      return data
    }
    catch (error) {
      if (!error.response) {
        showNetworkError()
      }
      else {
        showLoadError()
      }
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки каналов')
    }
  },
)

export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (channelData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/channels', channelData)
      showChannelCreated(channelData.name)
      return data
    }
    catch (error) {
      if (!error.response) {
        showNetworkError()
      }
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания канала')
    }
  },
)

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const channelId = typeof id === 'string' ? parseInt(id, 10) : id
      const { data } = await api.patch(`/channels/${channelId}`, { name })
      showChannelRenamed(name)
      return { id: channelId, name: data.name || name }
    }
    catch (error) {
      if (!error.response) {
        showNetworkError()
      }
      return rejectWithValue(error.response?.data?.message || 'Ошибка переименования канала')
    }
  },
)

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (id, { rejectWithValue, getState }) => {
    try {
      const channelId = typeof id === 'string' ? parseInt(id, 10) : id
      await api.delete(`/channels/${channelId}`)
      const state = getState()
      const channel = state.channels.channels.find(ch => ch.id === id)
      if (channel) {
        showChannelRemoved(channel.name)
      }
      return id
    }
    catch (error) {
      if (!error.response) {
        showNetworkError()
      }
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления канала')
    }
  },
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
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(createChannel.pending, (state) => {
        state.error = null
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload)
        state.currentChannelId = action.payload.id
        state.error = null
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(renameChannel.pending, (state) => {
        state.error = null
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const { id, name } = action.payload
        const channel = state.channels.find(ch => String(ch.id) === String(id))
        if (channel) {
          channel.name = name
        }
        state.error = null
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(removeChannel.pending, (state) => {
        state.error = null
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        const id = action.payload
        state.channels = state.channels.filter(ch => String(ch.id) !== String(id))
        if (String(state.currentChannelId) === String(id) && state.channels.length > 0) {
          state.currentChannelId = state.channels[0].id
        }
        state.error = null
      })
      .addCase(removeChannel.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { setCurrentChannel } = channelsSlice.actions
export default channelsSlice.reducer
