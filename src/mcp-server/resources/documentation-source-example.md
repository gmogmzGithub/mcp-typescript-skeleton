# Component Documentation

## Getting Started

This is a sample documentation file that demonstrates how the MCP server can search and retrieve documentation sections. The server uses fuzzy search to find relevant sections based on your queries.

### Installation

To install and use these components in your project:

```bash
npm install your-component-library
```

### Basic Usage

Import and use components in your application:

```typescript
import { Button, Card, Modal } from 'your-component-library';

function App() {
  return (
    <div>
      <Card>
        <Button onClick={() => console.log('Clicked!')}>
          Click me
        </Button>
      </Card>
    </div>
  );
}
```

## Components

### Button

A versatile button component that supports various styles and states.

```typescript
import { Button } from 'your-component-library';

// Basic button
<Button>Click me</Button>

// Primary button
<Button variant="primary">Primary Action</Button>

// Disabled button
<Button disabled>Disabled</Button>
```

**Properties:**
- `variant?: 'default' | 'primary' | 'secondary'` - Button style variant
- `disabled?: boolean` - Whether the button is disabled
- `onClick?: () => void` - Click handler function

### Card

A flexible container component for grouping related content.

```typescript
import { Card } from 'your-component-library';

<Card>
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</Card>
```

**Properties:**
- `children: React.ReactNode` - Content to display inside the card
- `className?: string` - Additional CSS classes
- `padding?: 'small' | 'medium' | 'large'` - Internal padding size

### Modal

A modal dialog component for displaying content in an overlay.

```typescript
import { Modal } from 'your-component-library';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Title</h2>
        <p>Modal content...</p>
      </Modal>
    </>
  );
}
```

**Properties:**
- `isOpen: boolean` - Whether the modal is visible
- `onClose: () => void` - Function called when modal should close
- `children: React.ReactNode` - Modal content

### Form Components

#### Input

A styled input field component.

```typescript
import { Input } from 'your-component-library';

<Input
  placeholder="Enter your name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Properties:**
- `value?: string` - Input value
- `onChange?: (event) => void` - Change handler
- `placeholder?: string` - Placeholder text
- `type?: string` - Input type (text, email, password, etc.)

#### Checkbox

A checkbox input component.

```typescript
import { Checkbox } from 'your-component-library';

<Checkbox
  checked={isChecked}
  onChange={(e) => setIsChecked(e.target.checked)}
>
  Accept terms and conditions
</Checkbox>
```

**Properties:**
- `checked: boolean` - Whether checkbox is checked
- `onChange: (event) => void` - Change handler
- `children: React.ReactNode` - Checkbox label

## Layout Components

### Grid

A responsive grid system for organizing content.

```typescript
import { Grid, GridItem } from 'your-component-library';

<Grid columns={3} gap="medium">
  <GridItem>Item 1</GridItem>
  <GridItem>Item 2</GridItem>
  <GridItem>Item 3</GridItem>
</Grid>
```

**Properties:**
- `columns: number` - Number of grid columns
- `gap?: 'small' | 'medium' | 'large'` - Spacing between items
- `children: React.ReactNode` - Grid items

### Stack

A component for stacking items vertically with consistent spacing.

```typescript
import { Stack } from 'your-component-library';

<Stack spacing="medium">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>
```

**Properties:**
- `spacing: 'small' | 'medium' | 'large'` - Spacing between items
- `children: React.ReactNode` - Stack items

## Theming

### Theme Provider

Wrap your application with the theme provider to enable theming:

```typescript
import { ThemeProvider, defaultTheme } from 'your-component-library';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

### Custom Themes

Create custom themes by extending the default theme:

```typescript
import { defaultTheme } from 'your-component-library';

const customTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#007bff',
    secondary: '#6c757d',
  },
};
```

## Accessibility

All components are built with accessibility in mind:

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

### Best Practices

1. Always provide meaningful labels for interactive elements
2. Use semantic HTML elements when possible
3. Ensure sufficient color contrast
4. Test with keyboard navigation
5. Verify screen reader compatibility

## Animation

### Transition Components

Components that support smooth transitions:

```typescript
import { Fade, Slide } from 'your-component-library';

<Fade in={isVisible}>
  <div>This content fades in/out</div>
</Fade>

<Slide direction="up" in={isVisible}>
  <div>This content slides up/down</div>
</Slide>
```

## TypeScript Support

All components include full TypeScript definitions:

```typescript
interface ButtonProps {
  variant?: 'default' | 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = (props) => {
  // Implementation
};
```

## Testing

Components are tested with:
- Unit tests using Jest and React Testing Library
- Accessibility tests using axe-core
- Visual regression tests using Storybook

### Testing Your Components

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from 'your-component-library';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

## Performance

### Optimization Tips

1. Use tree-shaking to import only needed components
2. Lazy load components when possible
3. Optimize bundle size with proper build configuration
4. Use React.memo for expensive components

### Bundle Analysis

Monitor your bundle size:

```bash
npm run build -- --analyze
```

## Migration Guide

### From v1 to v2

Major changes in v2:
- Updated color system
- New theming API
- Deprecated components removed

```typescript
// v1
import { OldButton } from 'your-component-library';

// v2
import { Button } from 'your-component-library';
```

## Contributing

Guidelines for contributing to the component library:

1. Follow existing code patterns
2. Add comprehensive tests
3. Update documentation
4. Follow accessibility guidelines
5. Test across different browsers