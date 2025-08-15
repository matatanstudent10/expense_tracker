import React from 'react'

interface CheckIconProps {
  size?: number
  className?: string
}

export const CheckIcon: React.FC<CheckIconProps> = ({ size = 64, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <filter id="checkGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer ring */}
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="url(#checkGradient)"
        filter="url(#checkGlow)"
        opacity="0.9"
      />
      
      {/* Inner ring */}
      <circle
        cx="32"
        cy="32"
        r="22"
        fill="rgba(255,255,255,0.1)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      
      {/* Check mark */}
      <path
        d="M20 32 L28 40 L44 24"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Highlight */}
      <circle
        cx="26"
        cy="26"
        r="4"
        fill="rgba(255,255,255,0.3)"
      />
    </svg>
  )
}