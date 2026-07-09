import React from 'react';
import {useNavigate} from 'react-router-dom';
export default function Register(){ const nav=useNavigate(); function submit(e){ e.preventDefault(); const fd=new FormData(e.target); fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({ name: fd.get('name'), email: fd.get('email'), password: fd.get('password') })}).then(async r=>{ const data=await r.json(); if(!r.ok) throw data; localStorage.setItem('token', data.token); localStorage.setItem('userId', data.user.id); localStorage.setItem('userName', data.user.name); nav('/dashboard'); }).catch(err=>{ alert(err.error||'Register failed') }); } return (<div className="container"><form className="form-card" onSubmit={submit}><h2>Create Account</h2>
<label>Full Name</label><input name="name" className="input" required />
<label>Email</label><input name="email" className="input" required />
<label>Password</label><input name="password" type="password" className="input" required />
<button className="cta" style={{marginTop:12}}>Register</button>
<p className="info">Already have an account? <a href="/login">Login</a></p>
</form></div>)}