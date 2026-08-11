import type { Locator } from 'vitest/browser'

declare module 'vitest/browser' {
	interface LocatorSelectors {
		/**
		 * Creates a locator capable of finding an element that matches both specified `data-scope` and `data-part` attributes.
		 * @param scope - The value of the `data-scope` attribute
		 * @param part - The value of the `data-part` attribute
		 * @example
		 * // Finds <button data-scope="tooltip" data-part="trigger">
		 * const trigger = page.getByScopeAndPart('tooltip', 'trigger')
		 * @returns A `Locator` pointing to the matching element(s).
		 */
		getByScopeAndPart(scope: string, part: string): Locator
	}
}
