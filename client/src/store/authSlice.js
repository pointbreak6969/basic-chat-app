import {createSlice} from '@reduxjs/toolkit';
const initialState = {
    status : false,
    userData : null,
    onlineUsers : [],
}
const authSlice = createSlice({
    name: "auth",
    initialState, 
    reducers: {
        login: (state, action)=>{
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state)=>{
            state.status = false;
            state.userData = null;
        }, 
        setOnlineUsers: (state, action)=>{
            state.onlineUsers = action.payload;
        },  
    }
})
export const {login, logout, setOnlineUsers} = authSlice.actions;
export default authSlice.reducer;