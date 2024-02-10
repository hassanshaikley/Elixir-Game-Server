import { createSlice } from '@reduxjs/toolkit'

export const localPlayerSlice = createSlice({
    name: 'localPlayer',
    initialState: {
        x: 0,
        z: 0,
        id: "1234",
        name: "Charlie"
    },
    reducers: {
        moveLeft: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // adoesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes.
            // Also, no return statement is required from these functions.
            state.x -= 1
        },

    },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = localPlayerSlice.actions

export default localPlayerSlice.reducer