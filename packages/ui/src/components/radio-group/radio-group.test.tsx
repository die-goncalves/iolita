import { createRef, StrictMode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render, renderHook } from 'vitest-browser-react'
import { RadioGroup, type UseRadioGroupProps, useRadioGroup } from '.'
import type { UseRadioGroupReturn } from './use-radio-group'
import { useRadioGroupContext } from './use-radio-group-context'

const options = ['option-1', 'option-2'] as const
type Options = (typeof options)[number]
type FieldOptions = { value: Options; label: string }
const fieldOptions = [
	{ value: 'option-1', label: 'Option 1' },
	{ value: 'option-2', label: 'Option 2' }
] as const satisfies readonly FieldOptions[]

function Items() {
	return fieldOptions.map(option => (
		<RadioGroup.Item key={option.value} value={option.value}>
			<RadioGroup.ItemHiddenInput />
			<RadioGroup.ItemControl>
				<RadioGroup.ItemIndicator />
			</RadioGroup.ItemControl>
			<RadioGroup.ItemText>{option.label}</RadioGroup.ItemText>
		</RadioGroup.Item>
	))
}

describe('radio-group', () => {
	afterEach(async () => {
		await cleanup()
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('rendering', () => {
		it('applies data-scope and data-part attributes to every part', async () => {
			const screen = await render(
				<RadioGroup.Root data-testid="root" invalid>
					<RadioGroup.Label data-testid="label">Label</RadioGroup.Label>
					<RadioGroup.Item data-testid="item" value="option-1">
						<RadioGroup.ItemHiddenInput />
						<RadioGroup.ItemControl data-testid="item-control">
							<RadioGroup.ItemIndicator data-testid="item-indicator" />
						</RadioGroup.ItemControl>
						<RadioGroup.ItemText data-testid="item-text">
							Option 1
						</RadioGroup.ItemText>
					</RadioGroup.Item>
					<RadioGroup.SupportingText data-testid="supporting-text">
						Some supporting text.
					</RadioGroup.SupportingText>
					<RadioGroup.ErrorText data-testid="error-text">
						Some error text.
					</RadioGroup.ErrorText>
				</RadioGroup.Root>
			)

			const parts = [
				'root',
				'label',
				'item',
				'item-control',
				'item-indicator',
				'item-text',
				'supporting-text',
				'error-text'
			]

			for (const part of parts) {
				const locator = screen.getByTestId(part)

				await expect
					.element(locator)
					.toHaveAttribute('data-scope', 'radio-group')
				await expect.element(locator).toHaveAttribute('data-part', part)
			}
		})

		it('merges custom classNames with styled-system recipe classes across all subcomponents', async () => {
			const screen = await render(
				<RadioGroup.Root data-testid="root" className="custom-root" invalid>
					<RadioGroup.Label data-testid="label" className="custom-label">
						Label
					</RadioGroup.Label>
					<RadioGroup.Item
						data-testid="item"
						className="custom-item"
						value="option-1"
					>
						<RadioGroup.ItemHiddenInput />
						<RadioGroup.ItemControl
							data-testid="itemControl"
							className="custom-itemControl"
						>
							<RadioGroup.ItemIndicator
								data-testid="itemIndicator"
								className="custom-itemIndicator"
							/>
						</RadioGroup.ItemControl>
						<RadioGroup.ItemText
							data-testid="itemText"
							className="custom-itemText"
						>
							Option 1
						</RadioGroup.ItemText>
					</RadioGroup.Item>
					<RadioGroup.SupportingText
						data-testid="supportingText"
						className="custom-supportingText"
					>
						Some supporting text.
					</RadioGroup.SupportingText>
					<RadioGroup.ErrorText
						data-testid="errorText"
						className="custom-errorText"
					>
						Some error text.
					</RadioGroup.ErrorText>
				</RadioGroup.Root>
			)

			const classParts = [
				'root',
				'label',
				'item',
				'itemControl',
				'itemIndicator',
				'itemText',
				'supportingText',
				'errorText'
			]

			for (const part of classParts) {
				const element = screen.getByTestId(part)

				await expect.element(element).toHaveClass(`radio-group__${part}`)
				await expect.element(element).toHaveClass(`custom-${part}`)
			}
		})

		it('forwards refs to underlying DOM nodes across all subcomponents', async () => {
			const rootRef = createRef<HTMLDivElement>()
			const labelRef = createRef<HTMLDivElement>()
			const itemRef = createRef<HTMLLabelElement>()
			const hiddenInputRef = createRef<HTMLInputElement>()
			const itemControlRef = createRef<HTMLDivElement>()
			const itemIndicatorRef = createRef<HTMLDivElement>()
			const itemTextRef = createRef<HTMLDivElement>()
			const supportingTextRef = createRef<HTMLSpanElement>()
			const errorTextRef = createRef<HTMLSpanElement>()

			await render(
				<RadioGroup.Root ref={rootRef} invalid>
					<RadioGroup.Label ref={labelRef}>Label</RadioGroup.Label>
					<RadioGroup.Item ref={itemRef} value="option-1">
						<RadioGroup.ItemHiddenInput ref={hiddenInputRef} />
						<RadioGroup.ItemControl ref={itemControlRef}>
							<RadioGroup.ItemIndicator ref={itemIndicatorRef} />
						</RadioGroup.ItemControl>
						<RadioGroup.ItemText ref={itemTextRef}>
							Option 1
						</RadioGroup.ItemText>
					</RadioGroup.Item>
					<RadioGroup.SupportingText ref={supportingTextRef}>
						Some supporting text.
					</RadioGroup.SupportingText>
					<RadioGroup.ErrorText ref={errorTextRef}>
						Some error text.
					</RadioGroup.ErrorText>
				</RadioGroup.Root>
			)

			expect(rootRef.current).toBeInstanceOf(HTMLDivElement)
			expect(labelRef.current).toBeInstanceOf(HTMLDivElement)
			expect(itemRef.current).toBeInstanceOf(HTMLLabelElement)
			expect(hiddenInputRef.current).toBeInstanceOf(HTMLInputElement)
			expect(itemControlRef.current).toBeInstanceOf(HTMLDivElement)
			expect(itemIndicatorRef.current).toBeInstanceOf(HTMLDivElement)
			expect(itemTextRef.current).toBeInstanceOf(HTMLDivElement)
			expect(supportingTextRef.current).toBeInstanceOf(HTMLSpanElement)
			expect(errorTextRef.current).toBeInstanceOf(HTMLSpanElement)
		})
	})

	describe('error text', () => {
		it('does not render when the group is valid', async () => {
			const screen = await render(
				<RadioGroup.Root>
					<RadioGroup.Label>Label</RadioGroup.Label>
					<Items />
					<RadioGroup.ErrorText data-testid="error-text">
						Some error text.
					</RadioGroup.ErrorText>
				</RadioGroup.Root>
			)

			await expect.element(screen.getByRole('radiogroup')).toBeInTheDocument()
			await expect
				.element(screen.getByTestId('error-text'))
				.not.toBeInTheDocument()
		})

		it('renders with role alert when the group is invalid', async () => {
			const screen = await render(
				<RadioGroup.Root invalid>
					<RadioGroup.Label>Label</RadioGroup.Label>
					<Items />
					<RadioGroup.ErrorText data-testid="error-text">
						Some error text.
					</RadioGroup.ErrorText>
				</RadioGroup.Root>
			)

			await expect
				.element(screen.getByTestId('error-text'))
				.toHaveAttribute('role', 'alert')
		})

		it('associates the error text with the group using aria-describedby', async () => {
			const screen = await render(
				<RadioGroup.Root invalid>
					<RadioGroup.Label>Label</RadioGroup.Label>
					<Items />
					<RadioGroup.ErrorText data-testid="error-text">
						Some error text.
					</RadioGroup.ErrorText>
				</RadioGroup.Root>
			)

			const group = screen.getByRole('radiogroup')
			const errorText = screen.getByTestId('error-text')

			await expect
				.element(group)
				.toHaveAttribute('aria-describedby', errorText.element().id)
		})

		it('toggles the error id in aria-describedby as the group toggles between valid and invalid', async () => {
			const radioGroup = (invalid: boolean) => (
				<RadioGroup.Root invalid={invalid}>
					<RadioGroup.Label>Label</RadioGroup.Label>
					<Items />
					<RadioGroup.ErrorText data-testid="error-text">
						Some error text.
					</RadioGroup.ErrorText>
				</RadioGroup.Root>
			)

			const screen = await render(radioGroup(false))
			const group = screen.getByRole('radiogroup')

			await expect.element(group).not.toHaveAttribute('aria-describedby')

			await screen.rerender(radioGroup(true))

			await expect
				.element(group)
				.toHaveAttribute(
					'aria-describedby',
					screen.getByTestId('error-text').element().id
				)

			await screen.rerender(radioGroup(false))

			await expect.element(group).not.toHaveAttribute('aria-describedby')
		})
	})

	describe('supporting text', () => {
		it('keeps aria-describedby registered under StrictMode double-invocation of effects', async () => {
			const screen = await render(
				<StrictMode>
					<RadioGroup.Root>
						<RadioGroup.Label>Label</RadioGroup.Label>
						<Items />
						<RadioGroup.SupportingText data-testid="supporting-text">
							Some supporting text.
						</RadioGroup.SupportingText>
					</RadioGroup.Root>
				</StrictMode>
			)

			await expect
				.element(screen.getByRole('radiogroup'))
				.toHaveAttribute(
					'aria-describedby',
					screen.getByTestId('supporting-text').element().id
				)
		})

		it('delegates rendering and radio group attributes directly to the child element', async () => {
			const ref = createRef<HTMLParagraphElement>()

			const screen = await render(
				<RadioGroup.Root>
					<RadioGroup.Label>Label</RadioGroup.Label>
					<Items />
					<RadioGroup.SupportingText asChild ref={ref}>
						<p data-testid="supporting-text">Some supporting text.</p>
					</RadioGroup.SupportingText>
				</RadioGroup.Root>
			)

			const supportingText = screen.getByTestId('supporting-text')

			expect(supportingText.element().tagName).toBe('P')
			await expect
				.element(supportingText)
				.toHaveAttribute('data-scope', 'radio-group')
			await expect
				.element(supportingText)
				.toHaveAttribute('data-part', 'supporting-text')
			expect(ref.current).toBe(supportingText.element())
			await expect
				.element(screen.getByRole('radiogroup'))
				.toHaveAttribute('aria-describedby', supportingText.element().id)
		})
	})

	describe('item indicator', () => {
		it('marks only the indicator of the selected item as checked', async () => {
			const user = userEvent.setup()
			const screen = await render(
				<RadioGroup.Root>
					<RadioGroup.Label>Label</RadioGroup.Label>
					<Items />
				</RadioGroup.Root>
			)

			const items = screen.getByScopeAndPart('radio-group', 'item')

			await expect
				.element(items.nth(0))
				.toHaveAttribute('data-state', 'unchecked')
			await expect
				.element(items.nth(1))
				.toHaveAttribute('data-state', 'unchecked')

			await user.click(screen.getByText('Option 2'))

			await expect
				.element(items.nth(0))
				.toHaveAttribute('data-state', 'unchecked')
			await expect
				.element(items.nth(1))
				.toHaveAttribute('data-state', 'checked')

			await user.click(screen.getByText('Option 1'))

			await expect
				.element(items.nth(0))
				.toHaveAttribute('data-state', 'checked')
			await expect
				.element(items.nth(1))
				.toHaveAttribute('data-state', 'unchecked')
		})

		it('reflects the group disabled and invalid state through data attributes', async () => {
			const screen = await render(
				<RadioGroup.Root disabled invalid>
					<RadioGroup.Label>Label</RadioGroup.Label>
					<Items />
				</RadioGroup.Root>
			)

			const items = screen.getByScopeAndPart('radio-group', 'item-indicator')
			await expect
				.element(items.nth(0))
				.toHaveAttribute('data-state', 'unchecked')

			await expect.element(items.nth(0)).toHaveAttribute('data-disabled')
			await expect.element(items.nth(0)).toHaveAttribute('data-invalid')
		})

		it('reflects a single disabled item without affecting its siblings', async () => {
			const screen = await render(
				<RadioGroup.Root>
					<RadioGroup.Label>Label</RadioGroup.Label>
					<RadioGroup.Item value="option-1" disabled>
						<RadioGroup.ItemHiddenInput />
						<RadioGroup.ItemControl>
							<RadioGroup.ItemIndicator data-testid="item-indicator-option-1" />
						</RadioGroup.ItemControl>
						<RadioGroup.ItemText>Option 1</RadioGroup.ItemText>
					</RadioGroup.Item>
					<RadioGroup.Item value="option-2">
						<RadioGroup.ItemHiddenInput />
						<RadioGroup.ItemControl>
							<RadioGroup.ItemIndicator data-testid="item-indicator-option-2" />
						</RadioGroup.ItemControl>
						<RadioGroup.ItemText>Option 2</RadioGroup.ItemText>
					</RadioGroup.Item>
				</RadioGroup.Root>
			)

			await expect
				.element(screen.getByTestId('item-indicator-option-1'))
				.toHaveAttribute('data-disabled')
			await expect
				.element(screen.getByTestId('item-indicator-option-2'))
				.not.toHaveAttribute('data-disabled')
		})
	})

	describe('ids', () => {
		it('derives the ids of every part from the provided id', async () => {
			const screen = await render(
				<RadioGroup.Root id="my-field" invalid>
					<RadioGroup.Label>Label</RadioGroup.Label>
					<Items />
					<RadioGroup.SupportingText data-testid="supporting-text">
						Some supporting text.
					</RadioGroup.SupportingText>
					<RadioGroup.ErrorText data-testid="error-text">
						Some error text.
					</RadioGroup.ErrorText>
				</RadioGroup.Root>
			)

			expect(screen.getByScopeAndPart('radio-group', 'root')).toHaveAttribute(
				'id',
				'radio-group:my-field'
			)
			expect(screen.getByScopeAndPart('radio-group', 'label')).toHaveAttribute(
				'id',
				'radio-group:my-field:label'
			)
			const items = screen.getByScopeAndPart('radio-group', 'item')
			expect(items.nth(0)).toHaveAttribute(
				'id',
				'radio-group:my-field:radio:option-1'
			)
			expect(items.nth(1)).toHaveAttribute(
				'id',
				'radio-group:my-field:radio:option-2'
			)
			expect(
				screen.getByScopeAndPart('radio-group', 'supporting-text')
			).toHaveAttribute('id', 'radio-group:my-field:supporting-text')
			expect(
				screen.getByScopeAndPart('radio-group', 'error-text')
			).toHaveAttribute('id', 'radio-group:my-field:error-text')
		})
	})

	describe('use-radio-group', () => {
		it('generates an id when none is provided', async () => {
			const { result } = await renderHook(() => useRadioGroup({}))
			const { api } = result.current

			expect(api.getRootProps().id).toBeTruthy()
			expect(api.getLabelProps().id).toBeTruthy()
			expect(api.getItemProps({ value: 'option-1' }).id).toBeTruthy()
			expect(api.getItemControlProps({ value: 'option-1' }).id).toBeTruthy()
			expect(api.getItemHiddenInputProps({ value: 'option-1' }).id).toBeTruthy()
			expect(api.getItemIndicatorProps({ value: 'option-1' }).id).toBeTruthy()
			expect(api.getItemTextProps({ value: 'option-1' }).id).toBeTruthy()
			expect(api.getSupportingTextProps().id).toBeTruthy()
			expect(api.getErrorTextProps().id).toBeTruthy()
		})

		it('applies custom ID across the custom parts when explicitly configured', async () => {
			const { result } = await renderHook(() =>
				useRadioGroup({ id: 'custom-id' })
			)
			const { api } = result.current

			expect(api.getRootProps().id).toBe('radio-group:custom-id')
			expect(api.getLabelProps().id).toBe('radio-group:custom-id:label')
			expect(api.getItemProps({ value: 'option-1' }).id).toBe(
				'radio-group:custom-id:radio:option-1'
			)
			expect(api.getItemControlProps({ value: 'option-1' }).id).toBe(
				'radio-group:custom-id:radio:control:option-1'
			)
			expect(api.getItemHiddenInputProps({ value: 'option-1' }).id).toBe(
				'radio-group:custom-id:radio:input:option-1'
			)
			expect(api.getItemIndicatorProps({ value: 'option-1' }).id).toBe(
				'radio-group:custom-id:radio:item-indicator:option-1'
			)
			expect(api.getItemTextProps({ value: 'option-1' }).id).toBe(
				'radio-group:custom-id:radio:label:option-1'
			)
			expect(api.getSupportingTextProps().id).toBe(
				'radio-group:custom-id:supporting-text'
			)
			expect(api.getErrorTextProps().id).toBe(
				'radio-group:custom-id:error-text'
			)
		})

		it('exposes the invalid prop on the returned api', async () => {
			const { result } = await renderHook(() =>
				useRadioGroup({ invalid: true })
			)

			expect(result.current.api.invalid).toBe(true)
		})

		it('keeps a stable register reference between renders', async () => {
			const { result, rerender } = await renderHook(() => useRadioGroup({}))
			const first = result.current.register

			await rerender()

			expect(result.current.register).toBe(first)
		})
	})

	describe('use-radio-group-context', () => {
		it('throws error when useRadioGroupContext is used outside a RadioGroupProvider', async () => {
			await expect(async () => {
				await renderHook(() => useRadioGroupContext())
			}).rejects.toThrow(
				'useRadioGroupContext must be used within a RadioGroupProvider'
			)
		})

		it('returns the api, register and styles when used inside RadioGroup.Root', async () => {
			let contextValue: ReturnType<typeof useRadioGroupContext> | undefined

			const Consumer = () => {
				contextValue = useRadioGroupContext()
				return null
			}

			await render(
				<RadioGroup.Root invalid>
					<Consumer />
					<RadioGroup.Label>Label</RadioGroup.Label>
					<Items />
				</RadioGroup.Root>
			)

			await vi.waitFor(() => {
				expect(contextValue).toBeDefined()
			})

			expect(contextValue?.api).toMatchObject({ invalid: true })
			expect(contextValue?.api).toHaveProperty('getItemIndicatorProps')
			expect(contextValue?.register).toHaveProperty('supportingText')
			expect(contextValue?.register).toHaveProperty('errorText')
			expect(contextValue?.styles).toHaveProperty('root')
			expect(contextValue?.styles).toHaveProperty('itemIndicator')
		})
	})

	describe('root provider', () => {
		const setup = async (initialProps: UseRadioGroupProps) => {
			const { rerender, result } = await renderHook<
				UseRadioGroupProps,
				UseRadioGroupReturn
			>(init => useRadioGroup(init ? { ...init } : {}), { initialProps })

			const rootRef = createRef<HTMLDivElement>()

			const gate = () => (
				<RadioGroup.RootProvider
					{...result.current}
					ref={rootRef}
					data-testid="root"
					className="custom-root"
				>
					<RadioGroup.Label>Label</RadioGroup.Label>
					<Items />
					<RadioGroup.ErrorText data-testid="error-text">
						Some error text.
					</RadioGroup.ErrorText>
				</RadioGroup.RootProvider>
			)

			const screen = await render(gate())

			const sync = async (props?: UseRadioGroupProps) => {
				if (props) await rerender(props)
				await screen.rerender(gate())
			}

			return { rootRef, screen, sync }
		}

		it('forwards the ref and className to the root element', async () => {
			const { rootRef, screen } = await setup({})

			await expect.element(screen.getByTestId('root')).toBeInTheDocument()

			expect(rootRef.current).toBeInstanceOf(HTMLDivElement)
			await expect
				.element(screen.getByTestId('root'))
				.toHaveClass('radio-group__root')
			await expect
				.element(screen.getByTestId('root'))
				.toHaveClass('custom-root')
		})

		it('reflects external state updates when the provider is rendered again', async () => {
			const { screen, sync } = await setup({ invalid: false })

			await expect
				.element(screen.getByTestId('error-text'))
				.not.toBeInTheDocument()

			await sync({ invalid: true })

			await expect.element(screen.getByTestId('error-text')).toBeVisible()
			await expect
				.element(screen.getByRole('radio', { name: 'Option 1' }))
				.toHaveAttribute('aria-invalid', 'true')
		})
	})
})
