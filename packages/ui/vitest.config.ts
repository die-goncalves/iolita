import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		name: 'ui',
		browser: {
			enabled: true,
			headless: true,
			provider: playwright({}),
			instances: [{ browser: 'chromium' }]
		},
		setupFiles: ['./src/vitest.setup.ts']
	}
})
