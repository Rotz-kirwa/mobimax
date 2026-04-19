import { serve } from '@hono/node-server';
import { app } from './index';

const port = 3001;
console.log(`\n🚀 Intelligence Server online at http://localhost:${port}`);
console.log(`📡 Base path: /api\n`);

serve({
  fetch: app.fetch,
  port,
});
