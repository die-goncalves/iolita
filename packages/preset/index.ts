import { definePreset } from '@pandacss/dev'
import { keyframes } from './keyframes'
import recipes from './recipes'
import slotRecipes from './slot-recipes'
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
			slotRecipes: {
				popover: slotRecipes.popoverSlotRecipe,
				tooltip: slotRecipes.tooltipSlotRecipe
			},
			tokens: {
				easings: tokens.easings,
				zIndex: tokens.zIndices
			}
		}
	}
})

export default preset
