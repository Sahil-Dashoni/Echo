import { createSlice } from '@reduxjs/toolkit'
import { Socket } from 'socket.io-client';


const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: null,
        otherUsers: null,
        selectedUserSlice: null,
        socket: null,
        onlineUsers: [],
        searchData:null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setOtherUsers: (state, action) => {
            state.otherUsers = action.payload;
        },
        setSelectedUserSlice: (state, action) => {
            state.selectedUserSlice = action.payload;
        },
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setOnlienUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setSearchData: (state, action) => {
            state.searchData = action.payload;
        }

    }
})

export const { setUserData, setOtherUsers, setSelectedUserSlice, setSocket, setOnlienUsers, setSearchData} = userSlice.actions;
export default userSlice.reducer;
