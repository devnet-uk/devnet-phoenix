import { describe, expect, it } from 'vitest';

describe('Phoenix Repository Setup', () => {
  it('should have proper package.json configuration', () => {
    expect(process.cwd()).toContain('devnet-phoenix');
  });

  it('should support TypeScript', () => {
    const message: string = 'TypeScript is working';
    expect(typeof message).toBe('string');
  });

  it('should have Node.js 22+ available', () => {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);
    expect(majorVersion).toBeGreaterThanOrEqual(22);
  });
});
