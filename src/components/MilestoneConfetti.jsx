import { useEffect, useState } from 'react'

export function MilestoneConfetti({ active }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (active) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2500)
      return () => clearTimeout(t)
    }
  }, [active])

  if (!visible) return null

  // Respects prefers-reduced-motion
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden motion-reduce:hidden"
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="confetti-particle absolute"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            background: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][i % 5]
          }}
        />
      ))}
    </div>
  )
}
