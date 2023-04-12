'use client'

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { useCartStore } from '@/store'
import { Elements } from '@stripe/react-stripe-js'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CheckoutForm from './CheckoutForm'
import OrderAnimation from './OrderAnimation'
import { motion } from 'framer-motion'
import { useThemeStore } from '@/store'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function Checkout() {
  const cartStore = useCartStore()
  const router = useRouter()
  const themeStore = useThemeStore()

  const [clientSecret, setClientSecret] = useState('')
  const [stripeTheme, setStripeTheme] = useState<"flat" | "stripe" | "night" | "none">('stripe')

  const stripeOptions: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: stripeTheme,
      labels: 'floating',
    }
  }

  useEffect(() => {
    //set stripe theme 
    if (themeStore.mode === 'light') {
      setStripeTheme('stripe')
    } else {
      setStripeTheme('night')
    }

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
      {clientSecret ? (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
        >
          <Elements options={ stripeOptions } stripe={ stripePromise }>
            <CheckoutForm clientSecret={ clientSecret }/>
          </Elements>
        </motion.div>
      ) 
      : <OrderAnimation />}
    </div>
  )
}