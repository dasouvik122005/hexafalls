"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FloatingCandles({ count = 12 }) {
  const [candles, setCandles] = useState([]);

  useEffect(() => {
    // Generate random positions, scales, and animation delays on the client
    // to avoid hydration mismatch
    const generated = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      top: `${10 + Math.random() * 60}%`,
      scale: 0.5 + Math.random() * 0.7,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 3,
    }));
    setCandles(generated);
  }, [count]);

  if (candles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {candles.map((c) => (
        <motion.div
          key={c.id}
          className="absolute flex flex-col items-center"
          style={{
            left: c.left,
            top: c.top,
            transform: `scale(${c.scale})`,
          }}
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: c.delay,
          }}
        >
          {/* The Flame */}
          <motion.div
            className="w-2.5 h-4 bg-gold-hp rounded-full mb-1 hp-glow-gold"
            style={{
              boxShadow: "0 0 15px 4px rgba(212,175,55,0.6), 0 0 30px rgba(212,175,55,0.3)",
              clipPath: "polygon(50% 0%, 100% 70%, 50% 100%, 0% 70%)",
            }}
            animate={{
              scale: [1, 1.1, 0.9, 1.05, 1],
              opacity: [0.8, 1, 0.7, 1, 0.8],
            }}
            transition={{
              duration: 0.3 + Math.random() * 0.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          {/* The Candle Body */}
          <div
            className="w-3.5 h-14 rounded-sm relative"
            style={{
              background: "linear-gradient(to right, #d4d4ca 0%, #e8e8df 50%, #b8b8b0 100%)",
              boxShadow: "inset 0 4px 6px rgba(0,0,0,0.1), 0 8px 12px rgba(0,0,0,0.5)",
            }}
          >
            {/* Melting wax drip */}
            <div
              className="absolute top-0 right-0 w-1.5 h-4 rounded-b-full opacity-80"
              style={{
                background: "linear-gradient(to bottom, #e8e8df, #b8b8b0)",
              }}
            />
            <div
              className="absolute top-0 left-0 w-1 h-2 rounded-b-full opacity-80"
              style={{
                background: "linear-gradient(to bottom, #e8e8df, #b8b8b0)",
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
