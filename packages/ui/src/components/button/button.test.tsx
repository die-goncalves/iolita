import { composeStories } from '@storybook/react-vite'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render } from 'vitest-browser-react'
import * as stories from './button.stories'

const { LoadingWithStatusAnnouncement, Loading, Overview, Disabled } =
	composeStories(stories)

describe('button', () => {
	afterEach(() => {
		cleanup()
		vi.clearAllMocks()
	})

	describe('state transitions via rerender', () => {
		it('enters loading state without losing focus', async () => {
			const user = userEvent.setup()
			const screen = await render(<Overview />)
			const button = screen.getByRole('button')

			button.element().focus()
			await expect.element(button).toHaveFocus()

			screen.rerender(<Overview {...Loading.args} />)

			await expect.element(button).toHaveAttribute('aria-busy', 'true')
			await expect.element(button).toHaveAttribute('aria-disabled', 'true')
			await expect.element(button).toHaveFocus()
			expect(button.element().getAttribute('disabled')).toBeNull()

			await user.click(button, { force: true })
			expect(Loading.args.onClick).not.toHaveBeenCalled()
		})

		it('clears loading attributes and keeps focus when loading ends', async () => {
			const user = userEvent.setup()
			const screen = await render(<Overview {...Loading.args} />)
			const button = screen.getByRole('button')

			screen.rerender(<Overview />)

			await expect.element(button).not.toHaveAttribute('aria-busy')
			await expect.element(button).not.toHaveAttribute('aria-disabled')

			await user.click(button)
			expect(Overview.args.onClick).toHaveBeenCalledOnce()
		})
	})

	describe('async loading cycle (status announcement)', () => {
		it('announces status on click and clears it after resolution', async () => {
			const { promise, resolve } = Promise.withResolvers<void>()
			LoadingWithStatusAnnouncement.args.onClick?.mockImplementation(
				() => promise
			)

			const screen = await render(<LoadingWithStatusAnnouncement />)
			const user = userEvent.setup()
			const button = screen.getByRole('button')
			const status = screen.getByRole('status')

			await expect.element(button).not.toHaveAttribute('aria-busy')
			await expect.element(status).toHaveTextContent('')

			await user.click(button)

			await expect.element(button).toHaveAttribute('aria-busy', 'true')
			await expect.element(status).toHaveTextContent('Salvando alterações')

			expect(LoadingWithStatusAnnouncement.args.onClick).toHaveBeenCalledOnce()
			resolve()

			await expect.element(button).not.toHaveAttribute('aria-busy')
			await expect.element(status).toHaveTextContent('')
		})
	})

	describe('prop combinations', () => {
		it('gives disabled priority over loading when both are passed', async () => {
			const screen = await render(<Disabled {...Disabled.args} loading />)
			const button = screen.getByRole('button')

			await expect.element(button).toBeDisabled()
			await expect.element(button).toHaveAttribute('aria-busy', 'true')
		})
	})
})
