import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

const API = 'http://localhost:3000/users'

const Login = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const emailToMatch = (data.email || '').trim().toLowerCase()
      const resp = await axios.get(`${API}?email=${encodeURIComponent(emailToMatch)}`)
      const users = resp.data || []
      const foundUser = users.find((u) => (u.email || '').toLowerCase() === emailToMatch && u.password === data.password)

      if (foundUser) {
        localStorage.setItem('user', JSON.stringify({ id: foundUser.id, name: foundUser.name, email: foundUser.email }))
        navigate('/home', { replace: true })
      } else {
        alert('Invalid email or password')
      }
    } catch (err) {
      console.error('Login error', err)
      alert('Could not reach login API (http://localhost:3000). Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full text-aqua">
      <form onSubmit={handleLogin} className="bg-gray-900 p-6 rounded-md shadow-md shadow-gray-950 border-aqua">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <label className="block text-sm mb-1">Email</label>
        <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} required className="w-full mb-4 bg-transparent outline-none border-b border-b-white/10 py-2" />

        <label className="block text-sm mb-1">Password</label>
        <div className="relative mb-4">
          <input type={showPass ? 'text' : 'password'} value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} required className="w-full bg-transparent outline-none border-b border-b-white/10 py-2 pr-10" />
          <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-0 top-1/2 -translate-y-1/2 p-2" aria-label={showPass ? 'Hide password' : 'Show password'}>
            {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button type="submit" disabled={loading} className="log-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login