'use client'

import {motion} from 'framer-motion'
import Image from 'next/image'
import thankyou from '@/public/thankyou.gif'
import Link from 'next/link'
import { useCartStore } from '@/store'
import { useEffect } from 'react'

export default function OrderConfirmed() {

  const cartStore = useCartStore()

  useEffect(() => {
    cartStore.clearCart()
    cartStore.setPaymentIntent('')
  }, [])

  //handle click on check your order
  const handleCheckOrder = () => {
    //setTimeout to avoid flashing effect on cart
    setTimeout(() => {
      cartStore.setCheckout('cart') 
    }, 1000)
    cartStore.toggleCart()
  }

  return (
    <motion.div
      className='flex items-center justify-center my-12' 
      initial={{ scale: 0.5, opacity:0 }} 
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className='p-10 text-center'>
        <h1 className='text-xl font-medium'>Your order has been placed 🎁</h1>
        <h2 className='text-sm my-4'>Check your email for the receipt.</h2>
        <Image className='py-8' src={thankyou} alt='thank you' />
        <div className='flex items-center justify-center gap-12'>
          <Link href={'/dashboard'}>
            <button 
              className='font-medium'
              onClick={handleCheckOrder}
            >
              Check your Order
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}