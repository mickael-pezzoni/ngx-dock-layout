import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['projects/ngx-dock-layout/src/lib/core/**/*.spec.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['projects/ngx-dock-layout/src/lib/core/**/*.ts'],
      exclude: [
        'projects/ngx-dock-layout/src/lib/core/**/*.spec.ts',
        'projects/ngx-dock-layout/src/lib/core/**/*.directive.ts',
        'projects/ngx-dock-layout/src/lib/core/token.ts',
      ],
    },
  },
});
