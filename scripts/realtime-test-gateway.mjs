import { createServer, request } from 'node:http';

const host = 'realtime-test.razeth.com';
const loopback = '127.0.0.1';
const ports = { gateway: 8084, client: 8085, api: 3085 };

createServer((incoming, outgoing) => {
  if (incoming.headers.host !== host || !incoming.url?.startsWith('/') || incoming.url.startsWith('//')) {
    outgoing.writeHead(400).end();
    return;
  }
  const api = incoming.url === '/api' ||
    incoming.url.startsWith('/api/') || incoming.url.startsWith('/api?');
  const headers = { ...incoming.headers, 'x-forwarded-host': host, 'x-forwarded-proto': 'https' };
  delete headers['cf-access-jwt-assertion'];
  // Forward only host-local test session cookies, with the gateway prefix removed.
  headers.cookie = (headers.cookie ?? '').split(';').map((part) => part.trim())
    .filter((part) => part.startsWith('realtime_test_')).map((part) => part.slice('realtime_test_'.length)).join('; ');
  const upstream = request({ hostname: loopback, port: api ? ports.api : ports.client, path: incoming.url, method: incoming.method, headers }, (response) => {
    const responseHeaders = { ...response.headers };
    if (responseHeaders['set-cookie']) {
      responseHeaders['set-cookie'] = responseHeaders['set-cookie'].map((cookie) =>
        `realtime_test_${cookie.replace(/;\s*Domain=[^;]*/gi, '')}`);
    }
    outgoing.writeHead(response.statusCode ?? 502, responseHeaders);
    outgoing.flushHeaders();
    response.pipe(outgoing);
  });
  upstream.on('error', () => {
    if (!outgoing.headersSent) outgoing.writeHead(502);
    outgoing.end('Isolated acceptance origin is unavailable.');
  });
  outgoing.on('close', () => upstream.destroy());
  incoming.pipe(upstream);
}).listen(ports.gateway, loopback, () => console.log(`Isolated gateway listening on ${loopback}:${ports.gateway}`));
