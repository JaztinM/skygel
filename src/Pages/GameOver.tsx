import { useState } from 'react'

import api from '@/Configs/axiosconfig'

export interface PlayerData {
  id?: string
  name: string
  stars: number
  time: string
  ranking: number
}
interface GameOverProps {
  isGameOver: boolean
  stars: number
  time: string
  restartGame: () => void
  setPlayerRanks: (data: PlayerData[]) => void
}
const GameOver = ({ isGameOver, stars, time, restartGame, setPlayerRanks }: GameOverProps) => {
  const [name, setUsername] = useState<string>('')

  const [rankingData, setRankingData] = useState<PlayerData[]>([])

  const data = {
    id: '',
    name,
    stars,
    time,
    ranking: 0,
  }
  const submit = async (e: any) => {
    e.preventDefault()

    const updatedRankingData = [data, ...rankingData]

    // Sort the ranking data by stars in ascending order and time in descending order
    const sortedRankingData = updatedRankingData.sort((a, b) => {
      if (a.stars === b.stars) {
        const timeA = a.time.split(':').map(Number)
        const timeB = b.time.split(':').map(Number)
        const totalSecondsA = timeA[0] * 60 + timeA[1]
        const totalSecondsB = timeB[0] * 60 + timeB[1]
        return totalSecondsA - totalSecondsB
      } else {
        // Otherwise, prioritize the number of stars (highest stars first)
        return b.stars - a.stars
      }
    })

    // Set the ranking number in the data
    let currentRank = 1
    let itemId = 1

    sortedRankingData.forEach((item, index) => {
      item.ranking = 0
      if (index > 0 && item.stars !== sortedRankingData[index - 1].stars) {
        currentRank = index + 1
      } else if (
        index > 0 &&
        item.stars === sortedRankingData[index - 1].stars &&
        item.time !== sortedRankingData[index - 1].time
      ) {
        currentRank = currentRank + 1
      }
      item.ranking = currentRank
      item.id = String(itemId++)
    })

    // Update the rankingData state
    setRankingData(sortedRankingData)
    setPlayerRanks(sortedRankingData)

    restartGame()

    try {
      await api.post('/xxxxxxxxx/register.php', data)
    } catch (error) {
      return error
    }
  }

  return (
    <div
      className="game-over-container"
      style={{
        opacity: isGameOver ? 1 : 0,
        pointerEvents: isGameOver ? 'auto' : 'none',
        zIndex: '1001',
      }}
    >
      <h1>Game Over</h1>
      <h3>Time: {time}</h3>
      <form className="user-form" onSubmit={submit}>
        <input
          type="text"
          placeholder="please enter your name"
          onChange={(e) => setUsername(e.target.value)}
          required
        ></input>
        <button type="submit" disabled={!name}>
          Continue
        </button>
      </form>
    </div>
  )
}

export default GameOver
