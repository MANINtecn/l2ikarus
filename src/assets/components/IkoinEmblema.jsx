import { useId } from 'react'

// Ikoin em losango (a moeda redonda antiga fica so' nas paginas legadas).
export default function IkoinEmblema({ size = 96, className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={`ik${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1b8" /><stop offset=".45" stopColor="#e6c35a" /><stop offset="1" stopColor="#8a661a" />
        </linearGradient>
      </defs>
      <path d="M50 2 L98 50 L50 98 L2 50 Z" fill={`url(#ik${id})`} />
      <path d="M50 12 L88 50 L50 88 L12 50 Z" fill="none" stroke="#6b4e12" strokeWidth="2" />
      <text x="50" y="58" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="900" fontSize="22" fill="#4a3408">IK</text>
    </svg>
  )
}
