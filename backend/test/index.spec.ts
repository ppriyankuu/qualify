// test/index.spec.ts
import { env, createExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import app from '../src';

describe('App Router Index', () => {
  it('responds to /api/health with 200 OK', async () => {
    const ctx = createExecutionContext();
    const request = new Request('http://localhost/api/health');
    const response = await app.fetch(request, env, ctx);
    expect(response.status).toBe(200);
    const data = (await response.json()) as { status: string };
    expect(data.status).toBe('healthy');
  });
});
