'use client'

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { useCartStore } from '@/store'
import { Elements } from '@stripe/react-stripe-js'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CheckoutForm from './CheckoutForm'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function Checkout() {
  const cartStore = useCartStore()
  const [clientSecret, setClientSecret] = useState('')
  const router = useRouter()

  const stripeOptions: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      labels: 'floating',
    }
  }

  useEffect(() => {
    //create a payment intent as soon as the element loads up
    fetch('/api/create-payment-intent', { 
      method: 'POST', 
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({
        items: cartStore.cart, 
        payment_intent_id: cartStore.paymentIntent, 
      })
    })
    .then((res) => {
      if (res.status === 403) {
        return router.push('/api/auth/signin')
      }
      return res.json() 
    })
    .then((data) => {
      setClientSecret(data.paymentIntent.client_secret)
      cartStore.setPaymentIntent(data.paymentIntent.id)
    })
  }, [])

  return (
    <div>
      {clientSecret && (
        <div>
          <Elements options={ stripeOptions } stripe={ stripePromise }>
            <CheckoutForm clientSecret={ clientSecret }/>
          </Elements>
        </div>
      )}
    </div>
  )
}