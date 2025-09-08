import React, { use, useEffect, useRef } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedUserSlice } from '../redux/userSlice';
import { BsEmojiSmile } from "react-icons/bs";
import { FaImages } from "react-icons/fa";
import EmojiPicker from 'emoji-picker-react';
import { serverUrl } from '../main';
import axios from 'axios';
import { setMessages, addMessage } from '../redux/messageSlice';


function ChatContainer() {

  const scrollEnd = useRef()
  const { selectedUserSlice, userData, socket, onlineUsers } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const image = useRef();
  const { messages } = useSelector(state => state.message);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFrontendImage(URL.createObjectURL(file));
    setBackendImage(file);
  };

  const handleSendMessage = async () => {
    if(inputValue.length==0 && !backendImage) return null
    try {
      const formData = new FormData();
      formData.append('message', inputValue);
      if (backendImage) {
        formData.append('avatar', backendImage);
      }
      const result = await axios.post(`${serverUrl}/api/message/send/${selectedUserSlice._id}`, formData, { withCredentials: true });
      dispatch(setMessages([...messages, result.data]));
      setInputValue("");
      setFrontendImage(null);
      setBackendImage(null);

    } catch (error) {
      console.log("Error while sending message", error);
    }
  }


  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    if (!selectedUserSlice?._id) {
      // clear when no user selected
      dispatch(setMessages([]));
      return;
    }
    // 🟣 Clear messages immediately before fetching
    dispatch(setMessages([]));

    const fetchMessages = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/message/get/${selectedUserSlice._id}`,
          { withCredentials: true }
        );
        dispatch(setMessages(result.data));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUserSlice, dispatch]);

  useEffect(() => {
    if (socket) {
        const handleNewMessage = (newMessage) => {
            // ✅ Dispatch the new action with the message payload
            dispatch(addMessage(newMessage));
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }
}, [messages, setMessages]);


  const handleImageScroll = ()=>{
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return selectedUserSlice ? (
    <div className={`h-full overflow-scroll relative backdrop-blur-lg ${!selectedUserSlice ? 'max-[767px]:hidden' : ''}`}>
      {/* Header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500 '>
        <img onClick={() => dispatch(setSelectedUserSlice(null))} src={assets.arrow_icon} alt="" className=' max-w-7' />
        <img src={selectedUserSlice?.image || assets.avatar_icon} alt="avatar" className='w-8 rounded-full ' />
        <p className='flex items-center gap-2 flex-1 text-lg text-white'>
          {selectedUserSlice?.name }
          {onlineUsers?.includes(selectedUserSlice._id)&&
          <span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>
      {/* Chat */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">

        {messages.map((msg, index) =>
          msg.sender == userData.user._id ? (   // ✅ sender not senderId
            // === Sender Message (Right) ===
            <div key={index} className="flex justify-end mb-6">
              <div className="flex items-end gap-2 max-w-[65%]">
                <div className="flex flex-col items-end">
                  <div className="flex flex-col items-end">
                    {/* Show text if available */}
                    {msg.message && (
                      <p className="p-2 max-w-[285px] md:text-sm rounded-lg rounded-br-none bg-gradient-to-r from-violet-500/80 to-fuchsia-600/80 text-white text-sm">
                        {msg.message}
                      </p>
                    )}

                    {/* Show image if available */}
                    {msg.image && (
                      <img
                      onLoad={handleImageScroll}
                        src={msg.image}
                        alt="sent"
                        className="w-full h-auto object-cover rounded-lg rounded-br-none border border-gray-700 mt-1"
                      />
                    )}

                    {/* ✅ Timestamp only once, after both */}
                    {(msg.message || msg.image) && (
                      <p className="text-[11px] text-gray-300 mt-1">
                        {formatMessageTime(msg.createdAt)}
                      </p>
                    )}
                  </div>

                </div>
                <img
                  src={userData.user.image || assets.avatar_icon}
                  alt="You"
                  className="w-7 h-7 rounded-full"
                />
              </div>
            </div>
          ) : (
            // === Receiver Message (Left) ===
            <div key={index} className="flex justify-start mb-6">
              <div className="flex items-end gap-2 max-w-[65%]">
                <img
                  src={selectedUserSlice?.image  || assets.avatar_icon}
                  alt="Other"
                  className="w-7 h-7 rounded-full"
                />
                <div className="flex flex-col items-start">
                  <div className="flex flex-col items-start">
                    {msg.message && (
                      <p className="p-2 max-w-[285px] md:text-sm rounded-lg rounded-bl-none bg-gradient-to-r from-[#0bfae6]/40 to-[#009dff]/40 text-white text-sm">
                        {msg.message}
                      </p>
                    )}

                    {msg.image && (
                      <img
                      onLoad={handleImageScroll}
                        src={msg.image}
                        alt="received"
                        className="w-full h-auto object-cover rounded-lg rounded-bl-none border border-gray-700 mt-1"
                      />
                    )}

                    {(msg.message || msg.image) && (
                      <p className="text-[11px] text-gray-300 mt-1">
                        {formatMessageTime(msg.createdAt)}
                      </p>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )
        )}

        <div ref={scrollEnd}></div>
        <div className={!frontendImage ? `hidden` : `max-w-[250px] flex items-center justify-center p-2 bg-slate-600 mx-auto absolute`}>
          <img src={frontendImage} alt="" className='max-w-[230px] rounded-lg rounded-br-none  border-gray-700 ' />
        </div>

      </div>


      {/* Bottom Area */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-[#8185B2]/10 px-3 rounded-full'>
          <input onChange={(e) => setInputValue(e.target.value)} value={inputValue}
            type="text"
            placeholder="Type a message"
            className="flex-1 bg-transparent p-3 text-sm border-none outline-none text-white placeholder-gray-400"
          />
          <div onClick={() => setShowPicker((prev) => !prev)} className='relative'>
            <BsEmojiSmile className='text-[#e2e2e2d7] h-5 w-5 mr-2 cursor-pointer' />
          </div>
          {showPicker && (
            <div
              className="absolute bottom-12 right-0 z-50 max-w-[90vw] max-h-[60vh] w-[280px] sm:w-[320px] overflow-auto bg-[#1e1e2f] rounded-xl shadow-lg"
            >
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setInputValue((prev) => prev + emoji.emoji);
                  setShowPicker(false);
                }}
                width="100%"
                height="100%"
              />
            </div>
          )}

          <input type="file" ref={image} onChange={handleImageChange} accept='image/*' hidden />
          <div onClick={() => image.current.click()}>
            <FaImages className='text-[#c0bfc0d7] h-5 w-5 mr-2 cursor-pointer' />
          </div>

        </div>
        <img src={assets.send_button} onClick={handleSendMessage} alt="Send" className='w-7 cursor-pointer' />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="No chat selected" className='max-w-16' />
      <h1 className=' font-bold text-[26px] text-[#ffffff]'>Welcome to ECHO</h1>
      <p className='text-lg font-medium text-[#b3aeae]'>Chat anytime anywhere</p>
    </div>
  )
}

export default ChatContainer