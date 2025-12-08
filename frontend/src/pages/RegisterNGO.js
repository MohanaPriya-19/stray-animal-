/*
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RegisterNGO() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', lat: '', lng: '', location: 'Getting location...' });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      setForm(f => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude, location: 'Location captured!' }));
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/ngos', form);
    alert('NGO Registered!');
  };

  return (
    <div style={{maxWidth:'600px', margin:'50px auto', padding:'30px', background:'white', borderRadius:'15px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>
      <h2 style={{textAlign:'center'}}>NGO Registration</h2>
      <form onSubmit={submit}>
        <input placeholder="NGO Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{width:'100%', padding:'12px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ddd'}} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{width:'100%', padding:'12px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ddd'}} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required style={{width:'100%', padding:'12px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ddd'}} />
        <input placeholder="Organization" value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} required style={{width:'100%', padding:'12px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ddd'}} />
        <div style={{padding:'15px', background:'#e8f5e8', borderRadius:'8px', margin:'15px 0'}}>{form.location}</div>
        <button type="submit" style={{width:'100%', padding:'15px', background:'#27ae60', color:'white', border:'none', borderRadius:'8px'}}>Register NGO</button>
      </form>
    </div>
  );
}*/

// REPLACE YOUR ENTIRE RegisterNGO.js WITH THIS

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RegisterNGO() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', organization: '', lat: '', lng: '', location: 'Click "Use My Location" or enter manually'
  });
  const [useManual, setUseManual] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleAutoLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
          location: 'Auto location captured!'
        }));
        setUseManual(false);
      },
      () => {
        setError('Location access denied');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.lat || !form.lng) {
      setError('Please use auto location or enter coordinates');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/ngos', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        organization: form.organization,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng)
      });
      setSuccess(true);
    } catch {
      setError('Registration failed');
    }
  };

  if (success) {
    return (
      <div style={{textAlign:'center', padding:'50px', background:'#d4edda', borderRadius:'15px', margin:'50px auto', maxWidth:'600px'}}>
        <h2 style={{color:'#155724'}}>NGO Registered Successfully!</h2>
        <p>You will now receive rescue alerts within 10km</p>
      </div>
    );
  }

  return (
    <div style={{maxWidth:'600px', margin:'50px auto', padding:'40px', background:'white', borderRadius:'15px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>
      <h2 style={{textAlign:'center', color:'#2c3e50'}}>Register Your NGO</h2>
      {error && <div style={{background:'#f8d7da', color:'#721c24', padding:'15px', borderRadius:'8px', margin:'15px 0'}}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <input placeholder="NGO Name" value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} required style={s.input} />
        <input placeholder="Contact Person" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={s.input} />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={s.input} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required style={s.input} />

        <div style={{margin:'20px 0', padding:'15px', background:'#e3f2fd', borderRadius:'10px'}}>
          <p style={{margin:'0 0 10px', fontWeight:'bold'}}>Location Options:</p>
          
          <button type="button" onClick={handleAutoLocation} style={{...s.btn, background:'#2196f3', margin:'0 10px 10px 0'}}>
            Use My Current Location
          </button>
          
          <button type="button" onClick={() => setUseManual(true)} style={{...s.btn, background:'#ff9800'}}>
            Enter Manually
          </button>

          <div style={{marginTop:'15px', padding:'10px', background:'white', borderRadius:'8px', fontSize:'14px'}}>
            {form.location}
          </div>

          {useManual && (
            <div style={{marginTop:'15px'}}>
              <input placeholder="Latitude (e.g. 19.0760)" value={form.lat} onChange={e => setForm({...form, lat: e.target.value})} style={s.input} />
              <input placeholder="Longitude (e.g. 72.8777)" value={form.lng} onChange={e => setForm({...form, lng: e.target.value})} style={s.input} />
            </div>
          )}
        </div>

        <button type="submit" style={{...s.btn, background:'#4caf50'}}>
          Register NGO
        </button>
      </form>
    </div>
  );
}

const s = {
  input: {width:'100%', padding:'14px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ddd', fontSize:'16px'},
  btn: {padding:'12px 20px', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}
};