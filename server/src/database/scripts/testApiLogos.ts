import http from 'http';

http.get('http://localhost:3001/api/startups?limit=5', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('API Status:', json.success);
      if (json.data && json.data.length > 0) {
        json.data.forEach((s: any) => {
          console.log(`- ${s.name}: logoUrl = "${s.logoUrl}"`);
        });
      }
    } catch (e: any) {
      console.error('Parse error:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
