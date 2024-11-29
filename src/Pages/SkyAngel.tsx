import { useEffect, useState } from 'react'

import GameOver, { PlayerData } from './GameOver'

const SkyAngel = () => {
  const [start, setStart] = useState<boolean>(false)
  const [changeX, setChangeX] = useState<number>(0)
  const [changeY, setChangeY] = useState<number>(0)
  const [positionX, setPositionX] = useState<number>(0)
  const [positionY, setPositionY] = useState<number>(0)
  const [paused, setPaused] = useState<boolean>(true)
  const [fuelCount, setFuelCount] = useState<number>(10)
  const [seconds, setSeconds] = useState<number>(0)
  const [running, setRunning] = useState<boolean>(false)
  const [isGameOver, setIsGameOver] = useState<boolean>(false)
  const [starsCount, setStarsCount] = useState<number>(0)
  const [playerRanking, setPlayerRanking] = useState<PlayerData[]>([])

  const clouds = document.querySelectorAll('.cloud')
  const skyplane = document.getElementById('skyplane') as HTMLElement
  const birds = document.querySelectorAll('.bird')
  const stars = document.querySelectorAll('.star')
  const parachutes = document.querySelectorAll('.parachute')

  const handleStartTimer = () => {
    setRunning(true)
  }

  const handlePauseTimer = () => {
    setRunning(!running)
  }

  const handleResetTimer = () => {
    setSeconds(0)
    setRunning(false)
  }

  const handlePause = () => {
    if (!isGameOver) {
      setPaused(!paused)
      handlePauseTimer()
    }
  }

  //for handling keyboard events
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === 'ArrowUp') {
        setChangeY(1)
      } else if (e.key === 'ArrowDown') {
        setChangeY(-1)
      } else if (e.key === 'ArrowLeft') {
        setChangeX(-1)
      } else if (e.key === 'ArrowRight') {
        setChangeX(1)
      } else if (e.key === ' ') {
        e.preventDefault()
        const inputValue = e.target.value
        e.target.value = inputValue + ' '
        const button = document.querySelector('.pause') as HTMLElement
        button?.click()
      }
    }
    const handleKeyUp = () => {
      onMouseUp()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  //for handling plane movements
  useEffect(() => {
    let intervalId = null
    let speed = 0

    if (changeX == 1 && positionX < 90 && !paused) {
      intervalId = setInterval(() => {
        speed = speed + 1
        if (skyplane) {
          const newPosX = positionX + speed
          setPositionX(newPosX)
          skyplane.style.transform = 'translate(' + newPosX + 'vw, ' + positionY + 'vh) scaleX(-1)'
        }
      }, 20)
    } else if (changeX == -1 && positionX > 0 && !paused) {
      intervalId = setInterval(() => {
        speed = speed + 1
        if (skyplane) {
          const newPosX = positionX - speed
          setPositionX(newPosX)
          skyplane.style.transform = 'translate(' + newPosX + 'vw, ' + positionY + 'vh) scaleX(-1)'
        }
      }, 20)
    } else if (changeY == 1 && positionY > -45 && !paused) {
      intervalId = setInterval(() => {
        speed = speed + 1
        if (skyplane) {
          const newPosY = positionY - speed
          setPositionY(newPosY)
          skyplane.style.transform = 'translate(' + positionX + 'vw, ' + newPosY + 'vh) scaleX(-1)'
        }
      }, 20)
    } else if (changeY == -1 && positionY < 45 && !paused) {
      intervalId = setInterval(() => {
        speed = speed + 1
        if (skyplane) {
          const newPosY = positionY + speed
          setPositionY(newPosY)
          skyplane.style.transform = 'translate(' + positionX + 'vw, ' + newPosY + 'vh) scaleX(-1)'
        }
      }, 20)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [changeX, positionX, positionY, changeY, start])

  //for handling touch events on controller
  const onMouseDownUp = () => {
    setChangeY(1)
  }

  const onMouseDownDown = () => {
    setChangeY(-1)
  }

  const onMouseDownLeft = () => {
    setChangeX(-1)
  }
  const onMouseDownRight = () => {
    setChangeX(1)
  }

  const onMouseUp = () => {
    setChangeX(0)
    setChangeY(0)
  }
  const pauseAnimation = () => {
    clouds.forEach((cloud) => {
      ;(cloud as HTMLElement).style.animationPlayState = 'paused'
    })

    birds.forEach((bird) => {
      ;(bird as HTMLElement).style.animationPlayState = 'paused'
    })

    stars.forEach((star) => {
      ;(star as HTMLElement).style.animationPlayState = 'paused'
    })

    parachutes.forEach((parachute) => {
      ;(parachute as HTMLElement).style.animationPlayState = 'paused'
    })
  }

  const resumeAnimation = () => {
    clouds.forEach((cloud) => {
      ;(cloud as HTMLElement).style.animationPlayState = 'running'
    })

    birds.forEach((bird) => {
      ;(bird as HTMLElement).style.animationPlayState = 'running'
    })

    stars.forEach((star) => {
      ;(star as HTMLElement).style.animationPlayState = 'running'
    })

    parachutes.forEach((parachute) => {
      ;(parachute as HTMLElement).style.animationPlayState = 'running'
    })
  }

  //logic for spawning cloud
  useEffect(() => {
    const cloudContainerTemplate = document.createElement('div')
    cloudContainerTemplate.className = 'cloud-container-template'
    cloudContainerTemplate.innerHTML = `
          <div class="cloud-container">
            <div class="cloud" id="cloud-back"></div>
            <div class="cloud" id="cloud-mid"></div>
            <div class="cloud" id="cloud-front"></div>
            <svg width="0" height="0">
              <filter id="filter-back">
                <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4"
                  seed="0" />
                <feDisplacementMap in="SourceGraphic" scale="170" />
              </filter>
              <filter id="filter-mid">
                <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="5"
                  seed="56" />
                <feDisplacementMap in="SourceGraphic" scale="150" />
              </filter>
              <filter id="filter-front">
                <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2"
                  seed="21" />
                <feDisplacementMap in="SourceGraphic" scale="100" />
              </filter>
            </svg>
          </div>
        `

    const spawnCloud = () => {
      const cloudContainers = document.querySelectorAll('.cloud-container-template')
      if (cloudContainers.length >= 5) {
        cloudContainers[0].remove()
      }
      const cloudContainer = cloudContainerTemplate.cloneNode(true) as HTMLElement
      const randomTop = Math.random() * 100 - 50
      const randomHeight = Math.random() * (700 - 300)
      ;(cloudContainer.querySelector('.cloud-container') as HTMLElement).style.top =
        `${randomTop}vh`
      ;(cloudContainer.querySelector('.cloud') as HTMLElement).style.height =
        `${randomHeight + 100}px`

      document.getElementById('root')?.appendChild(cloudContainer)
    }

    let intervalId: NodeJS.Timeout | null = null

    const startSpawning = () => {
      intervalId = setInterval(spawnCloud, 2000)
    }

    const stopSpawning = () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    if (!paused) {
      startSpawning()
      resumeAnimation()
    } else {
      pauseAnimation()
    }

    return () => {
      stopSpawning()
    }
  }, [paused])

  //logic for spawning bird
  useEffect(() => {
    const cloudContainerTemplate = document.createElement('div')
    cloudContainerTemplate.className = 'bird-container-template'
    cloudContainerTemplate.innerHTML = `
          <div class="cloud-container">
            <div class="bird"><img id="bird" src="https://media.giphy.com/media/3o7TKTEnDK22YfSWwo/giphy.gif" alt="bird"/></div>
          </div>
        `

    const spawnBird = () => {
      const birdContainers = document.querySelectorAll('.bird-container-template')
      if (birdContainers.length >= 8) {
        birdContainers[0].remove()
      }
      const birdContainer = cloudContainerTemplate.cloneNode(true) as HTMLElement
      const randomTop = Math.random() * 100
      ;(birdContainer.querySelector('.cloud-container') as HTMLElement).style.top = `${randomTop}vh`

      document.getElementById('root')?.appendChild(birdContainer)
    }

    let intervalId: NodeJS.Timeout | null = null

    const startSpawning = () => {
      intervalId = setInterval(spawnBird, 1000)
    }

    const stopSpawning = () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    if (!paused) {
      startSpawning()
      resumeAnimation()
    } else {
      pauseAnimation()
    }

    return () => {
      stopSpawning()
    }
  }, [paused])

  //logic for spawning stars
  useEffect(() => {
    const starContainerTemplate = document.createElement('div')
    starContainerTemplate.className = 'star-container-template'
    starContainerTemplate.innerHTML = `
          <div class="star-container">
            <div class="star"><div class="shooting_star"><svg fill='white' viewBox="0 0 576 512" width="30" title="star">
      <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" /></div></div>
          </div>
        `

    const spawnStar = () => {
      const starContainers = document.querySelectorAll('.star-container-template')
      if (starContainers.length >= 5) {
        starContainers[0].remove()
      }
      const starContainer = starContainerTemplate.cloneNode(true) as HTMLElement
      const randomTop = Math.random() * 100
      ;(starContainer.querySelector('.star-container') as HTMLElement).style.left = `${randomTop}vw`

      document.getElementById('root')?.appendChild(starContainer)
    }

    let intervalId: NodeJS.Timeout | null = null

    const startSpawning = () => {
      intervalId = setInterval(spawnStar, 2000)
    }

    const stopSpawning = () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    if (!paused) {
      startSpawning()
      resumeAnimation()
    } else {
      pauseAnimation()
    }

    return () => {
      stopSpawning()
    }
  }, [paused])

  //logic for spawning parachutes
  useEffect(() => {
    const parachuteContainerTemplate = document.createElement('div')
    parachuteContainerTemplate.className = 'parachute-container-template'
    parachuteContainerTemplate.innerHTML = `
          <div class="parachute-container">
            <div class="parachute">
             <div class="parachute-background">
             <div class="border-out"></div>
             <div class="border-middle"></div>
             <div class="border-in"></div>
             <div class="left-string"></div>
             <div class="right-string"></div>
             <div class="wide"></div>
             <div class="square"></div>
               </div>
            </div>
          </div>
        `

    const spawnParachute = () => {
      const parachuteContainers = document.querySelectorAll('.parachute-container-template')
      if (parachuteContainers.length >= 5) {
        parachuteContainers[0].remove()
      }
      const parachuteContainer = parachuteContainerTemplate.cloneNode(true) as HTMLElement
      const randomTop = Math.random() * 100
      ;(parachuteContainer.querySelector('.parachute-container') as HTMLElement).style.left =
        `${randomTop}vw`

      document.getElementById('root')?.appendChild(parachuteContainer)
    }

    let intervalId: NodeJS.Timeout | null = null

    const startSpawning = () => {
      intervalId = setInterval(spawnParachute, 3500)
    }

    const stopSpawning = () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    if (!paused) {
      startSpawning()
      resumeAnimation()
    } else {
      pauseAnimation()
    }

    return () => {
      stopSpawning()
    }
  }, [paused])

  //for timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    if (running) {
      intervalId = setInterval(() => {
        setSeconds(seconds + 1)
      }, 1000)
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [running, seconds])

  // check fuel counter
  useEffect(() => {
    if (fuelCount > 0 && running && !paused) {
      setFuelCount(fuelCount - 1)
    } else if (fuelCount <= 0 && running && !paused) {
      setIsGameOver(true)
      setPaused(true)
      setRunning(false)
    }
  }, [seconds])

  const onGameStart = () => {
    setStart(true)
    setPaused(false)
    handleStartTimer()
    setFuelCount(10)
    setPositionX(0)
    setPositionY(0)

    if (skyplane) {
      skyplane.style.transform = 'translate(0vw, 0vh) scaleX(-1)'
    }
  }
  const onGameReset = () => {
    setStart(false)
    handleResetTimer()
    setIsGameOver(false)
    setStarsCount(0)
    clouds.forEach((cloud) => cloud.remove())
    birds.forEach((cloud) => cloud.remove())
    stars.forEach((cloud) => cloud.remove())
    parachutes.forEach((cloud) => cloud.remove())
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  //check collision
  function isColliding(a: HTMLElement, b: Element) {
    const aRect = a.getBoundingClientRect()
    const bRect = b.getBoundingClientRect()

    return !(
      aRect.top + aRect.height < bRect.top ||
      aRect.top > bRect.top + bRect.height ||
      aRect.left + aRect.width < bRect.left ||
      aRect.left > bRect.left + bRect.width
    )
  }

  useEffect(() => {
    const checkCollisions = () => {
      birds.forEach((bird) => {
        if (isColliding(skyplane, bird)) {
          setPaused(true)
          setRunning(false)
          setIsGameOver(true)
        }
      })

      stars.forEach((star) => {
        if (isColliding(skyplane, star)) {
          setStarsCount(starsCount + 1)
          setFuelCount(fuelCount + 1)
          star.remove()
        }
      })
      parachutes.forEach((parachute) => {
        if (isColliding(skyplane, parachute)) {
          setFuelCount(fuelCount + 10)
          parachute.remove()
        }
      })
    }
    const intervalId = setInterval(checkCollisions, 20)
    if (isGameOver) {
      clearInterval(intervalId)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [birds, skyplane, isGameOver])

  return (
    <>
      <div
        className={`startmenu`}
        style={{ pointerEvents: start ? 'none' : 'all', opacity: !start ? '1 ' : '0' }}
      >
        <h1 style={{ fontStyle: 'italic' }}>SKY ANGEL</h1>
        <div
          className="ranking-container"
          style={{ display: playerRanking.length > 0 ? 'flex' : 'none' }}
        >
          <p>Ranking</p>
          <ol>
            {playerRanking.map((player, index) => (
              <li key={index}>
                <span>
                  {player.ranking}. {player.name}
                </span>
                <span>Time: {player.time}</span>
                <span>Stars: {player.stars}</span>
              </li>
            ))}
          </ol>
        </div>
        <button onClick={onGameStart}>Start Game</button>
      </div>

      <GameOver
        isGameOver={isGameOver}
        time={formatTime(seconds)}
        stars={starsCount}
        restartGame={onGameReset}
        setPlayerRanks={(data) => setPlayerRanking(data)}
      />

      <div className="topnav" style={{ opacity: start ? '1 ' : '0' }}>
        <h2>Fuel: {fuelCount}</h2>
        <h1>{formatTime(seconds)}</h1>
        {paused ? (
          <button className="pause" onClick={handlePause}>
            {' '}
            &#9658;{' '}
          </button>
        ) : (
          <button className="pause" onClick={handlePause}>
            {' '}
            &#10074;&#10074;{' '}
          </button>
        )}
      </div>

      <div className="plane" id="PlaneContainer" style={{ opacity: start ? '1 ' : '0' }}>
        {' '}
        <div id="skyplane">
          <img
            src="https://i.imgur.com/3BGEqFQ.png"
            style={{ height: '10vh', width: '10vw' }}
            alt="plane"
          />
        </div>{' '}
      </div>
      <div id="controlwrapper">
        <div id="controls">
          <button
            id="keyboard_key_up"
            className="movements_control"
            onMouseDown={onMouseDownUp}
            onMouseUp={onMouseUp}
            onTouchStart={onMouseDownUp}
          >
            &uarr;
          </button>
          <button
            id="keyboard_key_left"
            className="movements_control"
            onMouseDown={onMouseDownLeft}
            onMouseUp={onMouseUp}
            onTouchStart={onMouseDownLeft}
          >
            &larr;
          </button>
          <button
            id="keyboard_key_down"
            className="movements_control"
            onMouseDown={onMouseDownDown}
            onMouseUp={onMouseUp}
            onTouchStart={onMouseDownDown}
          >
            &darr;
          </button>
          <button
            id="keyboard_key_right"
            className="movements_control"
            onMouseDown={onMouseDownRight}
            onMouseUp={onMouseUp}
            onTouchStart={onMouseDownRight}
          >
            &rarr;
          </button>
        </div>
      </div>
    </>
  )
}

export default SkyAngel
