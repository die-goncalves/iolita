import { locators } from 'vitest/browser'

locators.extend({
	getByScopeAndPart(scope, part) {
		return `[data-scope="${scope}"][data-part="${part}"]`
	}
})
