

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Report() {
  const [form, setForm] = useState({ name: '', email: '', message: '', lat: '', lng: '', location: 'Fetching...' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setForm(f => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude, location: 'Captured!' })),
      () => setForm(f => ({ ...f, location: 'Denied' }))
    );
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!image) return setError('Upload animal photo');

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    fd.append('message', form.message);
    fd.append('lat', form.lat);
    fd.append('lng', form.lng);
    fd.append('image', image);

    try {
      const res = await axios.post('http://localhost:5000/api/reports', fd);
      setData(res.data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed');
    }
  };

  if (success) {
    return (
      <div style={{maxWidth:'800px', margin:'50px auto', padding:'30px', background:'white', borderRadius:'15px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>
        <h2 style={{color:'#27ae60'}}>Report Sent!</h2>
        <p><strong>Location:</strong> {data.address}</p>
        <p><a href={data.mapsLink} target="_blank">Open Route in Google Maps</a></p>
        <h3>{data.nearbyNGOs.length} NGOs Alerted:</h3>
        {data.nearbyNGOs.map(n => (
          <div key={n._id} style={{padding:'15px', margin:'10px 0', background:'#f0f8ff', borderRadius:'10px'}}>
            <strong>{n.organization}</strong> – {n.distance}km<br/>
            {n.email} | {n.phone}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{maxWidth:'600px', margin:'50px auto', padding:'30px', background:'white', borderRadius:'15px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>
      <h2>Report Stray Animal</h2>
      {error && <div style={{background:'#e74c3c', color:'white', padding:'15px', borderRadius:'8px'}}>{error}</div>}
      <form onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={s.input} />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={s.input} />
        <textarea placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{...s.input, height:'100px'}} />
        <div style={{padding:'15px', background:'#e8f5e8', borderRadius:'8px', fontWeight:'bold'}}>{form.location}</div>
        <input type="file" accept="image/*" onChange={e => { setImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} required />
        {preview && <img src={preview} style={{width:'100%', marginTop:'10px', borderRadius:'10px'}} />}
        <button type="submit" style={{...s.btn, background:'#e74c3c'}}>Send Report</button>
      </form>
    </div>
  );
}

const s = { input: {width:'100%', padding:'14px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ddd'}, btn: {width:'100%', padding:'16px', color:'white', border:'none', borderRadius:'8px', marginTop:'20px'} };



