interface DripDividerProps {
  from: string
  to: string
  flip?: boolean
}

export function DripDivider({ from, to, flip = false }: DripDividerProps) {
  const path =
    'M0,0 L400,0 C400,20 390,28 383,28 C375,28 372,16 364,16 C356,16 356,34 346,34 C336,34 338,12 328,12 C318,12 320,44 308,44 C296,44 300,18 288,18 C276,18 280,54 266,54 C252,54 258,22 244,22 C230,22 236,38 222,38 C208,38 214,14 200,14 C186,14 192,48 178,48 C164,48 170,24 156,24 C142,24 148,56 134,56 C120,56 126,20 112,20 C98,20 104,40 90,40 C76,40 82,16 68,16 C54,16 60,50 46,50 C32,50 38,26 24,26 C12,26 8,10 0,4 Z'

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none h-10 w-full sm:h-14 ${flip ? 'rotate-180' : ''}`}
    >
      <svg viewBox="0 0 400 60" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`drip-${from.slice(1)}-${to.slice(1)}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <path
          d={path}
          fill={`url(#drip-${from.slice(1)}-${to.slice(1)})`}
        />
      </svg>
    </div>
  )
}
