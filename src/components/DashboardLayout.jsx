
import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

// This layout shows the Navbar and the main content area for protected pages
const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <Navbar />
      <main className="p-6 ml-30">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout