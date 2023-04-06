'use client'

import { ReactNode, useEffect, useState } from 'react'

export default function Hydrate({children}: {children: ReactNode}) {

  const [isHydrated, setIsHydrated] = useState(false)

  // wait until Nextjs rehydrated complete
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return (
    <>
      {isHydrated ? <>{children}</> : <div>Loading...</div>}
    </>
  )
}