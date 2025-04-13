import React from 'react'
import { Route,Routes } from 'react-router'
import ProtectedAuthRoutes from './components/ProtectedRoute/ProtectedAuthRoute'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import LoginPage from './pages/Auth/Login'

import Home from './pages/Home/Home'
import Sales from './pages/Home/Sales'
import Customers from './pages/Home/Customers'
import Report from './pages/Home/Report'
import Stock from './pages/Home/Stock'
const App = () => {
  return (
    <>
      <Routes>
          <Route path='/' element={<ProtectedAuthRoutes element={<LoginPage/>}/>}/>
          <Route path='/inventory' element={<ProtectedRoute element={<Home/>}/>}/>
          <Route path='/sales' element={<ProtectedRoute element={<Sales/>}/>}/>
          <Route path='/report' element={<ProtectedRoute element={<Report/>}/>}/>
          <Route path='/customers' element={<ProtectedRoute element={<Customers/>}/>}/>
          <Route path='/stocks' element={<ProtectedRoute element={<Stock/>}/>}/>
      </Routes>
    </>
  )
}

export default App