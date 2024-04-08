import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ThemeToggler } from './ThemeToggler'
import { Button } from "@/components/ui/button"

function Header() {
  return (
    <header className='w-full z-20 top-0 flex items-center justify-between p-5 from-gray-200/0 via-gray-900/25 to-gray-900'>
        <Link href="/" className='mr-18'>
          Rihal Competition
        </Link>
        <div className='flex space-x-2'>
            <ThemeToggler />
        </div>
    </header>
  )
}

export default Header