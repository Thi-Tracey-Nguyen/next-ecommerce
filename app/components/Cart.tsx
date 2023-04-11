'use client'

import Image from "next/image"
import { useCartStore } from '@/store'
import formatPrice from "@/util/PriceFormat"
import {IoAddCircle, IoRemoveCircle} from 'react-icons/io5'
import shoppingBag from '@/public/shopping-bag.png'
import { AnimatePresence, motion } from 'framer-motion'
import Checkout from "./Checkout"
import OrderConfirmed from "./OrderConfirmed"

export default function Cart() {
  const cartStore = useCartStore()

  //total proce
  const totalPrice = cartStore.cart.reduce((total, item) => {
    return total + item.unit_amount! * item.quantity!
  }, 0)

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => cartStore.toggleCart()} 
      className='fixed w-full h-screen left-0 top-0 bg-black/25'
    >
      {/* Cart */}
      <motion.div
        layout 
        className='bg-white absolute right-0 top-0 w-full h-screen p-12 overflow-scroll lg:w-2/6'
        onClick={(e) => e.stopPropagation()}
      >
        {cartStore.onCheckout === 'cart' && (
          <button 
            onClick={() => cartStore.toggleCart()}
            className='text-sm font-bold pb-12'
          >
            Back to store 🏃‍♂️
          </button>
        )}
        {cartStore.onCheckout === 'checkout' && (
          <button 
            onClick={() => cartStore.setCheckout('cart')}
            className='text-sm font-bold pb-12'
          >
            Check your cart  🛒
          </button>
        )}
        {/* Cart Items */}
        { cartStore.onCheckout === 'cart' && (
          <>
            {cartStore.cart.map(item => (
              <motion.div 
                layout
                key={item.id}
                className='flex py-4 gap-4'
              >
                <Image 
                  className='rounded-md h-24 w-24 object-cover'
                  src={item.image} 
                  alt={item.name} 
                  width={120} 
                  height={120} 
                />
                <motion.div layout className='text-sm h-24 w-36'>
                  <h2>{item.name}</h2>
                  {/* display quantity and buttons to update quantity */}
                  <div className='flex gap-2'>
                    <h2>Quantity: {item.quantity}</h2>
                    <button
                      onClick={() => 
                        cartStore.removeProduct({
                          id: item.id, 
                          image: item.image, 
                          name: item.name,
                          unit_amount: item.unit_amount, 
                          quantity: item.quantity, 
                        })}
                    >
                      <IoRemoveCircle />
                    </button>
                    <button 
                      onClick={() => 
                        cartStore.addProduct({
                          id: item.id, 
                          image: item.image, 
                          name: item.name,
                          unit_amount: item.unit_amount, 
                          quantity: item.quantity, 
                        })}
                    >
                      <IoAddCircle />
                    </button>
                  </div>
                  <p>
                    {item.unit_amount && formatPrice(item.unit_amount)}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </>
        )}
        {/* check out and total */}
        {cartStore.cart.length > 0 && cartStore.onCheckout === 'cart' ? ( 
          <motion.div layout>   
            <p>Total: {formatPrice(totalPrice)}</p>
            <button 
              onClick={() => cartStore.setCheckout('checkout')}
              className='py-2 mt-4 bg-primary w-full rounded-md text-white'
            >
              Checkout
            </button>
          </motion.div>
        ): null}
        {/* Checkout form */}
        {cartStore.onCheckout === 'checkout' && <Checkout />}
        {cartStore.onCheckout === 'success' && <OrderConfirmed />}
        <AnimatePresence>
          {!cartStore.cart.length && cartStore.onCheckout === 'cart' && (
            <motion.div 
              animate={{scale: 1, rotateZ: 0, opacity: 0.75}} 
              initial={{scale: 0.5, rotateZ: -10, opacity: 0}}
              exit={{scale: 0.5, rotateZ: -10, opacity: 0}}
              className='flex flex-col items-center gap-6 text-xl font-medium pt-28 opacity-75'>
              <h1>Uh ohh... It is empty 🥲</h1>
              <Image src={shoppingBag} alt='empty cart' width={200} height={200} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div> 
    </motion.div>
  )
} 