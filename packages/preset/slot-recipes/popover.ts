import { defineSlotRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/popover'

export const popoverSlotRecipe = defineSlotRecipe({
	className: 'popover',
	slots: anatomy.keys(),
	base: {
		anchor: {},
		arrow: {
			position: 'fixed !important',
			'--arrow-background': 'token(colors.white)',
			'--arrow-size': '16px'
		},
		arrowTip: {
			'--arrow-tip-size': 'calc(var(--arrow-size) * 0.7071)',
			boxSizing: 'border-box',
			width: 'var(--arrow-tip-size) !important',
			height: 'var(--arrow-tip-size) !important',
			top: '50% !important',
			left: '50% !important',
			translate: '-50% -50%',
			transformOrigin: 'center center',
			borderColor: 'var(--arrow-tip-border-color, token(colors.violet.900))',
			borderBlockStartWidth: 'var(--arrow-tip-border-width, 1px)',
			borderInlineStartWidth: 'var(--arrow-tip-border-width, 1px)',
			clipPath: 'polygon(0% 100%, 0% 0%, 100% 0%)'
		},
		closeTrigger: {},
		content: {
			position: 'relative',
			display: 'flex',
			flexDirection: 'column',
			gap: '2',
			overflow: 'auto',
			maxWidth: 'min(var(--sizes-80), var(--available-width))',
			maxHeight: 'var(--available-height)',
			boxShadow: 'md',
			background: 'token(colors.white)',
			color: 'token(colors.black)',
			textStyle: 'sm',
			paddingInline: '4',
			paddingBlock: '3',
			zIndex: 'calc(var(--z-index-popover) + var(--layer-index, 0))'
		},
		description: {},
		indicator: {},
		positioner: {},
		title: {},
		trigger: {}
	}
})
