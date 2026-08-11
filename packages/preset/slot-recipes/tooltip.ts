import { defineSlotRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/tooltip'

export const tooltipSlotRecipe = defineSlotRecipe({
	className: 'tooltip',
	slots: anatomy.keys(),
	base: {
		arrow: {
			'--arrow-background': 'token(colors.violet.800)',
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
		content: {
			position: 'relative',
			overflow: 'auto',
			maxWidth: 'var(--available-width)',
			maxHeight: 'var(--available-height)',
			boxShadow: 'md',
			background: 'token(colors.violet.800)',
			color: 'token(colors.white)',
			textStyle: 'sm',
			paddingInline: '2',
			paddingBlock: '1'
		},
		positioner: {},
		trigger: {}
	}
})
