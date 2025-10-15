import React from 'react'
import{Routes,Route} from 'react-router';
import Homepage from './pages/home/homePage';
import HomepageLayout from './layouts/homeLayout';
import LandingPage from './pages/home/landingPage';
import RegisterPage from './pages/auth/registerPage';
import LoginPage from './pages/auth/loginPage';
const App = () => {
  const isAuthenticated = true;
  return (
    <Routes>
      <Route path='/' element={<HomepageLayout/>}>
        <Route index element={isAuthenticated?<Homepage/>:<LandingPage/>}/>
        <Route path='auth' >
          <Route path='register' element={<RegisterPage/>}/>
          <Route path='login' element={<LoginPage/>}/>
        </Route>
      </Route>
      
    </Routes>
  )
}

export default App