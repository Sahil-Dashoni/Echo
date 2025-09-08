import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import useCurrentUser from './customHooks/getCurrentUser.jsx'
import { useDispatch, useSelector } from 'react-redux'
import useOtherUser from './customHooks/getOtherUser.jsx'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { serverUrl } from './main.jsx'
import { setOnlienUsers, setSocket } from './redux/userSlice.js'

function App() {
  useCurrentUser();
  useOtherUser();
  let {userData, socket, onlineUsers} = useSelector(state => state.user);
  let dispatch = useDispatch()

  useEffect(()=>{
    if(userData){
      const socketIo = io(`${serverUrl}`,{
      query:{
        userId: userData?.user._id
      }
    });
    dispatch(setSocket(socketIo))

    socketIo.on('getOnlineUsers',(users)=>{
      dispatch(setOnlienUsers(users))
    })

    return ()=>socketIo.close()
    }
    else{
      if(socket){
        socket.close()
        dispatch(setSocket(null))
      }
    }
    
    
    
  },[userData])
  return (
    <div className="bg-[url('/8041907-Photoroom.png')] bg-no-repeat bg-center bg-cover">
      <Routes>
        <Route path="/" element={userData ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!userData ? <Login /> : <Navigate to="/" />} />
        <Route path="/profile" element={userData ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App