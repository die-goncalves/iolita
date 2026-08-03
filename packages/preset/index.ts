import { definePreset } from '@pandacss/dev'
import { keyframes } from './keyframes'
import recipes from './recipes'
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
			keyframes,
			recipes: {
				button: recipes.buttonRecipe
			},
			tokens: {
				easings: tokens.easings
			}
		}
	}
})

export default preset
