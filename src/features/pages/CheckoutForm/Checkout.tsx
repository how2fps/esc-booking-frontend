'use client';

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // 1. Import useLocation
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

// Initialize Stripe outside of the component
console.log('STRIPE env var:', process.env.STRIPE);
const apiKey:string = process.env.STRIPE as string;
if (!apiKey) {
    throw new Error(`Environment variable STRIPE is not set`);
  }

const stripePromise = loadStripe(apiKey);

const CheckoutForm = () => {
  // 2. Add state to hold the client secret
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  // 3. Get the location object which contains the state you passed
  const location = useLocation();
  
  // 4. Extract the bookingId from the location's state
  const bookingId = location.state?.bookingId;

  // 5. Use useEffect to fetch the client secret when the component loads
  useEffect(() => {
    // Make sure we have a bookingId before trying to fetch
    if (bookingId) {
      console.log(`Fetching payment details for booking ID: ${bookingId}`);
      
      fetch("http://18.138.130.229:3000/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        // 6. Send the bookingId in the request body
        body: JSON.stringify({ bookingId: bookingId }), 
      })
      .then((res) => res.json())
      .then((data) => {
        // 7. Set the client secret in state
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Failed to fetch client secret:", error);
      });
    }
  }, [bookingId]); // This effect runs whenever the bookingId changes

  // 8. Conditionally render the form
  if (clientSecret) {
    // If we have a client secret, render the checkout form
    const options = { clientSecret };
    return (
      <div id="checkout">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={options}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
  }

  // While waiting for the client secret, show a loading message
  return <h2>Loading payment form...</h2>;
}

export default CheckoutForm;