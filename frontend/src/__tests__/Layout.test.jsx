import { render, screen } from '@testing-library/react'
import Layout from '../components/Layout'

describe('Layout component', () => {
  test('renders children content', () => {
    render(<Layout><div>Inner</div></Layout>)
    expect(screen.getByText('Inner')).toBeTruthy()
  })
})
