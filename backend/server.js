
/*
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const fetch = require('node-fetch'); // npm install node-fetch@2

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  })
});

mongoose.connect('mongodb://127.0.0.1:27017/stray_rescue')
  .then(() => console.log('MongoDB Connected'))
  .catch(() => console.log('MongoDB not running - still works'));

const NGO = mongoose.model('NGO', new mongoose.Schema({
  name: String, email: String, phone: String, organization: String, lat: Number, lng: Number
}));

const Report = mongoose.model('Report', new mongoose.Schema({
  name: String, email: String, message: String, image: String, lat: Number, lng: Number, location: String
}));

// CHANGE THESE TWO LINES — CHANGE WITH YOUR GMAIL + APP PASSWORD
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'resqnet.alerts@gmail.com',           // YOUR EMAIL HERE
    pass: 'afio pdxc gidi bbxj'             // 16-DIGIT APP PASSWORD (from myaccount.google.com/apppasswords)
  }
});

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// FIXED: Proper async function with correct syntax
async function getRealAddress(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`);
    const data = await res.json();
    return data.display_name || `Near ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    return `Near ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

app.post('/api/ngos', async (req, res) => {
  try {
    await NGO.create(req.body);
    res.json({ message: 'NGO registered successfully!' });
  } catch { res.status(500).json({ error: 'Error' }); }
});

app.post('/api/reports', upload.single('image'), async (req, res) => {
  try {
    const { name, email, message, lat, lng } = req.body;
    const latF = parseFloat(lat);
    const lngF = parseFloat(lng);

    if (!req.file || !latF || !lngF) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Photo & location required!' });
    }

    // Animal validation
    const fileName = req.file.originalname.toLowerCase();
    const isAnimal = ['dog','puppy','cat','kitten','cow','calf','stray'].some(w => fileName.includes(w));
    const isBlocked = ['person','human','selfie','people'].some(w => fileName.includes(w));
    if (!isAnimal || isBlocked) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Only DOG/CAT/COW photos allowed!' });
    }

    const realAddress = await getRealAddress(latF, lngF);
    const mapsLink = `https://www.google.com/maps?q=${latF},${lngF}`;
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    await Report.create({ name, email, message: message || '', image: imageUrl, lat: latF, lng: lngF, location: realAddress });

    const ngos = await NGO.find();
    const nearby = [];

    for (const ngo of ngos) {
      const dist = getDistance(latF, lngF, ngo.lat, ngo.lng);
      if (dist <= 10) {
        nearby.push({ ...ngo.toObject(), distance: dist.toFixed(1) });

        transporter.sendMail({
          from: '"Stray Animal Alert" <yourgmail@gmail.com>',
          to: ngo.email,
          subject: `URGENT: Stray Animal Needs Help – ${dist.toFixed(1)}km`,
          html: `
            <h2 style="color:#e74c3c">Emergency Animal Report</h2>
            <p><strong>Location:</strong> ${realAddress}</p>
            <p><strong>Route:</strong> <a href="${mapsLink}" target="_blank">Open in Google Maps</a></p>
            <p><strong>Reporter:</strong> ${name} (${email})</p>
            <p><strong>Message:</strong> ${message || 'No message'}</p>
            <hr>
            <img src="${imageUrl}" width="100%" style="border-radius:12px;">
            <p><small>${new Date().toLocaleString('en-IN')}</small></p>
          `
        }, (err) => {
          console.log(err ? `FAILED: ${ngo.email}` : `SENT TO: ${ngo.email}`);
        });
      }
    }

    res.json({
      message: 'Report sent successfully!',
      nearbyNGOs: nearby,
      address: realAddress,
      mapsLink
    });

  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(5000, () => {
  console.log('\nSTRay ANIMAL RESCUE SYSTEM — FINAL 100% WORKING VERSION');
  console.log('http://localhost:5000');
  console.log('Real address + Maps + Image + Email = ALL WORKING\n');
});*/


// backend/server.js → REPLACE ENTIRE FILE WITH THIS

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.png')) res.set('Content-Type', 'image/png');
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) res.set('Content-Type', 'image/jpeg');
    if (filePath.endsWith('.webp')) res.set('Content-Type', 'image/webp');
    if (filePath.endsWith('.gif')) res.set('Content-Type', 'image/gif');
  }
}));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/stray_animal_rescue')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// Models
const NGO = mongoose.model('NGO', new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  organization: String,
  lat: Number,
  lng: Number
}));

