/*
 * https://cubic-bezier.com/
 * https://easings.net/
 * M3 - Expressive: https://m3.material.io/styles/motion/overview/specs
 */

import { defineTokens } from '@pandacss/dev'

export const easings = defineTokens.easings({
	'in-sine': { value: 'cubic-bezier(0.12,0,0.39,0)' },
	'out-sine': { value: 'cubic-bezier(0.61,1,0.88,1)' },
	'in-out-sine': { value: 'cubic-bezier(0.37,0,0.63,1)' },
	'in-quad': { value: 'cubic-bezier(0.11,0,0.5,0)' },
	'out-quad': { value: 'cubic-bezier(0.5,1,0.89,1)' },
	'in-out-quad': { value: 'cubic-bezier(0.45,0,0.55,1)' },
	'in-cubic': { value: 'cubic-bezier(0.32,0,0.67,0)' },
	'out-cubic': { value: 'cubic-bezier(0.33,1,0.68,1)' },
	'in-out-cubic': { value: 'cubic-bezier(0.65,0,0.35,1)' },
	'in-quart': { value: 'cubic-bezier(0.5,0,0.75,0)' },
	'out-quart': { value: 'cubic-bezier(0.25,1,0.5,1)' },
	'in-out-quart': { value: 'cubic-bezier(0.76,0,0.24,1)' },
	'in-quint': { value: 'cubic-bezier(0.64,0,0.78,0)' },
	'out-quint': { value: 'cubic-bezier(0.22,1,0.36,1)' },
	'in-out-quint': { value: 'cubic-bezier(0.83,0,0.17,1)' },
	'in-expo': { value: 'cubic-bezier(0.7,0,0.84,0)' },
	'out-expo': { value: 'cubic-bezier(0.16,1,0.3,1)' },
	'in-out-expo': { value: 'cubic-bezier(0.87,0,0.13,1)' },
	'in-circ': { value: 'cubic-bezier(0.55,0,1,0.45)' },
	'out-circ': { value: 'cubic-bezier(0,0.55,0.45,1)' },
	'in-out-circ': { value: 'cubic-bezier(0.85,0,0.15,1)' },
	'in-back': { value: 'cubic-bezier(0.36,0,0.66,-0.56)' },
	'out-back': { value: 'cubic-bezier(0.34,1.56,0.64,1)' },
	'in-out-back': { value: 'cubic-bezier(0.68,-0.6,0.32,1.6)' },
	'm3-exp-fast-effects': { value: 'cubic-bezier(0.31,0.94,0.34,1.00)' },
	'm3-exp-effects': { value: 'cubic-bezier(0.34,0.80,0.34,1.00)' },
	'm3-exp-slow-effects': { value: 'cubic-bezier(0.34,0.88,0.34,1.00)' },
	'm3-exp-fast-spatial': { value: 'cubic-bezier(0.42,1.67,0.21,0.90)' },
	'm3-exp-spatial': { value: 'cubic-bezier(0.38,1.21,0.22,1.00)' },
	'm3-exp-slow-spatial': { value: 'cubic-bezier(0.39,1.29,0.35,0.98)' },
	'm3-std-fast-spatial': { value: 'cubic-bezier(0.27,1.06,0.18,1.00)' },
	'm3-std-spatial': { value: 'cubic-bezier(0.27,1.06,0.18,1.00)' },
	'm3-std-slow-spatial': { value: 'cubic-bezier(0.27,1.06,0.18,1.00)' },
	'm3-std-fast-effects': { value: 'cubic-bezier(0.31,0.94,0.34,1.00)' },
	'm3-std-effects': { value: 'cubic-bezier(0.34,0.80,0.34,1.00)' },
	'm3-std-slow-effects': { value: 'cubic-bezier(0.34,0.88,0.34,1.00)' }
})
