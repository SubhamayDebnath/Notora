import Mockup from '@/components/home/mockup'
import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router'

const LandingPage = () => {
  return (
    <div className='lg:h-[calc(100dvh-6rem)] h-full grid lg:grid-cols-2 gap-10 py-20'>
        <div className='flex-1 flex flex-col justify-center gap-4'>
            <div className='w-fit flex items-center gap-2 py-1 px-3 border rounded-full text-xs text-primary bg-primary/5'>
                <div className='size-2 rounded-full bg-emerald-600'></div>
                <span>Free plan • No credit card required</span>
            </div>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary text-balance'>Your thoughts, beautifully organized.</h1>
            <p className='text-pretty'>Notora is a minimalist note app that helps you capture ideas fast, find them instantly, and stay in flow—with offline support and secure sync.</p>
            <div>
                <Button asChild>
                    <Link to={'/register'}>Get started</Link>
                </Button>
            </div>
        </div>
        <div className='flex-1 flex items-center justify-center'>
            <Mockup/>
        </div>
    </div>
  )
}

export default LandingPage