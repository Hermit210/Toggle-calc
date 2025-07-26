import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from '../input'

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles input changes', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    
    render(<Input onChange={handleChange} placeholder="Type here" />)
    
    const input = screen.getByPlaceholderText('Type here')
    await user.type(input, 'Hello')
    
    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('Hello')
  })

  it('applies default variant styles', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('border-input', 'focus-visible:ring-ring')
  })

  it('applies mint variant styles', () => {
    render(<Input variant="mint" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('border-mint-300', 'focus-visible:ring-mint-500', 'focus-visible:border-mint-500')
  })

  it('applies error variant styles', () => {
    render(<Input variant="error" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('border-destructive', 'focus-visible:ring-destructive')
  })

  it('applies different sizes', () => {
    render(
      <>
        <Input size="sm" data-testid="input-sm" />
        <Input size="default" data-testid="input-default" />
        <Input size="lg" data-testid="input-lg" />
      </>
    )
    
    expect(screen.getByTestId('input-sm')).toHaveClass('h-8', 'text-xs')
    expect(screen.getByTestId('input-default')).toHaveClass('h-9')
    expect(screen.getByTestId('input-lg')).toHaveClass('h-10', 'text-base')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('accepts different input types', () => {
    render(
      <>
        <Input type="email" data-testid="email-input" />
        <Input type="password" data-testid="password-input" />
        <Input type="number" data-testid="number-input" />
      </>
    )
    
    expect(screen.getByTestId('email-input')).toHaveAttribute('type', 'email')
    expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password')
    expect(screen.getByTestId('number-input')).toHaveAttribute('type', 'number')
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} data-testid="input" />)
    expect(ref).toHaveBeenCalled()
  })

  it('supports all standard input attributes', () => {
    render(
      <Input
        data-testid="input"
        placeholder="Test placeholder"
        value="Test value"
        maxLength={10}
        required
        readOnly
      />
    )
    
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('placeholder', 'Test placeholder')
    expect(input).toHaveValue('Test value')
    expect(input).toHaveAttribute('maxLength', '10')
    expect(input).toBeRequired()
    expect(input).toHaveAttribute('readOnly')
  })
})