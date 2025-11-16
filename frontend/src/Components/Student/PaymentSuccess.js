import React from 'react'
import { useSearchParams } from 'react-router-dom'
const PaymentSuccess = () => {
  const searchQuery = useSearchParams()[0];
  const refnumber=searchQuery.get("reference");
  return (
    <div>
      PaymentSuccess
    <p>Reference no. {refnumber}</p>
    </div>
    
  )
}

export default PaymentSuccess