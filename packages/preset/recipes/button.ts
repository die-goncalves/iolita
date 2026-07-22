import { defineRecipe } from '@pandacss/dev'

export const buttonRecipe = defineRecipe({
	className: 'button',
	base: {
		position: 'relative',
		isolation: 'isolate',
		appearance: 'none',
		userSelect: 'none',
		cursor: 'pointer',
		display: 'inline-flex',
		width: 'fit-content',
		alignItems: 'center',
		justifyContent: 'center',
		whiteSpace: 'nowrap',
		verticalAlign: 'middle',
		flexShrink: 0,
		_disabled: { cursor: 'not-allowed' },
		_icon: { flexShrink: 0 },
		outlineStyle: 'none',
		outlineWidth: '2px',
		outlineOffset: '2px',
		outlineColor: 'transparent',
		_focusVisible: {
			outlineStyle: 'solid',
			outlineColor: 'token(colors.violet.800)',
			_after: {
				transitionProperty: 'background',
				transitionDuration: '200ms',
				transitionTimingFunction: 'token(easings.m3-exp-effects)'
			}
		},
		_hover: {
			_after: {
				transitionProperty: 'background',
				transitionDuration: '200ms',
				transitionTimingFunction: 'token(easings.m3-exp-effects)'
			}
		},
		_after: {
			content: '""',
			position: 'absolute',
			inset: 0,
			zIndex: -1,
			background: 'transparent',
			borderRadius: 'inherit',
			pointerEvents: 'none',
			transitionProperty: 'background',
			transitionDuration: '150ms',
			transitionTimingFunction: 'token(easings.m3-exp-fast-effects)'
		}
	},
	variants: {
		size: {
			sm: {
				height: '8',
				minWidth: '8',
				textStyle: 'sm',
				paddingInline: '3',
				gap: '1',
				_icon: { width: '4', height: '4' }
			},
			md: {
				height: '10',
				minWidth: '10',
				textStyle: 'md',
				paddingInline: '4',
				gap: '2',
				_icon: { width: '5', height: '5' }
			}
		},
		variant: {
			solid: {
				background: 'token(colors.violet.800)',
				color: 'token(colors.white)',
				_icon: { fill: 'token(colors.white)' },
				_disabled: {
					background: 'transparent',
					color: 'token(colors.black)/56',
					_icon: { fill: 'token(colors.black)/56' },
					_after: { background: 'token(colors.black)/10' }
				},
				_notDisabled: {
					_hover: { _after: { background: 'token(colors.white)/8' } },
					_focusVisible: {
						_after: { background: 'token(colors.white)/10' }
					}
				}
			},
			ghost: {
				color: 'token(colors.violet.800)',
				_icon: { fill: 'token(colors.violet.800)' },
				_disabled: {
					color: 'token(colors.black)/56',
					_icon: { fill: 'token(colors.black)/56' },
					_after: { background: 'token(colors.black)/10' }
				},
				_notDisabled: {
					_hover: { _after: { background: 'token(colors.violet.800)/8' } },
					_focusVisible: {
						_after: { background: 'token(colors.violet.800)/10' }
					}
				}
			}
		}
	},
	defaultVariants: { size: 'md', variant: 'ghost' },
	jsx: ['Button']
})
