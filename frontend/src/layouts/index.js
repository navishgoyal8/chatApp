import React from 'react'
import Logo from '../assets/logo.png'

const AuthLayouts = ({children}) => {
  return (
    <>
      <header className='flex justify-center items-center shadow-md py-3 h-20 bg-white'>
        <img src={Logo} width={180} height={60} alt='logo' />
      </header>

      {children}
    </>
  )
}

export default AuthLayouts
