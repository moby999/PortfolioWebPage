import React, { useState, useEffect, useRef } from 'react';

const SNAKE_BLOCK_SIZE = 10;
const INITIAL_SNAKE = [
  { x: 2, y: 2 },
  { x: 1, y: 2 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };

type Segment = { x: number; y: number };

function getRandomFood(snake: Segment[], board_height: number, board_width: number): Segment{
  let newFood: Segment;
  do {
    newFood = {
      x: Math.floor(Math.random() * board_width),
      y: Math.floor(Math.random() * board_height),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
}

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize(); // Set initial size on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

const SnakeGame = () => {
  // const width = useWindowSize().width;
  // const height = useWindowSize().height;
  // const BOARD_SIZE =40;// width < height ? Math.floor(width / 40) : Math.floor(height / 40); 
  const BOARD_HEIGHT = 60; //Math.floor(window.innerHeight/SNAKE_BLOCK_SIZE);
  const BOARD_WIDTH = 120; //Math.floor(window.innerWidth/SNAKE_BLOCK_SIZE);
  console.log('BOARD_HEIGHT: ' + BOARD_HEIGHT + ', BOARD_WIDTH: ' + BOARD_WIDTH);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE, BOARD_HEIGHT, BOARD_WIDTH));
  const [gameOver, setGameOver] = useState(false);
  const moveRef = useRef(direction);
  

  useEffect(() => {
    moveRef.current = direction;
    console.log('window: ' +window.innerWidth + ',' + window.innerHeight);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (moveRef.current.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (moveRef.current.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (moveRef.current.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (moveRef.current.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const newHead = {
          x: (prevSnake[0].x + direction.x + BOARD_WIDTH) % BOARD_WIDTH,
          y: (prevSnake[0].y + direction.y + BOARD_HEIGHT) % BOARD_HEIGHT,
        };
        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }
        let newSnake: Segment[];
        
        if (newHead.x === food.x && newHead.y === food.y) {
          newSnake = [newHead, ...prevSnake];
          // Move setFood outside setSnake to avoid closure issues:
          setTimeout(() => setFood(getRandomFood(newSnake, BOARD_HEIGHT,BOARD_WIDTH)), 0);
        } else {
          newSnake = [newHead, ...prevSnake.slice(0, -1)];
        }
        return newSnake;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFood(INITIAL_SNAKE,BOARD_HEIGHT,BOARD_WIDTH));
    setGameOver(false);
  };

  return (
      <div
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${SNAKE_BLOCK_SIZE}px)`,
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${SNAKE_BLOCK_SIZE}px)`,
          gap: '2px',
          background: 'green',
          width: `${BOARD_WIDTH*SNAKE_BLOCK_SIZE}px`,
          // height: `${BOARD_HEIGHT*SNAKE_BLOCK_SIZE}px`,
          margin: '20px auto'
        }}
      >
        {[...Array(BOARD_HEIGHT * BOARD_WIDTH)].map((_, idx) => {
          const x = idx % BOARD_WIDTH;
          const y = Math.floor(idx / BOARD_HEIGHT);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={idx}
              style={{
                width: SNAKE_BLOCK_SIZE,
                height: SNAKE_BLOCK_SIZE,
                background: isSnake ? 'black' : isFood ? 'red' : 'black',
                borderRadius: isSnake ? '4px' : isFood ? '50%' : '4px',
              }}
            />
          );
        })}
      </div>
      // {gameOver && (
      //   <div>
      //     <h3>Game Over!</h3>
      //     <button onClick={handleRestart}>Restart</button>
      //   </div>
      // )}
  );
};

export default SnakeGame;