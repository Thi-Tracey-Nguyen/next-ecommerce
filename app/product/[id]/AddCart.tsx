'use client'

import { useCartStore } from '@/store'
import { AddCartType } from '@/types/AddCartType'
import { useState } from 'react'

export default function AddCart({
  id, 
  name, 
  unit_amount, 
  quantity, 
  image
}: AddCartType) {

  const cartStore = useCartStore()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    cartStore.addProduct({ id, image, unit_amount, quantity, name })
    setAdded(true)

    //couples with disabled attribute to avoid spamming the add to cart button
    setTimeout(() => {
      setAdded(false)
    }, 500)
  }

  return (
    <>
      <button 
        onClick={handleAddToCart} 
        disabled={added}
        className='my-4 btn btn-primary w-full'
      >
        { !added && <span>Add to cart</span>}
        { added && <span>Adding to cart... </span>}
      </button>
    </>
  )
} 