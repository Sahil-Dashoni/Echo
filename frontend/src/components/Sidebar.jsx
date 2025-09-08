import React from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { setOtherUsers, setUserData, setSelectedUserSlice, setSearchData } from '../redux/userSlice';
import { serverUrl } from '../main';
import useOtherUser from '../customHooks/getOtherUser';

function Sidebar({ selectedUser, setSelectedUser }) {
  const navigate = useNavigate();
  const { selectedUserSlice } = useSelector(state => state.user);
  const { userData, otherUsers, onlineUsers, searchData } = useSelector(state => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const [input, setInput] = useState("")

  const handleLogout = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      dispatch(setUserData(null))
      dispatch(setOtherUsers(null))
      dispatch(setSelectedUserSlice(null));
      navigate('/login')
    } catch (error) {
      console.log("Error logging out:", error);
    }
  }

  useEffect(() => {
    if (input === "") {
      dispatch(setSearchData([])); // Clear search data when input is empty
      return;
    }

    const handleSearch = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/search?query=${input}`, { withCredentials: true });
        dispatch(setSearchData(result.data));
      } catch (error) {
        console.log("Error searching for user:", error);
      }
    };

    // Wait for 300ms after the user stops typing before making the API call
    const timerId = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [input, dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      const menu = document.getElementById('sidebar-menu-dropdown');
      const menuButton = document.getElementById('sidebar-menu-button');
      if (menuOpen && menu && !menu.contains(event.target) && !menuButton.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);


 
  const usersToDisplay = input.length > 0 
    ? searchData.filter(user => user._id !== userData.user._id) 
    : otherUsers;

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUserSlice ? 'max-[767px]:hidden' : ''}`}>
      <div className='pb-5'>
        <div className='flex items-center justify-between'>
          <img src="/8041907-removebg.png" alt="logo" className='w-25 h-20 ' />
          <div className='relative py-2'>
            <img
              src={assets.menu_icon}
              alt="Menu"
              className='max-h-5 cursor-pointer'
              onClick={() => setMenuOpen((prev) => !prev)}
            />
            {menuOpen && (
              <div
                id="sidebar-menu-dropdown"
                className='absolute right-0 top-full z-20 w-32 p-5 bg-[#2821427c] shadow-lg shadow-[#0a0a0a] border border-gray-600 text-gray-100'
              >
                <p onClick={() => { setMenuOpen(false); navigate('/profile'); }} className='cursor-pointer text-sm'>Edit Profile</p>
                <hr className='border-t border-gray-500 my-2' />
                <p onClick={handleLogout} className='cursor-pointer text-sm'>Logout</p>
              </div>
            )}
          </div>
        </div>
        <div className='bg-[#2821427c]  rounded-full flex items-center gap-2 px-4 mt-5 py-3'>
          <img src={assets.search_icon} alt="Search" className='w-3' />
          <input type="text" className='bg-transparent border-none text-white text-xs placeholder:[#c8c8c8] outline-none flex-1' placeholder='Search User..' onChange={(e) => setInput(e.target.value)} value={input} />
        </div>
      </div>
      <div className='flex flex-col '>
        {usersToDisplay && usersToDisplay.length > 0 ? (
          usersToDisplay.map((user) => (
            <div
              onClick={() => dispatch(setSelectedUserSlice(user))}
              key={user._id} // 3. Use a stable and unique key
              // 4. Correctly apply conditional class
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-[#282142]/50 ${selectedUserSlice?._id === user._id ? 'bg-[#282142]/90' : ''}`}
            >
              <div className="relative">
                <img src={user?.image || user?.profilePic || assets.avatar_icon} alt={user.name} className='w-12 h-12 rounded-full object-cover' />
                {onlineUsers?.includes(user._id) &&
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></span>
                }
              </div>
              <div className='flex flex-col leading-5'>
                <p className='text-sm font-medium'>{user.name || user.fullName}</p>
                <p className='text-xs text-gray-300'>{user.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-sm mt-6">
            {input ? "No users found." : "No other users."}
          </p>
        )}


      </div>
    </div>
  )
}

export default Sidebar