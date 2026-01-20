import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  points: [
    { color: [0.36, 0.75, 1.0], pos: [0.45, 0.55, 0] }, // cyan
    { color: [0.36, 0.47, 1.0], pos: [0.55, 0.55, 0] }, // blue
    { color: [0.96, 0.22, 1.0], pos: [0.5, 0.45, 0] },  // violet
  ],
  loading: false,
  error: null,
}

// Example async thunk (e.g., fetch points from API)
export const fetchColorPoints = createAsyncThunk(
  'colorPoints/fetch',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      // const response = await fetch('/api/color-points')
      // return await response.json()

      // Simulated async response
      await new Promise(resolve => setTimeout(resolve, 500))
      return [
        { color: [0.36, 0.75, 1.0], pos: [0.45, 0.55, 0] },
        { color: [0.36, 0.47, 1.0], pos: [0.55, 0.55, 0] },
        { color: [0.96, 0.22, 1.0], pos: [0.5, 0.45, 0] },
      ]
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const colorPointsSlice = createSlice({
  name: 'colorPoints',
  initialState,
  reducers: {
    setPoints: (state, action) => {
      state.points = action.payload
    },
    addPoint: (state, action) => {
      state.points.push(action.payload)
    },
    removePoint: (state, action) => {
      state.points.splice(action.payload, 1)
    },
    updatePointPosition: (state, action) => {
      const { index, pos } = action.payload
      if (state.points[index]) {
        state.points[index].pos = pos
      }
    },
    updatePointColor: (state, action) => {
      const { index, color } = action.payload
      if (state.points[index]) {
        state.points[index].color = color
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColorPoints.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchColorPoints.fulfilled, (state, action) => {
        state.loading = false
        state.points = action.payload
      })
      .addCase(fetchColorPoints.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  setPoints,
  addPoint,
  removePoint,
  updatePointPosition,
  updatePointColor,
} = colorPointsSlice.actions

export default colorPointsSlice.reducer
