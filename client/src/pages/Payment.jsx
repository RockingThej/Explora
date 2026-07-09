import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
export default function Payment(){ const {id}=useParams(); const [h,setH]=useState(null); const nav=useNavigate();
useEffect(()=>{ if(id){ fetch('/api/accommodations/'+id).then(r=>r.json()).then(d=>setH(d)).catch(()=>setH(null)); } const draft=JSON.parse(localStorage.getItem('bookingDraft')||'{}'); if(!draft.total && draft.accommodationId && draft.rooms){ /* compute later */ } },[id]);
if(!h) return <div className="container"><p>Loading payment...</p></div>;
const draft = JSON.parse(localStorage.getItem('bookingDraft')||'{}');
const total = draft.total || (h.pricePerNight * (Number(draft.rooms||1)));
function submitPayment(e){ e.preventDefault(); const f=new FormData(e.target); const card = f.get('cardNumber').replace(/\s+/g,''); if(card.length<16){ alert('Invalid card'); return; } // simulate
fetch('/api/bookings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({...draft,total}) }).then(()=>{ localStorage.removeItem('bookingDraft'); nav('/dashboard'); }).catch(()=>{ alert('Payment failed'); });}
return (<div className="container"><h2 className="section-title">Payment</h2>
<div className="payment-box">
<div className="summary">
<h3>Booking Summary</h3>
<p><strong>Hotel:</strong> {h.name}</p>
<p><strong>Check-in:</strong> {draft.checkIn}</p>
<p><strong>Check-out:</strong> {draft.checkOut}</p>
<p><strong>Rooms:</strong> {draft.rooms}</p>
<p><strong>Total:</strong> ₹{total}</p>
</div>
<form id="paymentForm" className="payment-form" onSubmit={submitPayment}>
<label>Cardholder Name</label><input name="cardName" className="input" required />
<label>Card Number</label><input name="cardNumber" maxLength="19" placeholder="1234 5678 9012 3456" className="input" required />
<div style={{display:'flex',gap:12}}>
<div style={{flex:1}}><label>Expiry</label><input name="expiry" maxLength="5" placeholder="MM/YY" className="input" required /></div>
<div style={{flex:1}}><label>CVV</label><input name="cvv" maxLength="3" placeholder="123" className="input" required /></div>
</div>
<p id="paymentError" className="error" style={{display:'none'}}></p>
<button className="cta" id="payBtn" style={{marginTop:10}}>Pay Now</button>
</form>
</div></div>)}