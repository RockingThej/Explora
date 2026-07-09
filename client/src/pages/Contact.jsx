import React from 'react';
export default function Contact(){ function submit(e){ e.preventDefault(); const fd=new FormData(e.target); fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({ name: fd.get('name'), email: fd.get('email'), message: fd.get('message') })}).then(()=>{ alert('Message sent'); window.location.href='/'; }).catch(()=>alert('Failed')); }
return (<div className="container"><h2 className="section-title">Feedback</h2>
<form className="form-card" onSubmit={submit}>
<label>Name</label><input name="name" className="input" required />
<label>Email</label><input name="email" className="input" required />
<label>Message</label><textarea name="message" className="input" rows="4" required></textarea>
<button className="cta" style={{marginTop:10}}>Send</button>
</form></div>)}