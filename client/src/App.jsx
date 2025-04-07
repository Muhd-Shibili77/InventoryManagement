import React from 'react'
import { Route,Routes } from 'react-router'
import ProtectedAuthRoutes from './components/ProtectedRoute/ProtectedAuthRoute'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import LoginPage from './pages/Auth/Login'
import RegisterPage from './pages/Auth/Register'
import Home from './pages/Home/Home'
import Sales from './pages/Home/Sales'
import Customers from './pages/Home/Customers'
import Report from './pages/Home/Report'
const App = () => {
  return (
    <>
      <Routes>
          <Route path='/' element={<ProtectedAuthRoutes element={<LoginPage/>}/>}/>
          <Route path='/register' element={<ProtectedAuthRoutes element={<RegisterPage/>}/>}/>


          <Route path='/inventory' element={<ProtectedRoute element={<Home/>}/>}/>
          <Route path='/sales' element={<ProtectedRoute element={<Sales/>}/>}/>
          <Route path='/report' element={<ProtectedRoute element={<Report/>}/>}/>
          <Route path='/customers' element={<ProtectedRoute element={<Customers/>}/>}/>
      </Routes>
    </>
  )
}

export default App