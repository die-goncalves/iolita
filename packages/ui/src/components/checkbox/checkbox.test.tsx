import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render, renderHook } from 'vitest-browser-react'
import { Checkbox } from '.'
import {
	type CheckboxUserProps,
	type UseCheckboxProps,
	type UseCheckboxReturn,
	useCheckbox
} from './use-checkbox'
import { useCheckboxContext } from './use-checkbox-context'
import { useCheckboxGroup } from './use-checkbox-group'
import { useCheckboxGroupContext } from './use-checkbox-group-context'

function Item({ label, ...props }: { label: string } & CheckboxUserProps) {
	return (
		<Checkbox.Root {...props}>
			<Checkbox.HiddenInput />
			<Checkbox.Control>
				<Checkbox.Indicator />
			</Checkbox.Control>
			<Checkbox.Label>{label}</Checkbox.Label>
		</Checkbox.Root>
	)
}

describe('checkbox', () => {
	afterEach(async () => {
		await cleanup()
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('rendering', () => {
		it('applies data-scope and data-part attributes to every part', async () => {
			const screen = await render(
				<Checkbox.Group data-testid="group">
					<Checkbox.GroupLabel data-testid="group-label">
						Group
					</Checkbox.GroupLabel>
					<Checkbox.Root data-testid="root">
						<Checkbox.HiddenInput />
						<Checkbox.Control data-testid="control">
							<Checkbox.Indicator data-testid="indicator" />
						</Checkbox.Control>
						<Checkbox.Label data-testid="label">Label</Checkbox.Label>
					</Checkbox.Root>
					<Checkbox.GroupSupportingText data-testid="group-supporting-text">
						Some supporting text.
					</Checkbox.GroupSupportingText>
					<Checkbox.GroupErrorText data-testid="group-error-text">
						Some error text.
					</Checkbox.GroupErrorText>
				</Checkbox.Group>
			)

			for (const part of ['root', 'control', 'indicator', 'label']) {
				const locator = screen.getByTestId(part)

				await expect.element(locator).toHaveAttribute('data-scope', 'checkbox')
				await expect.element(locator).toHaveAttribute('data-part', part)
			}

			for (const part of ['group', 'group-label', 'group-supporting-text']) {
				const locator = screen.getByTestId(part)

				await expect.element(locator).toHaveAttribute('data-scope', 'checkbox')
				await expect.element(locator).toHaveAttribute('data-part', part)
			}
		})

		it('merges custom classNames with styled-system recipe classes across all subcomponents', async () => {
			const screen = await render(
				<Checkbox.Group data-testid="group" className="custom-group" invalid>
					<Checkbox.GroupLabel
						data-testid="groupLabel"
						className="custom-groupLabel"
					>
						Group
					</Checkbox.GroupLabel>
					<Checkbox.Root data-testid="root" className="custom-root">
						<Checkbox.HiddenInput />
						<Checkbox.Control data-testid="control" className="custom-control">
							<Checkbox.Indicator
								data-testid="indicator"
								className="custom-indicator"
							/>
						</Checkbox.Control>
						<Checkbox.Label data-testid="label" className="custom-label">
							Label
						</Checkbox.Label>
					</Checkbox.Root>
					<Checkbox.GroupSupportingText
						data-testid="groupSupportingText"
						className="custom-groupSupportingText"
					>
						Some supporting text.
					</Checkbox.GroupSupportingText>
					<Checkbox.GroupErrorText
						data-testid="groupErrorText"
						className="custom-groupErrorText"
					>
						Some error text.
					</Checkbox.GroupErrorText>
				</Checkbox.Group>
			)

			const classParts = [
				'group',
				'groupLabel',
				'root',
				'control',
				'indicator',
				'label',
				'groupSupportingText',
				'groupErrorText'
			]

			for (const part of classParts) {
				const element = screen.getByTestId(part)

				await expect.element(element).toHaveClass(`checkbox__${part}`)
				await expect.element(element).toHaveClass(`custom-${part}`)
			}
		})

		it('forwards refs to underlying DOM nodes across all subcomponents', async () => {
			const groupRef = createRef<HTMLDivElement>()
			const groupLabelRef = createRef<HTMLDivElement>()
			const rootRef = createRef<HTMLLabelElement>()
			const hiddenInputRef = createRef<HTMLInputElement>()
			const controlRef = createRef<HTMLDivElement>()
			const indicatorRef = createRef<HTMLDivElement>()
			const labelRef = createRef<HTMLSpanElement>()
			const supportingTextRef = createRef<HTMLDivElement>()
			const errorTextRef = createRef<HTMLSpanElement>()

			await render(
				<Checkbox.Group ref={groupRef} invalid>
					<Checkbox.GroupLabel ref={groupLabelRef}>Group</Checkbox.GroupLabel>
					<Checkbox.Root ref={rootRef}>
						<Checkbox.HiddenInput ref={hiddenInputRef} />
						<Checkbox.Control ref={controlRef}>
							<Checkbox.Indicator ref={indicatorRef} />
						</Checkbox.Control>
						<Checkbox.Label ref={labelRef}>Label</Checkbox.Label>
					</Checkbox.Root>
					<Checkbox.GroupSupportingText ref={supportingTextRef}>
						Some supporting text.
					</Checkbox.GroupSupportingText>
					<Checkbox.GroupErrorText ref={errorTextRef}>
						Some error text.
					</Checkbox.GroupErrorText>
				</Checkbox.Group>
			)

			expect(groupRef.current).toBeInstanceOf(HTMLDivElement)
			expect(groupLabelRef.current).toBeInstanceOf(HTMLDivElement)
			expect(rootRef.current).toBeInstanceOf(HTMLLabelElement)
			expect(hiddenInputRef.current).toBeInstanceOf(HTMLInputElement)
			expect(controlRef.current).toBeInstanceOf(HTMLDivElement)
			expect(indicatorRef.current).toBeInstanceOf(HTMLDivElement)
			expect(labelRef.current).toBeInstanceOf(HTMLSpanElement)
			expect(supportingTextRef.current).toBeInstanceOf(HTMLElement)
			expect(errorTextRef.current).toBeInstanceOf(HTMLSpanElement)
		})
	})

	describe('group value', () => {
		it('keeps the checked state driven by the value prop when controlled', async () => {
			const user = userEvent.setup()
			const onValueChange = vi.fn()
			const screen = await render(
				<Checkbox.Group value={['option-1']} onValueChange={onValueChange}>
					<Item value="option-1" label="Option 1" />
					<Item value="option-2" label="Option 2" />
				</Checkbox.Group>
			)

			await user.click(screen.getByText('Option 2'))
			expect(onValueChange).toHaveBeenCalledWith(['option-1', 'option-2'])
			const root = screen
				.getByRole('checkbox', { name: 'Option 2' })
				.element()
				.closest('label')
			expect(root).toHaveAttribute('data-state', 'unchecked')
		})
	})

	describe('group error text', () => {
		it('does not render when the group is valid', async () => {
			const screen = await render(
				<Checkbox.Group>
					<Item label="Label" />
					<Checkbox.GroupErrorText data-testid="error-text">
						Some error text.
					</Checkbox.GroupErrorText>
				</Checkbox.Group>
			)

			await expect.element(screen.getByRole('group')).toBeInTheDocument()
			await expect
				.element(screen.getByTestId('error-text'))
				.not.toBeInTheDocument()
		})

		it('renders with role alert when the group is invalid', async () => {
			const screen = await render(
				<Checkbox.Group invalid>
					<Item label="Label" />
					<Checkbox.GroupErrorText data-testid="error-text">
						Some error text.
					</Checkbox.GroupErrorText>
				</Checkbox.Group>
			)

			await expect
				.element(screen.getByTestId('error-text'))
				.toHaveAttribute('role', 'alert')
		})

		it('toggles the error id in aria-describedby as the group toggles between valid and invalid', async () => {
			const checkboxGroup = (invalid: boolean) => (
				<Checkbox.Group invalid={invalid}>
					<Checkbox.GroupLabel>Group</Checkbox.GroupLabel>
					<Item label="Label" />
					<Checkbox.GroupErrorText data-testid="error-text">
						Some error text.
					</Checkbox.GroupErrorText>
				</Checkbox.Group>
			)

			const screen = await render(checkboxGroup(false))
			const group = screen.getByRole('group')

			await expect.element(group).not.toHaveAttribute('aria-describedby')

			await screen.rerender(checkboxGroup(true))

			await expect
				.element(group)
				.toHaveAttribute(
					'aria-describedby',
					screen.getByTestId('error-text').element().id
				)

			await screen.rerender(checkboxGroup(false))

			await expect.element(group).not.toHaveAttribute('aria-describedby')
		})
	})

	describe('group supporting text', () => {
		it('delegates rendering and group attributes directly to the child element', async () => {
			const ref = createRef<HTMLParagraphElement>()

			const screen = await render(
				<Checkbox.Group>
					<Checkbox.GroupLabel>Group</Checkbox.GroupLabel>
					<Item label="Label" />
					<Checkbox.GroupSupportingText asChild ref={ref}>
						<p data-testid="supporting-text">Some supporting text.</p>
					</Checkbox.GroupSupportingText>
				</Checkbox.Group>
			)

			const supportingText = screen.getByTestId('supporting-text')

			expect(supportingText.element().tagName).toBe('P')
			await expect
				.element(supportingText)
				.toHaveAttribute('data-part', 'group-supporting-text')
			expect(ref.current).toBe(supportingText.element())
			await expect
				.element(screen.getByRole('group'))
				.toHaveAttribute('aria-describedby', supportingText.element().id)
		})

		it('moves the description from the group to each checkbox when the group label unmounts', async () => {
			const checkboxGroup = (showLabel: boolean) => (
				<Checkbox.Group>
					{showLabel && <Checkbox.GroupLabel>Group</Checkbox.GroupLabel>}
					<Item label="Label" />
					<Checkbox.GroupSupportingText data-testid="supporting-text">
						Some supporting text.
					</Checkbox.GroupSupportingText>
				</Checkbox.Group>
			)

			const screen = await render(checkboxGroup(true))
			const group = screen.getByRole('group')
			const checkbox = screen.getByRole('checkbox', { name: 'Label' })
			const supportingTextId = screen
				.getByTestId('supporting-text')
				.element().id

			await expect.element(group).toHaveAttribute('aria-labelledby')
			await expect
				.element(group)
				.toHaveAttribute('aria-describedby', supportingTextId)
			await expect.element(checkbox).not.toHaveAttribute('aria-describedby')

			await screen.rerender(checkboxGroup(false))

			await expect.element(group).not.toHaveAttribute('aria-labelledby')
			await expect.element(group).not.toHaveAttribute('aria-describedby')
			await expect
				.element(checkbox)
				.toHaveAttribute('aria-describedby', supportingTextId)
		})
	})

	describe('ids', () => {
		it('derives the ids of the group parts from the provided id', async () => {
			const screen = await render(
				<Checkbox.Group id="my-field" invalid>
					<Checkbox.GroupLabel data-testid="group-label">
						Group
					</Checkbox.GroupLabel>
					<Item label="Label" />
					<Checkbox.GroupSupportingText data-testid="supporting-text">
						Some supporting text.
					</Checkbox.GroupSupportingText>
					<Checkbox.GroupErrorText data-testid="error-text">
						Some error text.
					</Checkbox.GroupErrorText>
				</Checkbox.Group>
			)

			await expect
				.element(screen.getByRole('group'))
				.toHaveAttribute('id', 'checkbox:my-field:group')
			await expect
				.element(screen.getByTestId('group-label'))
				.toHaveAttribute('id', 'checkbox:my-field:group-label')
			await expect
				.element(screen.getByTestId('supporting-text'))
				.toHaveAttribute('id', 'checkbox-group:my-field:group-supporting-text')
			await expect
				.element(screen.getByTestId('error-text'))
				.toHaveAttribute('id', 'checkbox-group:my-field:group-error-text')
		})

		it('prioritizes custom ids over the id-derived values', async () => {
			const screen = await render(
				<Checkbox.Group
					id="my-field"
					invalid
					ids={{
						group: 'my-group',
						groupLabel: 'my-group-label',
						groupSupportingText: 'my-supporting-text',
						groupErrorText: 'my-error-text'
					}}
				>
					<Checkbox.GroupLabel>Group</Checkbox.GroupLabel>
					<Item label="Label" />
					<Checkbox.GroupSupportingText>
						Some supporting text.
					</Checkbox.GroupSupportingText>
					<Checkbox.GroupErrorText>Some error text.</Checkbox.GroupErrorText>
				</Checkbox.Group>
			)

			const group = screen.getByRole('group')

			await expect.element(group).toHaveAttribute('id', 'my-group')
			await expect
				.element(group)
				.toHaveAttribute('aria-labelledby', 'my-group-label')
			await expect
				.element(group)
				.toHaveAttribute('aria-describedby', 'my-supporting-text my-error-text')
		})
	})

	describe('context guards', () => {
		it('throws error when useCheckboxContext is used outside a CheckboxProvider', async () => {
			await expect(async () => {
				await renderHook(() => useCheckboxContext())
			}).rejects.toThrow(
				'useCheckboxContext must be used within a CheckboxProvider'
			)
		})

		it('returns null when useCheckboxGroupContext is used outside Checkbox.Group', async () => {
			const { result } = await renderHook(() => useCheckboxGroupContext())
			expect(result.current).toBeNull()
		})

		it.each([
			['GroupLabel', <Checkbox.GroupLabel key="a">Label</Checkbox.GroupLabel>],
			[
				'GroupSupportingText',
				<Checkbox.GroupSupportingText key="b">
					Text
				</Checkbox.GroupSupportingText>
			],
			[
				'GroupErrorText',
				<Checkbox.GroupErrorText key="c">Text</Checkbox.GroupErrorText>
			]
		])('throws error when %s is used outside Checkbox.Group', async (name, element) => {
			vi.spyOn(console, 'error').mockImplementation(() => {})
			await expect(render(element)).rejects.toThrow(
				`Checkbox.${name} must be used within Checkbox.Group`
			)
		})
	})

	describe('use-checkbox', () => {
		it('generates an id when none is provided', async () => {
			const { result } = await renderHook(() => useCheckbox({}))

			await vi.waitFor(() => {
				expect(result.current.api.getRootProps().id).toBeTruthy()
				expect(result.current.api.getHiddenInputProps().id).toBeTruthy()
			})
		})

		it('applies custom id across subcomponents when explicitly configured', async () => {
			const { result } = await renderHook(() =>
				useCheckbox({ id: 'custom-id' })
			)

			expect(result.current.api.getRootProps().id).toContain('custom-id')
			expect(result.current.api.getHiddenInputProps().id).toContain('custom-id')
		})

		it('exposes the invalid and value props on the returned api', async () => {
			const { result } = await renderHook(() => useCheckbox({ invalid: true }))

			expect(result.current.api.invalid).toBe(true)
			expect(result.current.api.value).toBe('on')
		})

		it('leaves aria-describedby undefined on the hidden input outside a group', async () => {
			const { result } = await renderHook(() => useCheckbox({}))

			expect(
				result.current.api.getHiddenInputProps()['aria-describedby']
			).toBeUndefined()
		})
	})

	describe('use-checkbox-group', () => {
		it('keeps a stable register reference between renders', async () => {
			const { result, rerender } = await renderHook(() => useCheckboxGroup({}))
			const first = result.current.register

			await rerender()

			expect(result.current.register).toBe(first)
		})

		it('derives item props from the group value, name and flags', async () => {
			const { result } = await renderHook(() =>
				useCheckboxGroup({
					name: 'options',
					defaultValue: ['option-1'],
					disabled: true,
					readOnly: true,
					invalid: true
				})
			)

			expect(
				result.current.api.getItemProps({ value: 'option-1' })
			).toMatchObject({
				name: 'options',
				checked: true,
				disabled: true,
				readOnly: true,
				invalid: true
			})
			expect(
				result.current.api.getItemProps({ value: 'option-2' }).checked
			).toBe(false)
		})
	})

	describe('root provider', () => {
		const setup = async (initialProps: UseCheckboxProps) => {
			const { rerender, result } = await renderHook<
				UseCheckboxProps,
				UseCheckboxReturn
			>(init => useCheckbox(init ? { ...init } : {}), { initialProps })

			const rootRef = createRef<HTMLLabelElement>()

			const gate = () => (
				<Checkbox.RootProvider
					{...result.current}
					ref={rootRef}
					data-testid="root"
					className="custom-root"
				>
					<Checkbox.HiddenInput />
					<Checkbox.Control>
						<Checkbox.Indicator />
					</Checkbox.Control>
					<Checkbox.Label>Label</Checkbox.Label>
				</Checkbox.RootProvider>
			)

			const screen = await render(gate())

			const sync = async (props?: UseCheckboxProps) => {
				if (props) await rerender(props)
				await screen.rerender(gate())
			}

			return { rootRef, screen, sync }
		}

		it('forwards the ref and className to the root element', async () => {
			const { rootRef, screen } = await setup({})

			await expect.element(screen.getByTestId('root')).toBeInTheDocument()

			expect(rootRef.current).toBeInstanceOf(HTMLLabelElement)
			await expect
				.element(screen.getByTestId('root'))
				.toHaveClass('checkbox__root')
			await expect
				.element(screen.getByTestId('root'))
				.toHaveClass('custom-root')
		})

		it('reflects external state updates when the provider is rendered again', async () => {
			const { screen, sync } = await setup({ checked: false })
			const checkbox = screen.getByRole('checkbox', { name: 'Label' })

			await expect.element(checkbox).not.toBeChecked()

			await sync({ checked: true })

			await expect.element(checkbox).toBeChecked()
		})
	})
})
