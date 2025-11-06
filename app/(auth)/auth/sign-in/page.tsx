import SignInFormClient from '@/modules/auth/components/sign-in-form'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <>
    <div className='bg-white w-full min-h-screen flex flex-col justify-center items-center'>

    
    <Image src={"/logo.png"} alt='Login-Image' height={300}  width={300} className='m-6 object-cover'/>
    <SignInFormClient/>
    </div>
    </>
  )
}

export default page