import React, { useState } from 'react'
import { GalleryVerticalEnd } from 'lucide-react'
import { LoginForm } from '@/components/login-form'
import { SignUpForm } from '@/components/signup-form'

const LoginPage: React.FC = () => {
  const [coverLeft, setCoverLeft] = useState(false)

  const toggleCover = () => {
    setCoverLeft(!coverLeft)
    console.log('Toggle coverLeft', coverLeft)
  }

  return (
    <div className="relative min-h-screen">
      <div className="grid lg:grid-cols-2 grid-cols-1 min-h-screen">
        {/* Left side: Login Section */}
        <div className="flex flex-col justify-center items-center p-6 lg:p-10 bg-white shadow-md">
          <div className="flex justify-center gap-2 md:justify-start mb-6">
            <button className="flex items-center gap-2 font-medium text-primary">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <GalleryVerticalEnd className="h-4 w-4" />
                </div>
                <span className="text-xl font-semibold">CAL</span>
              </div>
            </button>
          </div>
          <div className="w-full max-w-sm">
            <LoginForm toggleCover={toggleCover} />
          </div>
        </div>

        {/* Right side: Visual Elements and Branding */}
        <div className="flex flex-col justify-center items-center p-6 lg:p-10 mt-20">
          <div className="flex flex-col gap-6 items-center">
            <img
              src="https://mmc.ugc.ac.in/newtheme/img/ugc_logo.png"
              alt="UGC Logo"
              className="h-16 w-auto object-contain"
            />
            <img
              src="https://annam.ai/wp-content/uploads/2025/01/4-1-768x768.png"
              alt="Annam Logo"
              className="h-60 -mt-10 w-auto z-10 object-contain"
            />
            <img
              src="https://dled-lab.github.io/logo.png"
              alt="Dhananjaya Lab Logo"
              className="h-60 -mt-40 z-0 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="absolute bottom-0 w-full text-center bg-white py-4 shadow-md">
        <h1 className="text-lg font-semibold text-gray-700">
          Powered by Dhananjaya Lab for Education Design
        </h1>
      </div>
    </div>
  )
}

export default LoginPage
