import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
export default function Accommodations(){ const [list,setList]=useState([]); const nav=useNavigate();
useEffect(()=>{ fetch('/api/accommodations').then(r=>r.json()).then(d=>setList(d)).catch(()=>setList([])); },[]);
return (<div className="container"><h2 className="section-title">Accommodations</h2><div className="grid">
{list.map(h=>(
  <div className="card" key={h.id}>
    <img src={'/images/'+h.image} alt={h.name} />
    <h3>{h.name}</h3>
    <p>{(h.description||'').slice(0,140)}</p>
    <div className="meta"><div style={{fontWeight:700,color:'#14d3ee'}}>₹{h.pricePerNight}</div>
    <button className="btn-small" onClick={()=>nav('/accommodations/'+h.id)}>View</button></div>
  </div>
))}</div></div>)}