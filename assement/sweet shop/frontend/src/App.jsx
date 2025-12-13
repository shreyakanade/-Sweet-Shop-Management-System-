import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

function saveToken(token){
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function loadToken(){
  const t = localStorage.getItem('token');
  if(t){ axios.defaults.headers.common['Authorization'] = `Bearer ${t}`; }
}

loadToken();

function Login(){ 
  const [username,setUsername]=useState(''); const [password,setPassword]=useState(''); const navigate = useNavigate();
  async function handle(e){ e.preventDefault(); try{ const res = await axios.post('/auth/login/', {username, password}); saveToken(res.data.access); navigate('/'); }catch(err){ alert('Login failed'); } }
  return (<div className="auth-page"><motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}><h2>Login</h2><form onSubmit={handle}><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password"/><button>Login</button></form><Link to="/register">Create account</Link></motion.div></div>);
}

function Register(){ const [username,setUsername]=useState(''); const [password,setPassword]=useState(''); const navigate=useNavigate();
  async function handle(e){ e.preventDefault(); try{ await axios.post('/auth/register/', {username, password}); alert('Registered'); navigate('/login'); }catch(e){ alert('Register failed'); } }
  return (<div className="auth-page"><motion.div className="card"><h2>Register</h2><form onSubmit={handle}><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password"/><button>Register</button></form><Link to="/login">Back to login</Link></motion.div></div>);
}

function Home({addToCart}){
  const [sweets,setSweets]=useState([]); const [q,setQ]=useState('');
  async function fetchSweets(){ try{ const r = await axios.get('/sweets/'); setSweets(r.data);}catch(e){ console.error(e); } }
  useEffect(()=>{ fetchSweets(); },[]);
  return (<div className="page"><header className="page-header"><h1>Sweet Shop</h1><div><Link to="/cart" className="btn">Cart</Link><Link to="/admin" className="btn outline">Admin</Link></div></header><div className="search"><input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)}/></div><div className="grid">{sweets.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())).map(s=>(<motion.div key={s.id} className="card product"><h3>{s.name}</h3><p className="muted">{s.category}</p><p>₹{s.price}</p><p>Stock: {s.quantity}</p><div className="actions"><button disabled={s.quantity===0} onClick={()=>addToCart(s)} className={s.quantity===0? 'btn disabled' : 'btn primary'}>{s.quantity===0? 'Out' : 'Add to cart'}</button></div></motion.div>))}</div></div>);
}

function Admin(){ const [sweets,setSweets]=useState([]); const [form,setForm]=useState({name:'',category:'',price:'',quantity:''});
  async function fetchSweets(){ const r=await axios.get('/sweets/'); setSweets(r.data); }
  useEffect(()=>{ fetchSweets(); },[]);
  async function add(e){ e.preventDefault(); await axios.post('/sweets/', {...form, price: parseFloat(form.price), quantity: parseInt(form.quantity||0)}); setForm({name:'',category:'',price:'',quantity:''}); fetchSweets(); }
  async function remove(id){ if(!confirm('Delete?')) return; await axios.delete(`/sweets/${id}/`); fetchSweets(); }
  return (<div className="page"><header className="page-header"><h1>Admin</h1><Link to="/" className="btn">Back</Link></header><form className="grid" onSubmit={add}><input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/><input placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}/><input placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/><input placeholder="Quantity" value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})}/><button className="btn primary">Add</button></form><div className="grid">{sweets.map(s=>(<div key={s.id} className="card"><h3>{s.name}</h3><p>₹{s.price} · {s.quantity}</p><div><button className="btn" onClick={()=>remove(s.id)}>Delete</button></div></div>))}</div></div>);
}

function Cart({cart, setCart, addOrder}){
  const total = cart.reduce((acc,c)=> acc + (c.price * c.qty),0);
  async function checkout(){ if(cart.length===0) { alert('Cart empty'); return; } await addOrder(cart); setCart([]); alert('Order placed'); }
  return (<div className="page"><header className="page-header"><h1>Your Cart</h1><Link to="/" className="btn">Continue shopping</Link></header><div className="card"><ul>{cart.map((c,i)=>(<li key={i} className="cart-row"><div>{c.name} x {c.qty}</div><div>₹{(c.price * c.qty).toFixed(2)}</div></li>))}</ul><div className="cart-total">Total: ₹{total.toFixed(2)}</div><div className="cart-actions"><button className="btn primary" onClick={checkout}>Checkout</button></div></div></div>);
}

function Orders({orders}){ return (<div className="page"><header className="page-header"><h1>Order History</h1><Link to="/" className="btn">Shop</Link></header><div className="grid">{orders.length===0? <div className="card">No orders yet</div> : orders.map((o,i)=>(<div key={i} className="card"><h3>Order #{i+1}</h3><p>Date: {new Date(o.date).toLocaleString()}</p><ul>{o.items.map((it,j)=>(<li key={j}>{it.name} x {it.qty} - ₹{(it.price*it.qty).toFixed(2)}</li>))}</ul><p>Total: ₹{o.total.toFixed(2)}</p></div>))}</div></div>); }

export default function App(){
  const [dark, setDark] = useState(localStorage.getItem('dark')==='1');
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')||'[]'));
  const [orders, setOrders] = useState(JSON.parse(localStorage.getItem('orders')||'[]'));
  useEffect(()=>{ document.documentElement.classList.toggle('dark', dark); localStorage.setItem('dark', dark? '1':'0'); },[dark]);
  useEffect(()=>{ localStorage.setItem('cart', JSON.stringify(cart)); },[cart]);
  useEffect(()=>{ localStorage.setItem('orders', JSON.stringify(orders)); },[orders]);

  function addToCart(sweet){
    setCart(prev=>{ const exist = prev.find(p=>p.id===sweet.id); if(exist){ return prev.map(p=> p.id===sweet.id? {...p, qty: p.qty+1}:p); } return [...prev, {...sweet, qty:1}]; });
  }

  async function addOrder(cartItems){
    // place purchase requests to backend for each item (best-effort)
    for(const it of cartItems){
      try{ await axios.post(`/sweets/${it.id}/purchase/?quantity=${it.qty}`); }catch(e){ console.warn('purchase failed', e); }
    }
    const order = { date: new Date().toISOString(), items: cartItems, total: cartItems.reduce((a,c)=>a + c.price*c.qty,0) };
    setOrders(prev=> [order, ...prev]);
  }

  return (<Router><div className={dark? 'app dark' : 'app'}><nav className="topbar"><div className="brand"><Link to="/">SweetShop</Link></div><div className="nav-actions"><button className="btn" onClick={()=>setDark(d=>!d)}>{dark? 'Light' : 'Dark'}</button><Link to="/cart" className="btn">Cart ({cart.reduce((a,c)=>a+c.qty,0)})</Link></div></nav><Routes><Route path="/" element={<Home addToCart={addToCart} />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register/>} /><Route path="/admin" element={<Admin/>} /><Route path="/cart" element={<Cart cart={cart} setCart={setCart} addOrder={addOrder} />} /><Route path="/orders" element={<Orders orders={orders} />} /></Routes></div></Router>);
}