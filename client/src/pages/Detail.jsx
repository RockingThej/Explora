import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
export default function Detail(){ const {id}=useParams(); const [h,setH]=useState(null); const nav=useNavigate();
useEffect(()=>{ if(id){ fetch('/api/accommodations/'+id).then(r=>r.ok?r.json():null).then(d=>setH(d)).catch(()=>setH(null)); } },[id]);
if(!h) return <div className="container"><p>Loading...</p></div>;
return (<div className="container detail-container">
  <div><img src={'/images/'+h.image} className="detail-img" alt={h.name} /></div>
  <div className="detail-right">
    <h2>{h.name}</h2>
    <p>{h.description}</p>
    <p><strong>Location:</strong> {h.location}</p>
    <p><strong>Price:</strong> ₹{h.pricePerNight}/night</p>
    <p><strong>Amenities:</strong> {h.amenities? h.amenities.join(', '):''}</p>
    <button className="cta" onClick={()=>nav('/book/'+h.id)}>Book Now</button>
  </div>
</div>)}