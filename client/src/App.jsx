import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Accommodations from './pages/Accommodations'
import Detail from './pages/Detail'
import Booking from './pages/Booking'
import Payment from './pages/Payment'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

export default function App(){
  return (
    <div>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/accommodations' element={<Accommodations/>} />
          <Route path='/accommodations/:id' element={<Detail/>} />
          <Route path='/book' element={<Booking/>} />
          <Route path='/book/:id' element={<Booking/>} />
          <Route path='/payment/:id' element={<Payment/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
