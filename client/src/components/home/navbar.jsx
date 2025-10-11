import React from 'react'
import { Link } from 'react-router'
import Theme from '../common/theme.jsx'
import UserAccountDropdown from '../common/userAccountDropdown.jsx'
import { Button } from '../ui/button.jsx'

const navbar = () => {
  const isAuthenticated = false;
  return (
    <header className='w-full h-15 flex items-center justify-center'>
      <nav className='lg:max-w-7xl max-w-3xl w-full flex items-center justify-between px-4 md:px=8 lg:px-12'>
        <div>
          <Link to={'/'} className='flex items-center gap-2 text-xl font-bold text-primary text-balance'>
            <div className='size-5 rounded-full bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-500'></div>
            <span>Notora</span>
          </Link>
        </div>
        <div className='flex items-center md:gap-5 gap-3'>
          {
            !isAuthenticated && (
              <>
                <Button asChild variant={'outline'} size={'sm'}>
                  <Link to={'/auth/register'}>Register</Link>
                </Button>
                <Button asChild size={'sm'}>
                  <Link to={'/auth/login'}>Login</Link>
                </Button>
              </>
            )
          }
          {
            isAuthenticated && (
              <>
              <UserAccountDropdown />
              </>
            )
          }
          <Theme />
        </div>
      </nav>
    </header>
  )
}

export default navbar