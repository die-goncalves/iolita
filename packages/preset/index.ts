import { definePreset } from '@pandacss/dev'
import tokens from './tokens'

const preset = definePreset({
  name: '@iolita/preset',
  conditions: {
		extend: {
			notDisabled:
				'&:not(:is(:disabled, [disabled], [data-disabled], [aria-disabled=true]))'
		}
	},
	theme: {
		extend: {
			tokens: {
				easings: tokens.easings
			}
		}
	}
})

export default preset
