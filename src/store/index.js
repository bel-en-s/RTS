import { configureStore } from '@reduxjs/toolkit'
import colorPointsReducer from './colorPointsSlice'

export const store = configureStore({
  reducer: {
    colorPoints: colorPointsReducer,
  },
})
