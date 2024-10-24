import React from 'react'
import { Outlet } from 'react-router-dom'

function RegisterLayout() {
  return (
    <>
    <section  className="w-full bg-mainBgColor">
      <Outlet />  
    </section> 
    </>
  )
}

export default RegisterLayout
