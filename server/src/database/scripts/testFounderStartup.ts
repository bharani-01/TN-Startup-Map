import http from 'http';

http.get('http://localhost:3001/api/startups/stp-agnikul', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Lookup stp-agnikul success:', json.success);
      if (json.data) {
        console.log('Found startup:', json.data.name, 'slug:', json.data.slug);
      }
    } catch (e: any) {
      console.error('Parse error:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
