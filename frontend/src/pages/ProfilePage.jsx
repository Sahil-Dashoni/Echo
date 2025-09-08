import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import axios from 'axios'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

import { useCallback } from 'react'


function ProfilePage() {

  const { userData } = useSelector((state) => state.user)
  const [selectedImage, setSelectedImage] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState(userData?.user?.name || '')
  const [bio, setBio] = useState(userData?.user?.bio || 'Hey There, I am Using Echo.')
  const [frontendImage, setFrontendImage] = useState(userData?.user?.image || assets.avatar_icon)
  const [backendImage, setBackendImage] = useState(null)
  const setDispatch = useDispatch();
  const [saving, setSaving] = useState(false)


  let image = useRef()

  const handleImage = (e) => {
    image.current.click()
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
    setSelectedImage(file)
  }

  const handleSubmit = async (e) => {
    setSaving(true)
    e.preventDefault()
    try {
      let formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      if (backendImage) {
        formData.append('avatar', backendImage);
      }
      let result = await axios.put(`${serverUrl}/api/user/profile`, formData, {
        withCredentials: true,
      });
      setSaving(false)
      setDispatch(setUserData(result.data));
      if (result.status === 200) {
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      setSaving(false)
    }
  }

  if (!userData) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <p className='text-white text-xl'>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex flex-row max-sm:flex-col rounded-lg shadow-lg shadow-[#0a0a0a]'>
        <div
          onClick={() => {
            if (!saving) navigate(-1)
          }}
          className={`cursor-pointer ${saving ? 'pointer-events-none opacity-50' : ''}`}
        >
          <img src={assets.arrow_icon} alt="" className='max-w-7 bg-[#28262bb8] rounded-md' />
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg font-semibold'>Profile Details</h3>
          <div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder='Your name' className='p-2 border m-3 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-lg shadow-[#0a0a0a]' />
            <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder="Write profile bio" required className="ps-2.5 border m-3 bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-lg shadow-[#0a0a0a]" rows={4} />
          </div>
          <div>
            <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
              <input onChange={(e) => handleImage(e)} type="file" id="avatar" hidden accept='.png, .jpg, .jpeg' ref={image} />
              <img src={selectedImage ? frontendImage : userData.user?.image
                ? userData.user.image: assets.avatar_icon} alt="" className={`w-12 h-12 mx-auto aspect-[1/1] rounded-full ${selectedImage && ' object-cover'}`} />
              Upload Profile Image
            </label>
          </div>
          <button type="submit" className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer" disabled={saving}>{saving ? 'Saving...' : 'Update Profile'}</button>
        </form>
        
        <div className="flex-1 flex items-center justify-center p-5 border-l border-gray-600 max-sm:border-l-0 max-sm:border-t">
          <div className="text-center">
            <img src={selectedImage ? frontendImage : userData.user?.image? userData.user.image
              : assets.avatar_icon} alt="Profile Preview" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
            <div className='w-full break-all'>
              <h2 className="text-2xl font-bold">{name}</h2>
              <p className="mt-2 text-gray-400">{bio}</p>
              <p className="mt-2 text-violet-400 ">{userData.user?.email || 'No email available'}</p>
              <p className="mt-2 text-gray-400">{userData.user?.userName || 'No username available'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage