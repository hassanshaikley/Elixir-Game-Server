import { createSlice } from '@reduxjs/toolkit'

export const playersSlice = createSlice({
    name: 'players',
    initialState: {
        players: [],
    },
    reducers: {
        addPlayer: (state, action) => {
            state.players.push(action.payload)
        }
    },
})

// Action creators are generated for each case reducer function
export const { addPlayer } = playersSlice.actions

export default playersSlice.reducer