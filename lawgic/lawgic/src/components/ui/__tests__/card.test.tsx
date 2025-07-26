import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders correctly', () => {
      render(<Card data-testid="card">Card content</Card>)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('applies default variant styles', () => {
      render(<Card data-testid="card">Default</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm')
    })

    it('applies mint variant styles', () => {
      render(<Card variant="mint" data-testid="card">Mint</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('border-mint-200', 'bg-mint-50/50')
    })

    it('applies elevated variant styles', () => {
      render(<Card variant="elevated" data-testid="card">Elevated</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('shadow-lg')
    })

    it('applies interactive variant styles', () => {
      render(<Card variant="interactive" data-testid="card">Interactive</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('hover:shadow-md', 'transition-shadow', 'cursor-pointer')
    })

    it('applies different padding sizes', () => {
      render(
        <>
          <Card padding="none" data-testid="card-none">None</Card>
          <Card padding="sm" data-testid="card-sm">Small</Card>
          <Card padding="lg" data-testid="card-lg">Large</Card>
        </>
      )
      
      expect(screen.getByTestId('card-none')).not.toHaveClass('p-4', 'p-6', 'p-8')
      expect(screen.getByTestId('card-sm')).toHaveClass('p-4')
      expect(screen.getByTestId('card-lg')).toHaveClass('p-8')
    })

    it('applies custom className', () => {
      render(<Card className="custom-class" data-testid="card">Custom</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('CardHeader', () => {
    it('renders correctly', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>)
      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('header')).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })
  })

  describe('CardTitle', () => {
    it('renders correctly', () => {
      render(<CardTitle data-testid="title">Title content</CardTitle>)
      expect(screen.getByTestId('title')).toBeInTheDocument()
      expect(screen.getByTestId('title')).toHaveClass('font-semibold', 'leading-none', 'tracking-tight')
    })
  })

  describe('CardDescription', () => {
    it('renders correctly', () => {
      render(<CardDescription data-testid="description">Description content</CardDescription>)
      expect(screen.getByTestId('description')).toBeInTheDocument()
      expect(screen.getByTestId('description')).toHaveClass('text-sm', 'text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('renders correctly', () => {
      render(<CardContent data-testid="content">Content</CardContent>)
      expect(screen.getByTestId('content')).toBeInTheDocument()
      expect(screen.getByTestId('content')).toHaveClass('p-6', 'pt-0')
    })
  })

  describe('CardFooter', () => {
    it('renders correctly', () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>)
      expect(screen.getByTestId('footer')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })
  })

  describe('Complete Card', () => {
    it('renders all components together', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      )

      expect(screen.getByTestId('complete-card')).toBeInTheDocument()
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(screen.getByText('Test Footer')).toBeInTheDocument()
    })
  })
})