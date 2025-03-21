/**
 * LoginPage Component
 *
 * A responsive login/signup page with an animated sliding cover effect.
 * The page is split into two sections - login and signup forms, with a sliding
 * cover that transitions between them.
 *
 * Features:
 * - Split screen layout with login and signup forms
 * - Responsive design that adapts to different screen sizes
 * - Animated sliding cover effect when switching between forms
 * - Consistent branding with CAL logo on both sides
 * - Mobile-friendly layout adjustments
 *
 * Layout Structure:
 * - Two column grid layout on large screens
 * - Each column contains:
 *   - Header with CAL logo
 *   - Centered form container
 *   - Login form on left side
 *   - Signup form on right side
 * - Sliding cover overlay that moves between sections
 *
 * State:
 * - coverLeft: Boolean to control the position of sliding cover
 */

import React, { useState } from 'react'
import { GalleryVerticalEnd } from 'lucide-react'
import { LoginForm } from '@/components/login-form'
import { SignUpForm } from '@/components/signup-form'

const LoginPage: React.FC = () => {
  const [coverLeft, setCoverLeft] = useState(false) // State to determine which side to cover

  const toggleCover = () => {
    setCoverLeft(!coverLeft) // Toggle between covering left and right
    console.log('Toggle coverleft', coverLeft)
  }

  return (
    <div>
      <>
        <div className='grid min-h-svh lg:grid-cols-2'>
          <div className='flex flex-col gap-4 p-6 md:p-10'>
            <div className='flex justify-center gap-2 md:justify-start'>
              <button className='flex items-center gap-2 font-medium'>
                <div className='flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
                  <GalleryVerticalEnd className='size-4' />
                </div>
                CAL
              </button>
            </div>
            <div className='flex flex-1 items-center justify-center'>
              <div className='w-full max-w-xs'>
                <LoginForm toggleCover={toggleCover} />
              </div>
            </div>
          </div>
          {/* <div className='flex flex-col gap-4 p-6 md:p-10'>
            <div className='flex justify-center gap-2 md:justify-start'>
              <button className='flex items-center gap-2 font-medium'>
                <div className='flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
                  <GalleryVerticalEnd className='size-4' />
                </div>
                CAL
              </button>
            </div>
            <div className='flex flex-1 items-center justify-center'>
              <div className='w-full max-w-xs'>
                <SignUpForm toggleCover={toggleCover} />
              </div>
            </div>
          </div> */}
          <div className='flex flex-col justify-between py-10 items-center border-2'>
            <div className='flex flex-col gap-4 p-6 md:p-10'>
              <div className='flex justify-center z-20 mt-40'>
                <img
                  src='https://mmc.ugc.ac.in/newtheme/img/ugc_logo.png'
                  alt='UGC Logo'
                  className='h-16 w-auto object-contain'
                />
              </div>
              <div className='flex justify-center z-10 -mt-20'>
                <img
                  src='https://annam.ai/wp-content/uploads/2025/01/4-1-768x768.png'
                  alt='Annam Logo'
                  className='h-80 w-auto object-contain'
                />
              </div>
              <div className='flex justify-center -mt-60 z-0 -mb-20'>
                <img
                  src='https://dled-lab.github.io/logo.png'
                  alt='UGC Logo'
                  className='h-80 w-auto object-contain'
                />
              </div>
            </div>
          </div>
        </div>
      </>
      <div className='absolute bottom-0 w-full text-center bg-white py-2 mb-6'>
        <h1 className='text-lg font-semibold'>Powered by Dhananjaya lab for education design</h1>
      </div>
    </div>
  )
}

export default LoginPage
