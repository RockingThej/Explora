import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
export default function Booking(){ const {id}=useParams(); const [list,setList]=useState([]); const nav=useNavigate();
useEffect(()=>{ fetch('/api/accommodations').then(r=>r.json()).then(d=>setList(d)).catch(()=>setList([])); },[]);
useEffect(()=>{ if(id){ /* could preselect */ } },[id]);
function handleSubmit(e){ e.preventDefault(); const fd=new FormData(e.target); const data={ userId: localStorage.getItem('userId')||null, accommodationId: fd.get('destination')||id, checkIn: fd.get('checkIn'), checkOut: fd.get('checkOut'), rooms: fd.get('rooms'), fullName: fd.get('fullName'), email: fd.get('email')}; localStorage.setItem('bookingDraft', JSON.stringify(data)); nav('/payment/'+data.accommodationId); }
return (<div className="container"><h2 className="section-title">Book Your Stay</h2>
<form id="bookForm" className="form-card" onSubmit={handleSubmit}>
<label>Full Name</label><input name="fullName" className="input" required />
<label>Email</label><input name="email" className="input" required />
<label>Choose Hotel</label>
<select name="destination" className="input" required>
<option value="">-- Select --</option>
{list.map(h=><option value={h.id} key={h.id}>{h.name}</option>)}
</select>
<label>Check-in</label><input type="date" name="checkIn" className="input" required />
<label>Check-out</label><input type="date" name="checkOut" className="input" required />
<label>Rooms</label><input type="number" name="rooms" min="1" defaultValue="1" className="input" required />
<button className="cta" style={{marginTop:10}}>Proceed to Payment</button>
</form></div>)}