import React from 'react'

interface UserIconProps {
  size?: number
  className?: string
}

export const UserIcon: React.FC<UserIconProps> = ({ size = 64, className = "" }) => {
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
        <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <filter id="userGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background circle */}
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="url(#userGradient)"
        filter="url(#userGlow)"
        opacity="0.9"
      />
      
      {/* User head */}
      <circle
        cx="32"
        cy="24"
        r="8"
        fill="rgba(255,255,255,0.9)"
      />
      
      {/* User body */}
      <path
        d="M16 52 C16 42, 22 38, 32 38 C42 38, 48 42, 48 52"
        fill="rgba(255,255,255,0.9)"
      />
      
      {/* Highlight on head */}
      <circle
        cx="28"
        cy="20"
        r="2"
        fill="rgba(255,255,255,0.6)"
      />
      
      {/* Inner circle border */}
      <circle
        cx="32"
        cy="32"
        r="22"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
    </svg>
  )
}