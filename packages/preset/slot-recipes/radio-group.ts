import { defineSlotRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/radio-group'

const extendedAnatomy = anatomy.extendWith(
	'itemIndicator',
	'supportingText',
	'errorText'
)

export const radioGroupSlotRecipe = defineSlotRecipe({
	slots: extendedAnatomy.keys(),
	className: 'radio-group',
	base: {
		errorText: {
			display: 'inline-block',
			color: 'token(colors.red.900)',
			textStyle: 'sm',
			marginTop: '1',
			_firstLetter: { textTransform: 'uppercase' }
		},
		indicator: {},
		itemIndicator: {
			position: 'relative',
			_icon: {
				width: '5',
				height: '5',
				'& circle': {
					opacity: 0,
					transition: 'opacity 200ms token(easings.m3-exp-effects)'
				},
				transition: 'color 200ms token(easings.m3-exp-effects)'
			},
			_checked: {
				_icon: { '& circle': { opacity: 1 } }
			},
			_notDisabled: {
				_checked: { color: 'token(colors.violet.800)' }
			},
			_disabled: { _checked: { color: 'token(colors.black)' } }
		},
		item: {
			display: 'inline-flex',
			gap: '2',
			minHeight: '10',
			alignItems: 'center',
			cursor: 'pointer',
			width: 'fit-content',
			_disabled: {
				opacity: 0.56,
				cursor: 'not-allowed'
			}
		},
		itemControl: {
			position: 'relative',
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			alignSelf: 'start',
			flexShrink: 0,
			height: '10',
			minWidth: '10',
			outlineStyle: 'none',
			outlineWidth: '2px',
			outlineOffset: '2px',
			outlineColor: 'transparent',
			_focus: {
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
			_notDisabled: {
				_hover: {
					_after: {
						background: 'token(colors.black)/8'
					}
				},
				_focus: {
					_after: {
						background: 'token(colors.black)/10'
					}
				},
				_checked: {
					_hover: {
						_after: {
							background: 'token(colors.violet.800)/8'
						}
					},
					_focus: {
						_after: {
							background: 'token(colors.violet.800)/10'
						}
					}
				},
				_invalid: {
					_hover: {
						_after: {
							background: 'token(colors.red.900)/8'
						}
					},
					_focus: {
						_after: {
							background: 'token(colors.red.900)/10'
						}
					}
				}
			},
			_disabled: {
				_checked: {
					_after: {
						background: 'transparent'
					}
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
		itemText: {},
		label: {},
		root: {
			display: 'flex',
			position: 'relative',
			flexDirection: 'column',
			gap: '2'
		},
		supportingText: {
			display: 'inline-flex',
			flexDirection: 'column',
			textStyle: 'sm',
			marginTop: '1'
		}
	},
	jsx: [/\bRadioGroup\.\w+\b/]
})
