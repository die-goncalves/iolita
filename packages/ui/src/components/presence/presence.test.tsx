import { createRef, useEffect, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, renderHook } from 'vitest-browser-react'
import { Presence } from '.'
import { type UsePresenceProps, usePresence } from './use-presence'
import type { PresenceContextProps } from './use-presence-context'

describe('presence', () => {
	afterEach(async () => {
		await cleanup()
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('root provider', () => {
		const setup = async (initialProps: UsePresenceProps) => {
			const { rerender, result } = await renderHook<
				UsePresenceProps,
				PresenceContextProps
			>(init => usePresence({ ...init }), { initialProps })
			const gate = () => (
				<Presence.RootProvider {...result.current}>
					<Presence.Gate data-testid="gate-el">content</Presence.Gate>
				</Presence.RootProvider>
			)
			const screen = await render(gate())
			const sync = async (
				props?: UsePresenceProps,
				callback?: () => void | Promise<void>
			) => {
				if (props) await rerender(props)
				if (callback) await callback()
				await screen.rerender(gate())
			}
			return { result, screen, sync }
		}

		it('provides presence context without owning its own machine', async () => {
			const { result } = await renderHook(() => usePresence({}))
			const screen = await render(
				<Presence.RootProvider {...result.current}>
					<Presence.Gate data-testid="gate-el">content</Presence.Gate>
				</Presence.RootProvider>
			)
			expect(screen.getByTestId('gate-el')).toBeInTheDocument()
		})

		describe('when animations are disabled', () => {
			it('unmounts immediately on exit when unmountOnExit is true', async () => {
				const { result, screen, sync } = await setup({
					present: false,
					unmountOnExit: true
				})
				await expect
					.element(screen.getByTestId('gate-el'))
					.not.toBeInTheDocument()
				await sync({ present: true, unmountOnExit: true })
				await expect.element(screen.getByTestId('gate-el')).toBeInTheDocument()
				await expect
					.element(screen.getByTestId('gate-el'))
					.toHaveAttribute('data-state', 'open')
				await sync({ present: false, unmountOnExit: true }, async () => {
					await vi.waitFor(() => {
						expect(result.current.present).toBe(false)
					})
				})
				await expect
					.element(screen.getByTestId('gate-el'))
					.not.toBeInTheDocument()
			})

			it('remains mounted on exit when unmountOnExit is false', async () => {
				const { result, screen, sync } = await setup({
					present: false,
					unmountOnExit: false
				})
				await expect.element(screen.getByTestId('gate-el')).toBeInTheDocument()
				await expect
					.element(screen.getByTestId('gate-el'))
					.toHaveAttribute('hidden')
				await sync({ present: true, unmountOnExit: false })
				await expect.element(screen.getByTestId('gate-el')).toBeInTheDocument()
				await expect
					.element(screen.getByTestId('gate-el'))
					.toHaveAttribute('data-state', 'open')
				await sync({ present: false, unmountOnExit: false }, async () => {
					await vi.waitFor(() => {
						expect(result.current.shouldUnmount).toBe(false)
						expect(result.current.getPresenceProps().hidden).toBe(true)
					})
				})
				expect(screen.getByTestId('gate-el')).toBeInTheDocument()
				await expect
					.element(screen.getByTestId('gate-el'))
					.toHaveAttribute('data-state', 'closed')
				await expect
					.element(screen.getByTestId('gate-el'))
					.toHaveAttribute('hidden')
			})
		})

		describe('when animations are enabled', () => {
			it('applies lifecycle states and unmounts after exit animation when unmountOnExit is true', async () => {
				const style = document.createElement('style')
				style.textContent = `
		          @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
		          @keyframes fade-out { from { opacity: 1 } to { opacity: 0 } }
		          [data-state="open"] { animation: fade-in 200ms linear; }
		          [data-state="closed"] { animation: fade-out 150ms linear; }
		        `
				document.head.appendChild(style)
				const { result, screen, sync } = await setup({
					present: false,
					unmountOnExit: true
				})
				await expect
					.element(screen.getByTestId('gate-el'))
					.not.toBeInTheDocument()
				await sync({ present: true, unmountOnExit: true }, async () => {
					await vi.waitFor(() => {
						expect(result.current.present).toBe(true)
					})
				})
				await expect.element(screen.getByTestId('gate-el')).toBeInTheDocument()
				await expect
					.element(screen.getByTestId('gate-el'))
					.toHaveAttribute('data-state', 'open')
				await sync({ present: false, unmountOnExit: true }, async () => {
					await vi.waitFor(() => {
						expect(result.current.present).toBe(false)
					})
				})
				await expect
					.element(screen.getByTestId('gate-el'))
					.not.toBeInTheDocument()
				document.head.removeChild(style)
			})

			it('applies lifecycle states and remains mounted after exit animation when unmountOnExit is false', async () => {
				const style = document.createElement('style')
				style.textContent = `
		          @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
		          @keyframes fade-out { from { opacity: 1 } to { opacity: 0 } }
		          [data-state="open"] { animation: fade-in 200ms linear; }
		          [data-state="closed"] { animation: fade-out 150ms linear; }
		        `
				document.head.appendChild(style)
				const { result, screen, sync } = await setup({
					present: false,
					unmountOnExit: false
				})
				await expect.element(screen.getByTestId('gate-el')).toBeInTheDocument()
				await expect
					.element(screen.getByTestId('gate-el'))
					.toHaveAttribute('hidden')
				await sync({ present: true, unmountOnExit: false }, async () => {
					await vi.waitFor(() => {
						expect(result.current.present).toBe(true)
					})
				})
				await expect.element(screen.getByTestId('gate-el')).toBeInTheDocument()
				await expect
					.element(screen.getByTestId('gate-el'))
					.toHaveAttribute('data-state', 'open')
				await sync({ present: false, unmountOnExit: false }, async () => {
					await vi.waitFor(() => {
						expect(result.current.present).toBe(false)
						expect(result.current.getPresenceProps().hidden).toBe(true)
					})
				})
				await expect.element(screen.getByTestId('gate-el')).toBeInTheDocument()
				await expect
					.element(screen.getByTestId('gate-el'))
					.toHaveAttribute('data-state', 'closed')
				await expect
					.element(screen.getByTestId('gate-el'))
					.toHaveAttribute('hidden')
				document.head.removeChild(style)
			})
		})
	})

	describe('use presence', () => {
		it('sets shouldUnmount to true only when present is false and unmountOnExit is true', async () => {
			const { result } = await renderHook<
				UsePresenceProps,
				PresenceContextProps
			>(initialProps => usePresence({ ...initialProps }), {
				initialProps: { unmountOnExit: true, present: false }
			})

			expect(result.current.shouldUnmount).toBe(true)
		})

		it('sets shouldUnmount to false when unmountOnExit is false, regardless of present', async () => {
			const { result } = await renderHook<
				UsePresenceProps,
				PresenceContextProps
			>(initialProps => usePresence({ ...initialProps }), {
				initialProps: { unmountOnExit: false, present: false }
			})
			expect(result.current.shouldUnmount).toBe(false)
		})

		it('getPresenceProps sets hidden to false whenever activity is true', async () => {
			const { result } = await renderHook<
				UsePresenceProps,
				PresenceContextProps
			>(initialProps => usePresence({ ...initialProps }), {
				initialProps: { present: false }
			})

			expect(result.current.getPresenceProps({ activity: true }).hidden).toBe(
				false
			)
		})

		it('getPresenceProps sets hidden to the inverse of present whenever activity is false', async () => {
			const { result } = await renderHook<
				UsePresenceProps,
				PresenceContextProps
			>(initialProps => usePresence({ ...initialProps }), {
				initialProps: { present: false }
			})

			expect(result.current.getPresenceProps({ activity: false }).hidden).toBe(
				true
			)
		})
	})

	describe('activity', () => {
		function EffectChild() {
			const [seconds, setSeconds] = useState(0)

			useEffect(() => {
				const interval = setInterval(() => {
					setSeconds(prev => prev + 1)
				}, 50)
				return () => {
					clearInterval(interval)
				}
			}, [])

			return <div data-testid="seconds">{seconds}</div>
		}

		function EffectParent({
			activity,
			...props
		}: UsePresenceProps & {
			activity?: boolean
		}) {
			const presence = usePresence(props)
			return (
				<Presence.RootProvider {...presence}>
					<Presence.Gate activity={activity} data-testid="gate-el">
						<EffectChild />
					</Presence.Gate>
				</Presence.RootProvider>
			)
		}

		const setup = async (
			props: UsePresenceProps & {
				activity?: boolean
			}
		) => {
			const setIntervalSpy = vi.spyOn(window, 'setInterval')
			const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
			const screen = await render(<EffectParent {...props} />)

			return { screen, setIntervalSpy, clearIntervalSpy }
		}

		it('pauses effects running while hidden when activity is true', async () => {
			vi.useFakeTimers()
			const { screen, setIntervalSpy, clearIntervalSpy } = await setup({
				activity: true,
				present: true
			})

			expect(setIntervalSpy).toHaveBeenCalledTimes(1)
			expect(clearIntervalSpy).not.toHaveBeenCalled()
			await vi.advanceTimersByTimeAsync(100)
			expect(Number(screen.getByTestId('seconds').element().textContent)).toBe(
				2
			)

			await screen.rerender(<EffectParent present={false} activity />)
			await vi.advanceTimersToNextTimerAsync()
			expect(screen.getByTestId('gate-el')).toHaveAttribute(
				'data-state',
				'closed'
			)
			expect(screen.getByTestId('gate-el')).toHaveStyle({ display: 'none' })
			expect(clearIntervalSpy).toHaveBeenCalledTimes(1)
			const secondsBeforeFinalAdvance = Number(
				screen.getByTestId('seconds').element().textContent
			)
			await vi.advanceTimersByTimeAsync(100)
			expect(Number(screen.getByTestId('seconds').element().textContent)).toBe(
				secondsBeforeFinalAdvance
			)
		})

		it('keeps effects running while hidden when activity is false', async () => {
			vi.useFakeTimers()
			const { screen, setIntervalSpy, clearIntervalSpy } = await setup({
				present: true
			})
			expect(setIntervalSpy).toHaveBeenCalledTimes(1)
			expect(clearIntervalSpy).not.toHaveBeenCalled()
			await vi.advanceTimersByTimeAsync(100)
			expect(Number(screen.getByTestId('seconds').element().textContent)).toBe(
				2
			)

			await screen.rerender(<EffectParent present={false} />)
			await vi.advanceTimersToNextTimerAsync()
			expect(screen.getByTestId('gate-el')).toHaveAttribute(
				'data-state',
				'closed'
			)
			expect(screen.getByTestId('gate-el')).toHaveAttribute('hidden')
			expect(clearIntervalSpy).not.toHaveBeenCalled()
			const secondsBeforeFinalAdvance = Number(
				screen.getByTestId('seconds').element().textContent
			)
			await vi.advanceTimersByTimeAsync(100)
			expect(Number(screen.getByTestId('seconds').element().textContent)).toBe(
				secondsBeforeFinalAdvance + 2
			)
		})
	})

	describe('gate', () => {
		it('attaches the ref to the underlying DOM node', async () => {
			const ref = createRef<HTMLDivElement>()
			await render(
				<Presence.Root present={true}>
					<Presence.Gate ref={ref}>content</Presence.Gate>
				</Presence.Root>
			)
			expect(ref.current).toBeInstanceOf(HTMLDivElement)
			expect(ref.current).toHaveAttribute('data-scope', 'presence')
		})
	})
})
