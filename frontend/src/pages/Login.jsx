import React, { useState } from 'react'
import assets from '../assets/assets'
import { serverUrl } from '../main'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'


function Login() {

  const [currState, setCurrState] = useState('Sign Up')
  const [userName, setuserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();


  const switchAuthState = (newState) => {
    setError(''); // Clear errors when switching forms
    setuserName('');
    setEmail('');
    setPassword('');
    setCurrState(newState);
  };


  // const onSubmitHandler = (e) => {
  //   e.preventDefault()
  //   if(currState === 'Sign Up' && !isDataSubmitted) {
  //     setIsDataSubmitted(true)
  //     return;
  //   }
  // }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`, {
        userName,
        email,
        password
      },{withCredentials: true})
      dispatch(setUserData(result.data))
      switchAuthState('Login');
    }
    catch(err){
      console.log("Error signing up", err)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("An unexpected error occurred during sign up.");
      }
      
    }
    finally {
        setLoading(false); // Stop loading
      }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/login`, {
        email,
        password
      },{withCredentials: true})
      dispatch(setUserData(result.data))
    }
    catch(err){
      console.log("Error logging in", err)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred during login.");
      }
    }
    finally {
      setLoading(false);
    }
  }


  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='min-h-screen flex justify-center items-center bg-cover bg-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl '>
      {/* left */}
      <img src="/image.png" alt="" className='w-[min(30vw,3000px)] ' />
      {/* right */}
      <form
        action=""
        onSubmit={currState === 'Sign Up' ? handleSignUp : handleLogin}
        className='border-2 bg-white/8 text-white border-gray-500 p-6 rounded-lg flex flex-col gap-6 shadow-lg shadow-[#0a0a0a]'
      >
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && 
            <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />
          }
        </h2>
        {currState === 'Sign Up' && !isDataSubmitted && (
          <input onChange={(e) => setuserName(e.target.value)} value={userName} type="text" className='border border-gray-500 p-2 rounded-md bg-transparent focus:outline-none shadow-lg shadow-[#0a0a0a]' placeholder='Full Name' required />
        )}

        {!isDataSubmitted && (
          <>
            <input onChange={(e) => setEmail(e.target.value)} value={email}
              type="email" className='border border-gray-500 p-2 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-[#0a0a0a]' placeholder='Email' required />
            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                className='border border-gray-500 p-2 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-[#0a0a0a] w-full pr-16'
                placeholder='Password'
                required
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-xs bg-transparent text-white px-2 py-1 rounded cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </>
        )}

        {
          currState === 'Sign Up' && isDataSubmitted && (
            <textarea rows={4} onChange={(e) => setBio(e.target.value)} value={bio}
              className='border border-gray-500 p-2 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-[#0a0a0a]' placeholder='Bio' required></textarea>
          )
        }
        {error && <p className='text-red-500 text-sm bg-red-100/10 p-2 rounded-md'>{error}</p>}
        <button 
          type='submit' 
          className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer flex items-center justify-center disabled:opacity-70'
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            currState === 'Sign Up' ? 'Create Account' : 'Login'
          )}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to terms and conditions</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === 'Sign Up' ? (
            <p className='text-gray-400'>Already have an account? <span className='text-violet-600 cursor-pointer' onClick={() => setCurrState('Login')}>Login</span></p>
          ) : (
            <p className='text-gray-400'>Don't have an account? <span className='text-violet-600 cursor-pointer' onClick={() => setCurrState('Sign Up')}>Sign Up</span></p>
          )}
        </div>

      </form>

    </div>
  )
}

export default Login