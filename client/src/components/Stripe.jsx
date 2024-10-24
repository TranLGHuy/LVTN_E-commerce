import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import axios from 'axios'
import { useState } from 'react'
import CheckoutForm from './CheckoutForm'
import { stripe_sky } from '../utils/config'

const stripePromise = loadStripe(stripe_sky)

const Stripe = ({ price, orderId }) => {
    const [clientSecret, setClientSecret] = useState('')
    const appearance = {
        theme: 'stripe'
    }
    const options = {
      appearance: appearance,
        clientSecret
    }
    const create_payment = async () => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/order/create-payment', { price }, { withCredentials: true })
            setClientSecret(data.clientSecret)
        } catch (error) {
            console.log(error.response.data)
        }
    }
    return (
        <div className='mt-4'>
            {
                clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm orderId={orderId} />
                    </Elements>
                ) : <button onClick={create_payment} className='w-full px-4 py-3 rounded-md hover:bg-orange-500 bg-orange-400 text-white transition duration-200'>Start Payment</button>
            }
        </div>
    )
}

export default Stripe