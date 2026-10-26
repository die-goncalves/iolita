import { defineSlotRecipe } from '@pandacss/dev'
import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('text-input').parts(
	'root',
	'label',
	'input',
	'supportingText',
	'errorText'
)

export const textInputRecipe = defineSlotRecipe({
	className: 'text-input',
	slots: anatomy.keys(),
	base: {
		root: {
			display: 'flex',
			flexDirection: 'column'
		},
		label: {
			display: 'inline-flex',
			marginBottom: '2'
		},
		input: {
			position: 'relative',
			appearance: 'none',
			width: 'full',
			minWidth: '0',
			height: 'token(sizes.14)',
			boxSizing: 'border-box',
			paddingInline: '4',
			background: 'transparent',
			color: 'token(colors.black)',
			textAlign: 'start',
			borderWidth: '2px',
			borderColor: 'token(colors.violet.800)',
			transitionProperty: 'border-color, outline-color',
			transitionDuration: '200ms',
			transitionTimingFunction: 'token(easings.m3-std-effects)',
			outlineStyle: 'solid',
			outlineWidth: '2px',
			outlineOffset: '2px',
			outlineColor: 'transparent',
			_placeholder: { color: 'token(colors.black)/56' },
			_focus: {
				outlineColor: 'token(colors.violet.800)'
			},
			'&:is([data-invalid], [aria-invalid=true])': {
				borderColor: 'token(colors.red.900)'
			},
			_disabled: {
				cursor: 'not-allowed',
				opacity: 0.56
			}
		},
		supportingText: {
			display: 'inline-flex',
			flexDirection: 'column',
			textStyle: 'sm',
			marginTop: '1'
		},
		errorText: {
			display: 'inline-block',
			color: 'token(colors.red.900)',
			textStyle: 'sm',
			marginTop: '1',
			_firstLetter: { textTransform: 'uppercase' }
		}
	},
	jsx: [/\bTextInput\.\w+\b/]
})
