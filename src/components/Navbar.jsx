import React, { useState } from 'react'
import { Menu, X, House, BookmarkCheck, Clock, User, LogOut, Newspaper } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

const items = [
  { key: 'home', title: 'Home', icon: <House size={18} />, to: '/home' },
  { key: 'news', title: 'News', icon: <Newspaper size={18} />, to: '/home/news' },
  { key: 'bookmarks', title: 'Bookmarks', icon: <BookmarkCheck size={18} />, to: '/home/bookmarks' },
  { key: 'history', title: 'History', icon: <Clock size={18} />, to: '/home/history' },
  { key: 'profile', title: 'Profile', icon: <User size={18} />, to: '/home/profile' }
]

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const userData = JSON.parse(localStorage.getItem("user")) || { name: "Guest" }

  const logout = () => {
    localStorage.removeItem('user')
    // optional: clear other app state here
    navigate('/', { replace: true })
  }

  return (
    <div className="flex gap-6 fixed p-6 z-50">
      <aside
        aria-label="Sidebar"
        className={`flex flex-col rounded-2xl bg-gradient-to-b from-gray-900/90 to-gray-900/70 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
          } shadow-lg p-4 backdrop-blur-md border border-white/10`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${collapsed ? 'bg-aqua/10' : 'bg-aqua/20'}`}>
            <svg className="w-6 h-6 text-aqua" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12h18M12 3v18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {!collapsed && (
            <div>
              <div className="text-lg font-semibold">InsightStream</div>
              <div className="text-xs text-gray-400">Personalized news</div>
            </div>
          )}
        </div>

        <nav className="flex-1">
          <ul className="flex flex-col gap-2">
            {items.map((it) => (
              <li key={it.key}>
                <NavLink to={it.to} end={it.key === 'home'} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 ${isActive ? 'bg-aqua/10 text-aqua shadow-[0_0_10px_rgba(0,255,255,0.2)]' : 'text-gray-200 hover:bg-white/5'}`}>
                  <span className={`w-10 h-10 flex items-center justify-center rounded-md`}>{it.icon}</span>
                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{it.title}</span>
                        <span className="text-xs text-gray-400">›</span>
                      </div>
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-4 flex items-center gap-3">
          {!collapsed && (
            <div className="text-xs text-gray-300">
              <div className="font-semibold">Welcome</div>
              <div className="text-gray-400">{userData.name}</div>
            </div>
          )}

          <div className="ml-auto flex relative items-center gap-2">
            <button onClick={() => setCollapsed((s) => !s)} className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
              {collapsed ? <Menu size={16} /> : <X size={16} />}
            </button>

            <button onClick={logout} className="px-3 py-2 absolute -top-15 -right-1 rounded bg-aqua text-black text-sm font-bold hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-shadow">
              {collapsed ? <LogOut size={16} /> : "Logout"}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        {/* placeholder for content area (the DashboardLayout's Outlet will render inside App routes) */}
      </div>
    </div>
  )
}

export default Navbar