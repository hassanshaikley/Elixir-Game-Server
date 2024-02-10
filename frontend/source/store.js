import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice.js'
import playersReducer from './playerSlice.js'
import localPlayerReducer from './localPlayerSlice.js'
export default configureStore({
    reducer: {
        counter: counterReducer,
        players: playersReducer,
        localPlayer: localPlayerReducer
    },
})