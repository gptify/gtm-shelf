const https = require('https');
https.get('https://www.gtmshelf.com/use-cases', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('has tested step-by-step:', data.includes('tested step-by-step'));
    console.log('has verified tool stacks:', data.includes('verified tool stacks'));
    console.log('has Primary Verified Stack:', data.includes('Primary Verified Stack'));
    console.log('has Suggested Tools:', data.includes('Suggested Tools'));
    
    const buildIdMatch = data.match(/"buildId":"([^"]+)"/);
    console.log('Next.js buildId:', buildIdMatch ? buildIdMatch[1] : 'none');
  });
});
