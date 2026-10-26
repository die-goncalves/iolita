import { createRef, StrictMode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render, renderHook } from 'vitest-browser-react'
import { TextInput } from '.'
import {
	type UseTextInputProps,
	type UseTextInputReturn,
	useTextInput
} from './use-text-input'
import { useTextInputContext } from './use-text-input-context'

describe('text-input', () => {
	afterEach(async () => {
		await cleanup()
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('rendering', () => {
		it('applies data-scope and data-part attributes to every part', async () => {
			const screen = await render(
				<TextInput.Root data-testid="root" invalid>
					<TextInput.Label data-testid="label">Label</TextInput.Label>
					<TextInput.Input data-testid="input" />
					<TextInput.SupportingText data-testid="supporting-text">
						Some supporting text.
					</TextInput.SupportingText>
					<TextInput.ErrorText data-testid="error-text">
						Some error text.
					</TextInput.ErrorText>
				</TextInput.Root>
			)

			const parts = {
				root: screen.getByTestId('root'),
				label: screen.getByTestId('label'),
				input: screen.getByTestId('input'),
				'supporting-text': screen.getByTestId('supporting-text'),
				'error-text': screen.getByTestId('error-text')
			}

			for (const [part, locator] of Object.entries(parts)) {
				await expect
					.element(locator)
					.toHaveAttribute('data-scope', 'text-input')
				await expect.element(locator).toHaveAttribute('data-part', part)
			}
		})

		it('merges custom classNames with styled-system recipe classes across all subcomponents', async () => {
			const screen = await render(
				<TextInput.Root data-testid="root" className="custom-root" invalid>
					<TextInput.Label data-testid="label" className="custom-label">
						Label
					</TextInput.Label>
					<TextInput.Input data-testid="input" className="custom-input" />
					<TextInput.SupportingText
						data-testid="supporting-text"
						className="custom-supportingText"
					>
						Some supporting text.
					</TextInput.SupportingText>
					<TextInput.ErrorText
						data-testid="error-text"
						className="custom-errorText"
					>
						Some error text.
					</TextInput.ErrorText>
				</TextInput.Root>
			)

			function expectClasses(part: string, classPart = part) {
				const element = screen.getByScopeAndPart('text-input', part)
				expect(element).toHaveClass(`text-input__${classPart}`)
				expect(element).toHaveClass(`custom-${classPart}`)
			}

			const partClassNames = {
				root: 'root',
				label: 'label',
				input: 'input',
				'supporting-text': 'supportingText',
				'error-text': 'errorText'
			} as const

			for (const [part, classPart] of Object.entries(partClassNames)) {
				expectClasses(part, classPart)
			}
		})

		it('forwards refs to underlying DOM nodes across all subcomponents', async () => {
			const rootRef = createRef<HTMLDivElement>()
			const labelRef = createRef<HTMLLabelElement>()
			const inputRef = createRef<HTMLInputElement>()
			const supportingTextRef = createRef<HTMLSpanElement>()
			const errorTextRef = createRef<HTMLSpanElement>()

			await render(
				<TextInput.Root ref={rootRef} invalid>
					<TextInput.Label ref={labelRef}>Label</TextInput.Label>
					<TextInput.Input ref={inputRef} />
					<TextInput.SupportingText ref={supportingTextRef}>
						Some supporting text.
					</TextInput.SupportingText>
					<TextInput.ErrorText ref={errorTextRef}>
						Some error text.
					</TextInput.ErrorText>
				</TextInput.Root>
			)

			expect(rootRef.current).toBeInstanceOf(HTMLDivElement)
			expect(labelRef.current).toBeInstanceOf(HTMLLabelElement)
			expect(inputRef.current).toBeInstanceOf(HTMLInputElement)
			expect(supportingTextRef.current).toBeInstanceOf(HTMLSpanElement)
			expect(errorTextRef.current).toBeInstanceOf(HTMLSpanElement)
		})
	})

	describe('label association', () => {
		it('focuses the input when the label is clicked', async () => {
			const user = userEvent.setup()
			const screen = await render(
				<TextInput.Root>
					<TextInput.Label data-testid="label">Label</TextInput.Label>
					<TextInput.Input data-testid="input" />
				</TextInput.Root>
			)

			await expect.element(screen.getByTestId('input')).not.toHaveFocus()

			await user.click(screen.getByTestId('label'))

			await expect.element(screen.getByTestId('input')).toHaveFocus()
		})
	})

	describe('supporting text', () => {
		it('keeps aria-describedby registered under StrictMode double-invocation of effects', async () => {
			const screen = await render(
				<StrictMode>
					<TextInput.Root>
						<TextInput.Label>Label</TextInput.Label>
						<TextInput.Input data-testid="input" />
						<TextInput.SupportingText data-testid="supporting-text">
							Some supporting text.
						</TextInput.SupportingText>
					</TextInput.Root>
				</StrictMode>
			)

			await expect
				.element(screen.getByTestId('input'))
				.toHaveAttribute(
					'aria-describedby',
					screen.getByTestId('supporting-text').element().id
				)
		})
	})

	describe('error text', () => {
		it('toggle the error id in aria-describedby as the field toggles between valid and invalid', async () => {
			const textInput = (invalid: boolean) => (
				<TextInput.Root invalid={invalid}>
					<TextInput.Label>Label</TextInput.Label>
					<TextInput.Input data-testid="input" />
					<TextInput.ErrorText data-testid="error-text">
						Some error text.
					</TextInput.ErrorText>
				</TextInput.Root>
			)

			const screen = await render(textInput(false))
			const input = screen.getByTestId('input')
			await expect.element(input).not.toHaveAttribute('aria-describedby')

			await screen.rerender(textInput(true))

			const errorText = screen.getByTestId('error-text')
			await expect.element(errorText).toHaveAttribute('role', 'alert')
			await expect
				.element(input)
				.toHaveAttribute(
					'aria-describedby',
					screen.getByTestId('error-text').element().id
				)

			await screen.rerender(textInput(false))

			await expect.element(input).not.toHaveAttribute('aria-describedby')
		})
	})

	describe('ids', () => {
		it('derives the ids of every part from the provided id', async () => {
			const screen = await render(
				<TextInput.Root data-testid="root" id="my-field" invalid>
					<TextInput.Label data-testid="label">Label</TextInput.Label>
					<TextInput.Input data-testid="input" />
					<TextInput.SupportingText data-testid="supporting-text">
						Some supporting text.
					</TextInput.SupportingText>
					<TextInput.ErrorText data-testid="error-text">
						Some error text.
					</TextInput.ErrorText>
				</TextInput.Root>
			)

			await expect
				.element(screen.getByTestId('root'))
				.toHaveAttribute('id', 'text-input:my-field:root')
			await expect
				.element(screen.getByTestId('label'))
				.toHaveAttribute('id', 'text-input:my-field:label')
			await expect
				.element(screen.getByTestId('input'))
				.toHaveAttribute('id', 'text-input:my-field:input')
			await expect
				.element(screen.getByTestId('supporting-text'))
				.toHaveAttribute('id', 'text-input:my-field:supporting-text')
			await expect
				.element(screen.getByTestId('error-text'))
				.toHaveAttribute('id', 'text-input:my-field:error-text')
		})
	})

	describe('use-text-input', () => {
		it('generates an id when none is provided', async () => {
			const { result } = await renderHook(() => useTextInput({}))
			const { api } = result.current

			await vi.waitFor(() => {
				expect(api.getRootProps().id).toBeTruthy()
				expect(api.getLabelProps().id).toBeTruthy()
				expect(api.getInputProps().id).toBeTruthy()
				expect(api.getSupportingTextProps().id).toBeTruthy()
				expect(api.getErrorTextProps().id).toBeTruthy()
			})
		})

		it('applies custom ID across all subcomponents when explicitly configured', async () => {
			const { result } = await renderHook(() =>
				useTextInput({ id: 'custom-id' })
			)
			const { api } = result.current

			expect(api.getRootProps().id).toBe('text-input:custom-id:root')
			expect(api.getLabelProps().id).toBe('text-input:custom-id:label')
			expect(api.getInputProps().id).toBe('text-input:custom-id:input')
			expect(api.getSupportingTextProps().id).toBe(
				'text-input:custom-id:supporting-text'
			)
			expect(api.getErrorTextProps().id).toBe('text-input:custom-id:error-text')
		})

		it('prioritizes ids over the id-derived values', async () => {
			const { result } = await renderHook(() =>
				useTextInput({ id: 'custom-id', ids: { input: 'my-input' } })
			)
			const { api } = result.current

			expect(api.getInputProps().id).toBe('my-input')
			expect(api.getLabelProps().id).toBe('text-input:custom-id:label')
			expect(api.getLabelProps().htmlFor).toBe('my-input')
			expect(api.getRootProps().id).toBe('text-input:custom-id:root')
		})

		it('keeps a stable register reference between renders', async () => {
			const { result, rerender } = await renderHook(() => useTextInput({}))
			const first = result.current.register

			await rerender()

			expect(result.current.register).toBe(first)
		})
	})

	describe('use-text-input-context', () => {
		it('throws error when useTextInputContext is used outside a TextInputProvider', async () => {
			await expect(async () => {
				await renderHook(() => useTextInputContext())
			}).rejects.toThrow(
				'useTextInputContext must be used within a TextInputProvider'
			)
		})

		it('returns the api, register and styles when used inside TextInput.Root', async () => {
			let contextValue: ReturnType<typeof useTextInputContext> | undefined

			const Consumer = () => {
				contextValue = useTextInputContext()
				return null
			}

			await render(
				<TextInput.Root invalid>
					<Consumer />
					<TextInput.Label>Label</TextInput.Label>
					<TextInput.Input />
				</TextInput.Root>
			)

			await vi.waitFor(() => {
				expect(contextValue).toBeDefined()
			})

			expect(contextValue?.api).toMatchObject({ invalid: true })
			expect(contextValue?.api).toHaveProperty('getInputProps')
			expect(contextValue?.register).toHaveProperty('supportingText')
			expect(contextValue?.register).toHaveProperty('errorText')
			expect(contextValue?.styles).toHaveProperty('root')
			expect(contextValue?.styles).toHaveProperty('input')
		})
	})

	describe('root provider', () => {
		const setup = async (initialProps: UseTextInputProps) => {
			const { rerender, result } = await renderHook<
				UseTextInputProps,
				UseTextInputReturn
			>(init => useTextInput(init ? { ...init } : {}), { initialProps })

			const gate = () => (
				<TextInput.RootProvider data-testid="root" {...result.current}>
					<TextInput.Label data-testid="label">Label</TextInput.Label>
					<TextInput.Input data-testid="input" />
					<TextInput.ErrorText data-testid="error-text">
						Some error text.
					</TextInput.ErrorText>
				</TextInput.RootProvider>
			)

			const screen = await render(gate())

			const sync = async (
				props?: UseTextInputProps,
				callback?: () => void | Promise<void>
			) => {
				if (props) await rerender(props)
				if (callback) await callback()
				await screen.rerender(gate())
			}

			return { result, screen, sync }
		}

		it('provides text input context using an externally managed state', async () => {
			const { screen } = await setup({
				required: true,
				invalid: true
			})

			const input = screen.getByTestId('input')

			await expect.element(screen.getByTestId('root')).toBeInTheDocument()
			await expect.element(input).toBeRequired()
			await expect.element(input).toHaveAttribute('aria-invalid', 'true')
			await expect.element(screen.getByTestId('error-text')).toBeVisible()
		})

		it('reflects external state updates when the provider is rendered again', async () => {
			const { screen, sync } = await setup({
				invalid: false
			})

			await expect
				.element(screen.getByTestId('input'))
				.not.toHaveAttribute('aria-invalid')

			await sync({ invalid: true })

			await expect
				.element(screen.getByTestId('input'))
				.toHaveAttribute('aria-invalid', 'true')
		})
	})
})
