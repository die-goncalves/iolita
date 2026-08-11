export const keyframes = {
	'slide-from-top': {
		from: { translate: '0 calc(var(--slide-offset, token(spacing.2)) * -1)' },
		to: { translate: '0' }
  },
  'slide-from-right': {
		from: { translate: 'var(--slide-offset, token(spacing.2)) 0' },
		to: { translate: '0' }
	},
	'slide-from-bottom': {
		from: { translate: '0 var(--slide-offset, token(spacing.2))' },
		to: { translate: '0' }
	},
	'slide-from-left': {
		from: { translate: 'calc(var(--slide-offset, token(spacing.2)) * -1) 0' },
		to: { translate: '0' }
	},
	'slide-to-top': {
		from: { translate: '0' },
		to: { translate: '0 calc(var(--slide-offset, token(spacing.2)) * -1)' }
  },
  'slide-to-right': {
		from: { translate: '0' },
		to: { translate: 'var(--slide-offset, token(spacing.2)) 0' }
	},
	'slide-to-bottom': {
		from: { translate: '0' },
		to: { translate: '0 var(--slide-offset, token(spacing.2))' }
	},
	'slide-to-left': {
		from: { translate: '0' },
		to: { translate: 'calc(var(--slide-offset, token(spacing.2)) * -1) 0' }
	},
	'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
	'fade-out': { from: { opacity: 1 }, to: { opacity: 0 } }
}
