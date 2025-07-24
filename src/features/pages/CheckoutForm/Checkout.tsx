'use client';

import React, { useCallback, useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
const stripePromise = loadStripe("pk_test_51RlnqVCRemnaR0EMcYPAKo8USAa7Qhyx8drdhnG2XG4KOp8PrGqOu9D61azLwFxfiaAyOWLcCRIY93W8Z1DXsqAF00z6jI9LR0");

const CheckoutForm = () => {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = {fetchClientSecret};

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

export default CheckoutForm;