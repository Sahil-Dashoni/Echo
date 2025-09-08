import React, {useState} from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSiderbar from '../components/RightSiderbar'
import { useSelector } from 'react-redux';
import useMessages from '../customHooks/getMessages';

function HomePage() {
    const [selectedUser, setSelectedUser] = useState(false)
    const {selectedUserSlice} = useSelector(state => state.user);
    useMessages();

  return (
    <div className='w-full h-screen sm:px-[15%] sm:py-[5%] '>
        <div className={`backdrop-blur-md border-2  border-gray-600 shadow-lg shadow-[#0a0a0a] rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUserSlice ? 'md:grid-cols-[1fr_1.5fr] lg:grid-cols-[1fr_1.5fr_1fr]' // tablet = 2 cols, desktop = 3 cols
      : 'md:grid-cols-2 lg:grid-cols-2' }`}>
            <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
            <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
            <RightSiderbar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
        </div>
    </div>
  )
}

export default HomePage