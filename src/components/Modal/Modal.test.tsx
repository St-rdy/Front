import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
// import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal 컴포넌트 테스트', () => {
  it('Modal 컴포넌트가 렌더링 되어야 한다.', () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Test Modal"
        content="Test Content"
        buttons={[{ label: 'Close', onClick: vi.fn() }]}
      />
    )
    const titleElement = screen.getByText('Test Modal')
    expect(titleElement).toBeInTheDocument()
  })
  it('Modal 컴포넌트가 닫혀 있을 때는 렌더링 되지 않아야 한다.', () => {
    render(
      <Modal
        isOpen={false}
        onClose={vi.fn()}
        title="Test Modal"
        content="Test Content"
        buttons={[{ label: 'Close', onClick: vi.fn() }]}
      />
    )
    const titleElement = screen.queryByText('Test Modal')
    expect(titleElement).not.toBeInTheDocument()
  })
})
