// 'use client';

// import React, { useCallback, useState, useEffect } from "react";
// import {loadStripe} from '@stripe/stripe-js';
// import {
//   BrowserRouter,
//   Route,
//   Routes,
//   Navigate
// } from "react-router-dom";


// const ReturnForm = () => {
//   const [status, setStatus] = useState(null);
//   const [customerEmail, setCustomerEmail] = useState('');

//   useEffect(() => {
//     const queryString = window.location.search;
//     const urlParams = new URLSearchParams(queryString);
//     const sessionId = urlParams.get('session_id');

//     fetch(`http://localhost:4242/session-status?session_id=${sessionId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setStatus(data.status);
//         setCustomerEmail(data.customer_email);
//       });
//   }, []);

//   if (status === 'open') {
//     return (
//       <Navigate to="/checkout" />
//     )
//   }

//   if (status === 'complete') {
    
//     return (
//       <section id="success">
//         <p>
//           We appreciate your business! A confirmation email will be sent to {customerEmail}.

//           If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
          
//         </p>
//       </section>
      
//     )
//   }

//   return null;
// }

// export default ReturnForm;
'use client';

import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom"; // Import useNavigate

const ReturnForm = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [countdown, setCountdown] = useState(10); // State for the countdown timer
  const navigate = useNavigate(); // Hook for programmatic navigation

  // This effect runs once to get the payment status from your server
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`http://18.138.130.229:3000/api/stripe/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []); // The empty array [] ensures this runs only on the initial render

  // This effect runs when the 'status' changes, to handle the redirect
  useEffect(() => {
    // Only start the timer if the payment was successful
    if (status === 'complete') {
      // Set up an interval to decrease the countdown every second
      const countdownInterval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);

      // Set up a timeout to redirect after 10 seconds
      const redirectTimeout = setTimeout(() => {
        navigate('/'); // Redirect to the homepage
      }, 10000); // 10000 milliseconds = 10 seconds

      // This is a special "cleanup" function.
      // It runs if the component unmounts to prevent memory leaks.
      return () => {
        clearInterval(countdownInterval);
        clearTimeout(redirectTimeout);
      };
    }
  }, [status, navigate]); // This effect depends on 'status' and 'navigate'

  // If the session is still open, redirect back to the checkout page
  if (status === 'open') {
    return <Navigate to="/checkout" />;
  }

  // If the payment is complete, show the success message with the countdown
  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.
        </p>
        <p>
          If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
        <hr style={{ margin: '20px 0' }} />
        <p>
          You will be redirected to the homepage in **{countdown}** seconds.
        </p>
      </section>
    );
  }

  // While waiting for the status, show a loading message
  return <h2>Loading payment details...</h2>;
}

export default ReturnForm;