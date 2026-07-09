import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
export default function Home(){ const [list,setList]=useState([]); const nav=useNavigate();
useEffect(()=>{ fetch('/api/accommodations').then(r=>r.json()).then(d=>setList(d.slice(0,6))).catch(()=>setList([])); },[]);
return (
  <div className="home-page">
    <div className="hero-wrapper">
      <img src="/images/hero_night.jpg" className="hero-bg" alt="hero" />
      <div className="hero-content">
        <h1>Explore the City Lights with Explora</h1>
        <p>Discover curated stays and comfortable hotels — all in one place.</p>
        <button className="cta" onClick={()=>nav('/accommodations')}>Explore Now</button>
      </div>
      <div className="hero-card"><img src="/images/hero_night.jpg" alt="hero card" style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
    </div>
    <div className="container">
      <h2 className="section-title">Popular Accommodations</h2>
      <div id="cards" className="grid">
        {list.length>0?list.map(h=>(
          <div className="card" key={h.id}>
            <img src={'/images/'+h.image} alt={h.name} />
            <h3>{h.name}</h3>
            <p>{(h.description||'').slice(0,110)}</p>
            <div className="meta">
              <div style={{fontWeight:700,color:'#14d3ee'}}>₹{h.pricePerNight}</div>
              <button className="btn-small" onClick={()=>nav('/accommodations/'+h.id)}>View</button>
            </div>
          </div>
        )):<p>Loading…</p>}
      </div>
    </div>
  </div>
)}