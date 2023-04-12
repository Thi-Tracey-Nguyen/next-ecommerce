'use client'

import { useThemeStore } from '@/store'
import { ReactNode, useEffect, useState } from 'react'

export default function Hydrate({children}: {children: ReactNode}) {

  const [isHydrated, setIsHydrated] = useState(false)
  const themeStore = useThemeStore()

  // wait until Nextjs rehydrated complete
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return (
    <>
      {isHydrated ? 
        <body 
          className='px-4 md:px-40 font-roboto' 
          data-theme={ themeStore.mode }
        > 
          {children}
        </body> 
        : <body></body>}
    </>
  )
}
