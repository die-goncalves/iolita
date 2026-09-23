import { defineSlotRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/menu'

const extendedAnatomy = anatomy.extendWith('surface')

export const menuSlotRecipe = defineSlotRecipe({
	className: 'menu',
	slots: extendedAnatomy.keys(),
	base: {
		arrow: {
			position: 'fixed !important',
			'--arrow-background': 'token(colors.white)',
			'--arrow-size': '16px',
			zIndex: 'calc(var(--z-index-dropdown) + var(--layer-index, 0))'
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
			display: 'flex',
			flexDirection: 'column',
			minWidth: 'min(var(--sizes-52), var(--available-width))',
			maxWidth: 'var(--available-width)',
			maxHeight: 'var(--available-height)',
			zIndex: 'calc(var(--z-index-dropdown) + var(--layer-index, 0))',
			transformOrigin: 'var(--transform-origin)',
			outline: 0,
			fontSize: 'sm',
			lineHeight: 'tight'
		},
		contextTrigger: {},
		indicator: {
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexShrink: '0'
		},
		item: {
			display: 'flex',
			alignItems: 'flex-start',
			cursor: 'pointer',
			userSelect: 'none',
			paddingBlock: '2',
			paddingInline: '3',
			'& > *:first-child:not(span)': {
				marginInlineEnd: '2'
			},
			'& > span': {
				flexGrow: 1,
				paddingBlock: 'calc((var(--sizes-6) - 1lh) / 2)'
			},
			_highlighted: {
				background: 'token(colors.violet.100)'
			},
			'&[role=menuitem]': {
				'& > div': {
					display: 'flex',
					alignSelf: 'start',
					padding: '0.5',
					fontSize: 'xl',
					width: '6',
					height: '6',
					_icon: {
						width: '5',
						height: '5',
						flexShrink: 0
					}
				},
				'& > span + *:not(kbd)': {
					marginInlineStart: '2'
				},
				'& > kbd': {
					marginInlineStart: '2',
					paddingBlock: 'calc((var(--sizes-6) - 1lh) / 2)'
				}
			},
			'&[role=menuitemcheckbox]': {},
			'&[role=menuitemradio]': {}
		},
		itemGroup: {
			background: 'token(colors.white)',
			color: 'token(colors.black)',
			position: 'relative',
			display: 'flex',
			flexDirection: 'column',
			gap: '1',
			padding: '1'
		},
		itemGroupLabel: {
			display: 'flex',
			alignItems: 'center',
			userSelect: 'none',
			paddingBlock: 'calc((var(--sizes-8) - 1lh) / 2)',
			paddingInline: '3',
			opacity: 0.72
		},
		itemIndicator: {
			display: 'flex',
			alignSelf: 'start',
			padding: '0.5',
			fontSize: 'xl',
			width: '6',
			height: '6',
			_icon: {
				width: '5',
				height: '5',
				flexShrink: 0
			}
		},
		itemText: {
			paddingBlock: 'calc((var(--sizes-6) - 1lh) / 2)'
		},
		positioner: {},
		separator: {
			all: 'unset',
			position: 'relative',
			flex: 'none',
			border: 'none',
			height: '1px',
			background: 'transparent',
			_after: {
				content: "''",
				position: 'absolute',
				inset: 0,
				marginInline: '3',
				background: 'token(colors.violet.800)'
			}
		},
		surface: {
			background: 'token(colors.white)',
			color: 'token(colors.black)',
			position: 'relative',
			display: 'flex',
			flexDirection: 'column',
			gap: '1',
			padding: '1'
		},
		trigger: {},
		triggerItem: {
			display: 'flex',
			alignItems: 'center',
			cursor: 'pointer',
			userSelect: 'none',
			paddingBlock: '2',
			paddingInline: '3',
			'& > div': {
				display: 'flex',
				alignSelf: 'start',
				padding: '0.5',
				fontSize: 'xl',
				width: '6',
				height: '6',
				_icon: {
					width: '5',
					height: '5',
					flexShrink: 0
				}
			},
			'& > *:first-child:not(span)': {
				marginInlineEnd: '2'
			},
			'& > span': {
				flexGrow: 1,
				paddingBlock: 'calc((var(--sizes-6) - 1lh) / 2)'
			},
			'& > span + *:not(kbd)': {
				marginInlineStart: '2'
			},
			'& > kbd': {
				marginInlineStart: '2',
				paddingBlock: 'calc((var(--sizes-6) - 1lh) / 2)'
			},
			_highlighted: {
				background: 'token(colors.violet.100)'
			}
		}
	},
	variants: {
		gap: {
			true: {
				content: { overflow: 'visible', gap: '0.5' },
				itemGroup: {
					boxShadow: 'md',
					overflowY: 'auto',
					overflowX: 'hidden',
					flex: '1 1 auto',
					minHeight: 'calc(var(--sizes-10) + var(--sizes-2))'
				},
				surface: {
					boxShadow: 'md',
					overflowY: 'auto',
					overflowX: 'hidden',
					flex: '1 1 auto',
					minHeight: 'calc(var(--sizes-10) + var(--sizes-2))'
				}
			},
			false: {
				content: {
					background: 'token(colors.white)',
					color: 'token(colors.black)',
					boxShadow: 'md',
					overflow: 'auto'
				}
			}
		}
	},
	defaultVariants: {
		gap: false
	},
	jsx: [/\bMenu\.\w+\b/]
})
