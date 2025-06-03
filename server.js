const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const visitsFile = path.join(__dirname, 'visits.json');
app.use(express.static('public'));

app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const timestamp = new Date().toISOString();

  const visit = { ip, userAgent, timestamp };
  let visits = [];
  if (fs.existsSync(visitsFile)) {
    visits = JSON.parse(fs.readFileSync(visitsFile));
  }
  visits.push(visit);
  fs.writeFileSync(visitsFile, JSON.stringify(visits, null, 2));
  next();
});

app.get('/api/visits', (req, res) => {
  if (fs.existsSync(visitsFile)) {
    const data = fs.readFileSync(visitsFile);
    res.json(JSON.parse(data));
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

