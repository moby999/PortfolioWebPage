"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import SnakeGame from "./components/SnakeGame";


function PingPongBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Ball
    let x = width / 2;
    let y = height / 2;
    let dx = 3;
    let dy = 2;
    const radius = 30;

    // Paddle
    const paddleWidth = 120;
    const paddleHeight = 16;
    let paddleX = (width - paddleWidth) / 2;
    const paddleY = height - paddleHeight - 30;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Draw ball
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#0ff";
      ctx.fill();
      ctx.closePath();

      // Draw paddle
      ctx.beginPath();
      ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
      ctx.fillStyle = "#0ff";
      ctx.fill();
      ctx.closePath();

      // Ball movement
      x += dx;
      y += dy;

      // Wall collision
      if (x + radius > width || x - radius < 0) dx = -dx;
      if (y - radius < 0) dy = -dy;

      // Paddle collision
      if (y + radius > paddleY && x > paddleX && x < paddleX + paddleWidth) {
        dy = -Math.abs(dy);
      }

      // Bottom collision (reset ball)
      if (y + radius > height) {
        x = width / 2;
        y = height / 2;
        dx = 3 * (Math.random() > 0.5 ? 1 : -1);
        dy = 2;
      }

      requestAnimationFrame(draw);
    }

    draw();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (!canvas) return;
      canvas.width = width;
      canvas.height = height;
    }

    function handleMouseMove(e: MouseEvent) {
      paddleX = e.clientX - paddleWidth / 2;
      // Clamp paddle within canvas
      paddleX = Math.max(0, Math.min(width - paddleWidth, paddleX));
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10"
      width={typeof window !== "undefined" ? window.innerWidth : 1920}
      height={typeof window !== "undefined" ? window.innerHeight : 1080}
      style={{ display: "block" }}
    />
  );
}

export default function Home() {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* <PingPongBackground /> */}
      <div className="absolute inset-0 -z-10 animate-gradient" />

      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        {/* <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start"> */}
          {/* <p className="animate-grow text-outline-white">Coming soon!</p> */}
          <SnakeGame />
        {/* </main> */}
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          <p className="text-outline-white">E-mail: thais@borgholm.biz</p>
        </footer>
      </div>
    </div>
    // <div>
      
    // </div>
  );
}