const Report = mongoose.model('Report', new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  image: String,
  lat: Number,
  lng: Number,
  location: String
}));

// Email Setup (CHANGE THESE TWO LINES WITH YOUR GMAIL + APP PASSWORD)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'resqnet.alerts@gmail.com',           // ← CHANGE THIS
    pass: 'afio pdxc gidi bbxj'          // ← 16-DIGIT APP PASSWORD
  }
});

// Distance Calculator
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Get Real Address from Coordinates
async function getRealAddress(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`);
    const data = await res.json();
    return data.display_name || `Near ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `Near ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

// Multer: Accept ALL image types (JPG, PNG, WEBP, GIF)
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      cb(null, uniqueName);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed (JPG, PNG, WEBP, GIF)'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// NGO Registration
app.post('/api/ngos', async (req, res) => {
  try {
    const { name, email, phone, organization, lat, lng } = req.body;
    await NGO.create({ name, email, phone, organization, lat: parseFloat(lat), lng: parseFloat(lng) });
    res.json({ message: 'NGO registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Report Submission
app.post('/api/reports', upload.single('image'), async (req, res) => {
  try {
    const { name, email, message, lat, lng } = req.body;
    const latF = parseFloat(lat);
    const lngF = parseFloat(lng);

    if (!req.file || !latF || !lngF) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Photo and location required!' });
    }

    // Animal Validation (filename must contain dog/cat/cow)
    const fileName = req.file.originalname.toLowerCase();
    const isAnimal = ['dog','puppy','cat','kitten','cow','calf','stray'].some(w => fileName.includes(w));
    const isBlocked = ['person','human','selfie','people','car','food'].some(w => fileName.includes(w));

    if (!isAnimal || isBlocked) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Only photos of DOGS, CATS or COWS allowed!' });
    }

    const realAddress = await getRealAddress(latF, lngF);
    const mapsLink = `https://www.google.com/maps?q=${latF},${lngF}`;
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    await Report.create({
      name, email, message: message || '',
      image: imageUrl, lat: latF, lng: lngF, location: realAddress
    });

    const ngos = await NGO.find();
    const nearby = [];

    for (const ngo of ngos) {
      const dist = getDistance(latF, lngF, ngo.lat, ngo.lng);
      if (dist <= 10) {
        nearby.push({ ...ngo.toObject(), distance: dist.toFixed(1) });

        transporter.sendMail({
          from: '"Stray Animal Alert" <yourgmail@gmail.com>',
          to: ngo.email,
          subject: `URGENT: Stray Animal Needs Help – ${dist.toFixed(1)}km away`,
          html: `
            <div style="font-family:Arial,sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; padding:20px; border-radius:12px;">
              <h2 style="color:#e74c3c">New Emergency Report</h2>
              <p><strong>Location:</strong> ${realAddress}</p>
              <p><strong>Route:</strong> <a href="${mapsLink}" target="_blank" style="color:#3498db">Open in Google Maps</a></p>
              <p><strong>Reporter:</strong> ${name} (${email})</p>
              <p><strong>Message:</strong> ${message || 'No message'}</p>
              <hr>
              <div style="text-align:center; margin:20px 0;">
                <img src="${imageUrl}" width="100%" style="max-width:500px; border-radius:12px;" alt="Animal Photo">
              </div>
              <p style="color:#777; font-size:12px">Sent on: ${new Date().toLocaleString('en-IN')}</p>
            </div>
          `
        }, (err) => {
          console.log(err ? `EMAIL FAILED: ${ngo.email}` : `EMAIL SENT: ${ngo.email}`);
        });
      }
    }

    res.json({
      message: 'Report sent successfully!',
      nearbyNGOs: nearby,
      address: realAddress,
      mapsLink
    });

  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(5000, () => {
  console.log('\nSTRay ANIMAL RESCUE SYSTEM — FINAL VERSION');
  console.log('http://localhost:5000');
  console.log('All images (JPG, PNG, WEBP) accepted');
  console.log('Image shows in email');
  console.log('Auto + Manual NGO registration\n');
});

//hi this mona priya