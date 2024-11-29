import { fireEvent, render, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import GameOver from '../GameOver'

describe('GameOver component', () => {
  it('renders game over message', () => {
    const { getByText } = render(
      <GameOver
        isGameOver={true}
        stars={10}
        time="10:00"
        restartGame={() => {}}
        setPlayerRanks={() => {}}
      />,
    )
    expect(getByText('Game Over')).toBeInTheDocument()
  })

  it('renders time', () => {
    const { getByText } = render(
      <GameOver
        isGameOver={true}
        stars={10}
        time="10:00"
        restartGame={() => {}}
        setPlayerRanks={() => {}}
      />,
    )
    expect(getByText('Time: 10:00')).toBeInTheDocument()
  })

  it('renders form with input and submit button', () => {
    const { getByPlaceholderText, getByText } = render(
      <GameOver
        isGameOver={true}
        stars={10}
        time="10:00"
        restartGame={() => {}}
        setPlayerRanks={() => {}}
      />,
    )
    expect(getByPlaceholderText('please enter your name')).toBeInTheDocument()
    expect(getByText('Continue')).toBeInTheDocument()
  })

  it('submits form when button is clicked', async () => {
    const submitSpy = vi.fn()
    const { getByText, getByPlaceholderText } = render(
      <GameOver
        isGameOver={true}
        stars={10}
        time="10:00"
        restartGame={submitSpy}
        setPlayerRanks={() => {}}
      />,
    )
    const input = getByPlaceholderText('please enter your name')
    fireEvent.change(input, { target: { value: 'John Doe' } })
    const button = getByText('Continue')
    expect(button).not.toBeDisabled()
    fireEvent.click(button)
    await waitFor(() => expect(submitSpy).toHaveBeenCalledTimes(1))
  })

  it('disables submit button when name is empty', () => {
    const { getByText } = render(
      <GameOver
        isGameOver={true}
        stars={10}
        time="10:00"
        restartGame={() => {}}
        setPlayerRanks={() => {}}
      />,
    )
    const button = getByText('Continue')
    expect(button).toBeDisabled()
  })

  it('enables submit button when name is entered', () => {
    const { getByText, getByPlaceholderText } = render(
      <GameOver
        isGameOver={true}
        stars={10}
        time="10:00"
        restartGame={() => {}}
        setPlayerRanks={() => {}}
      />,
    )
    const input = getByPlaceholderText('please enter your name')
    fireEvent.change(input, { target: { value: 'John Doe' } })
    const button = getByText('Continue')
    expect(button).not.toBeDisabled()
  })
})
