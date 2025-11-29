import React, { useState } from 'react'
import Login from '../pages/Login'
import Signin from '../pages/Signin'
import sidebg from '../assets/sidebg.jpg'

const LoginToggle = () => {
  const [stat, setStat] = useState('login')

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl overflow-hidden bg-gray-900 border border-aqua/20 shadow-lg">
        <div className="md:col-span-2 p-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-aqua">InsightStream</h1>
            <p className="text-gray-400 mt-2">Login to access your personalized landscape news stream</p>
          </div>

          <div className="flex gap-2 rounded-md p-1.5 mb-6 bg-transparent shadow-sm shadow-aqua">
            <button
              onClick={() => setStat('login')}
              className={`flex-1 p-2 rounded ${stat === 'login' ? 'bg-aqua/10 text-aqua' : 'text-gray-300'}`}
              aria-pressed={stat === 'login'}
            >
              Login
            </button>

            <button
              onClick={() => setStat('register')}
              className={`flex-1 p-2 rounded ${stat === 'register' ? 'bg-aqua/10 text-aqua' : 'text-gray-300'}`}
              aria-pressed={stat === 'register'}
            >
              Register
            </button>
          </div>

          <div>{stat === 'login' ? <Login /> : <Signin />}</div>
        </div>

        <div
          className="hidden md:flex flex-col items-center justify-center p-6 bg-cover bg-center text-center"
          style={{ backgroundImage: `url(${sidebg})`, minHeight: 320 }}
          role="img"
          aria-label="decorative background"
        >
          <h2 className="text-2xl font-semibold text-white/90">Welcome</h2>
          <p className="mt-3 text-sm text-white/80">Your Personalized Landscape NewsStream</p>
        </div>
      </div>
    </div>
  )
}

export default LoginToggle