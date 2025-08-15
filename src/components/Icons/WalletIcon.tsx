import React from 'react'

interface WalletIconProps {
  size?: number
  className?: string
}

export const WalletIcon: React.FC<WalletIconProps> = ({ size = 64, className = "" }) => {
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
        <linearGradient id="walletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Wallet body */}
      <rect
        x="8"
        y="18"
        width="48"
        height="32"
        rx="8"
        ry="8"
        fill="url(#walletGradient)"
        filter="url(#glow)"
        opacity="0.9"
      />
      
      {/* Wallet flap */}
      <rect
        x="12"
        y="14"
        width="40"
        height="8"
        rx="4"
        ry="4"
        fill="url(#walletGradient)"
        opacity="0.7"
      />
      
      {/* Card slot */}
      <rect
        x="14"
        y="24"
        width="24"
        height="16"
        rx="3"
        ry="3"
        fill="rgba(255,255,255,0.2)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      
      {/* Money symbol */}
      <circle
        cx="48"
        cy="32"
        r="6"
        fill="rgba(255,255,255,0.9)"
      />
      <text
        x="48"
        y="36"
        textAnchor="middle"
        fill="#3B82F6"
        fontSize="8"
        fontWeight="bold"
      >
        $
      </text>
      
      {/* Highlight */}
      <rect
        x="12"
        y="20"
        width="36"
        height="2"
        rx="1"
        fill="rgba(255,255,255,0.4)"
      />
    </svg>
  )
}