'use client'

import Image from "next/image"
import { useCartStore } from '@/store'
import formatPrice from "@/util/PriceFormat"

export default function Cart() {
  const cartStore = useCartStore()
  return (
    <div 
      onClick={() => cartStore.toggleCart()} 
      className='fixed w-full h-screen left-0 top-0 bg-black/25'
    >
      <div 
        className='bg-white absolute right-0 top-0 w-1/4 h-screen p-12 overflow-scroll text-gray-700'
        onClick={(e) => e.stopPropagation()}
      >
        <h1>This is your shopping list 📝</h1>
        {cartStore.cart.map(item => (
          <div className='flex py-4 gap-4'>
            <Image 
              className='rounded-md h-24 w-24 object-cover'
              src={item.image} 
              alt={item.name} 
              width={120} 
              height={120} 
            />
            <div className='text-sm h-24 w-36'>
              <h2>{item.name}</h2>
              <h2>Quantity: {item.quantity}</h2>
              <p>{item.unit_amount && formatPrice(item.unit_amount)}</p>
            </div>
          </div>
        ))}
        <button className='py-2 mt-4 bg-teal-700 w-full rounded-md text-white'>Checkout</button>
      </div>
    </div>
  )
} 