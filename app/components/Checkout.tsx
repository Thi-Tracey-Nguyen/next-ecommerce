'use client'

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { useCartStore } from '@/store'
import { Elements } from '@stripe/react-stripe-js'
import { useState, useEffect } from 'react'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function Checkout() {
  const cartStore = useCartStore()
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    //create a payment intent as soon as the element loads up
    fetch('api/create-payment-intent', { 
      method: 'POST', 
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({
        items: cartStore.cart, 
        payment_intent_id: cartStore.paymentIntent, 
      })
    })
  }, [])
}