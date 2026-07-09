const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const DATA_DIR = path.join(__dirname, 'data');

app.use(express.json());

// Serve images (your uploaded images)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Helper functions
function readJSON(file) { 
  try { 
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8')); 
  } catch (e) { 
    return []; 
  } 
}
function writeJSON(file, data) { 
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2)); 
}

// ======================================================
// API ROUTES
// ======================================================

// accommodations
app.get('/api/accommodations', (req, res) => {
  const data = readJSON('hotels.json');
  res.json(data);
});

app.get('/api/accommodations/:id', (req, res) => {
  const data = readJSON('hotels.json');
  const h = data.find(x => String(x.id) === String(req.params.id));
  if (!h) return res.status(404).json({ error: 'Not found' });
  res.json(h);
});

// users
app.post('/api/register', (req,res) => {
  const users = readJSON('users.json');
  const { name, email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Missing fields' });

  if (users.find(u => u.email === email))
    return res.status(400).json({ error: 'User exists' });

  const id = Date.now();
  const user = { id, name, email, password };
  users.push(user);
  writeJSON('users.json', users);

  res.json({ token: 'tok-'+id, user: { id, name, email } });
});

app.post('/api/login', (req,res) => {
  const users = readJSON('users.json');
  const { email, password } = req.body;

  const u = users.find(x => x.email === email);
  if (!u || u.password !== password)
    return res.status(400).json({ error: 'Invalid email or password' });

  res.json({ token: 'tok-'+u.id, user: { id: u.id, name: u.name, email: u.email } });
});

// bookings
app.get('/api/bookings', (req,res) => {
  const bookings = readJSON('bookings.json');
  const auth = (req.headers.authorization || '').split(' ')[1] || '';

  if (auth) {
    const uid = auth.replace('tok-', '');
    return res.json(bookings.filter(b => String(b.userId) === String(uid)));
  }
  res.json(bookings);
});

app.post('/api/bookings', (req,res) => {
  const bookings = readJSON('bookings.json');
  const { userId, accommodationId, checkIn, checkOut, rooms, fullName, email, total } = req.body;

  if (!accommodationId || !checkIn || !checkOut)
    return res.status(400).json({ error: 'Missing booking fields' });

  const id = Date.now();
  const ref = 'EXP' + Math.floor(100000 + Math.random() * 900000);

  const booking = { id, ref, userId, accommodationId, checkIn, checkOut, rooms, fullName, email, total };
  bookings.push(booking);
  writeJSON('bookings.json', bookings);

  res.json({ booking, ref });
});

app.delete('/api/bookings/:id', (req,res) => {
  const id = String(req.params.id);
  let bookings = readJSON('bookings.json');

  const idx = bookings.findIndex(b => String(b.id) === id || String(b.ref) === id);
  if (idx === -1)
    return res.status(404).json({ error: 'Booking not found' });

  bookings.splice(idx, 1);
  writeJSON('bookings.json', bookings);

  res.json({ success: true });
});

// contact
app.post('/api/contact', (req,res) => {
  const messages = readJSON('messages.json');
  messages.push({ id: Date.now(), ...req.body });
  writeJSON('messages.json', messages);
  res.json({ ok: true });
});

// ======================================================
// SERVE REACT BUILD (FINAL FIX)
// ======================================================

// Build path: ../client/dist/
const clientDistPath = path.join(__dirname, '../client/dist');

// Serve static files
app.use(express.static(clientDistPath));

// React Router fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// ======================================================

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server running on', port));
