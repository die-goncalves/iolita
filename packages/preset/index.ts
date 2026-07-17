import { definePreset } from '@pandacss/dev'
import tokens from './tokens'

const preset = definePreset({
	name: '@iolita/preset',
	theme: {
		extend: {
			tokens: {
				easings: tokens.easings
			}
		}
	}
})

export default preset
