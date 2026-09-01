import { defineSlotRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/dialog'

const extendedAnatomy = anatomy.extendWith('action', 'headline')

export const dialogSlotRecipe = defineSlotRecipe({
	slots: extendedAnatomy.keys(),
	className: 'dialog',
	base: {
		action: {
			display: 'flex',
			justifyContent: 'flex-end',
			paddingInline: '6',
			paddingBlockEnd: '6',
			marginBlockStart: '6'
		},
		backdrop: {
			position: 'fixed',
			inset: 0,
			background: 'token(colors.black)/50',
			backdropFilter: 'blur(8px)',
			zIndex: 'calc(var(--z-index-modal) + var(--layer-index, 0))'
		},
		closeTrigger: {},
		content: {
			position: 'relative',
			display: 'flex',
			flexDirection: 'column',
			overflow: 'auto',
			width: '100%',
			height: 'min-content',
			maxHeight: 'calc(100% - var(--spacing-12))',
			boxShadow: 'md',
			background: 'token(colors.white)',
			color: 'token(colors.black)',
			textStyle: 'md',
			zIndex: 'calc(var(--z-index-modal) + var(--layer-index, 0) + 1)'
		},
		description: {
			textWrap: 'pretty',
			paddingInline: '6',
			scrollbarWidth: 'auto',
			scrollbarColor: 'gray transparent'
		},
		headline: {
			display: 'flex',
			alignItems: 'start',
			justifyContent: 'space-between',
			paddingInline: '6',
			paddingBlockStart: '6',
			marginBlockEnd: '4'
		},
		positioner: {
			position: 'fixed',
			inset: 0,
			display: 'flex',
			zIndex: 'calc(var(--z-index-modal) + var(--layer-index, 0))'
		},
		title: {},
		trigger: {}
	},
	variants: {
		size: {
			xs: { content: { maxWidth: 'xs' } },
			sm: { content: { maxWidth: 'sm' } },
			md: { content: { maxWidth: 'md' } },
			lg: { content: { maxWidth: 'lg' } },
			xl: { content: { maxWidth: 'xl' } },
			full: {
				content: {
					maxWidth: '100dvw',
					maxHeight: '100dvh',
					height: '100%'
				}
			}
		},
		scrollBehavior: {
			inside: {
				positioner: { overflow: 'hidden' },
				description: {
					flex: '1',
					minHeight: '0',
					overflow: 'auto'
				}
			},
			outside: {
				positioner: { overflow: 'auto', pointerEvents: 'auto' },
				content: { marginBlock: '6', maxHeight: 'none' }
			}
		},
		placement: {
			center: {
				positioner: { alignItems: 'safe center', justifyContent: 'center' }
			},
			top: {
				positioner: { alignItems: 'safe flex-start', justifyContent: 'center' },
				content: { marginBlockStart: '6' }
			},
			bottom: {
				positioner: { alignItems: 'safe flex-end', justifyContent: 'center' },
				content: { marginBlockEnd: '6' }
			}
		}
	},
	compoundVariants: [
		{
			size: 'full',
			scrollBehavior: 'outside',
			css: { content: { marginBlock: '0' } }
		}
	],
	defaultVariants: {
		placement: 'center',
		size: 'md',
		scrollBehavior: 'inside'
	},
	jsx: [/\bDialog\.\w+\b/]
})
