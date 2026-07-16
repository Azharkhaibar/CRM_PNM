const http = require('http');

http.get('http://localhost:5530/api/v1/komposit/summary?year=2025&quarter=Q4', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      console.log('STATUS:', res.statusCode);
      console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
      const parsed = JSON.parse(data);
      console.log('RESPONSE:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('DATA:', data);
    }
  });
}).on('error', (err) => {
  console.error('ERROR:', err.message);
});
