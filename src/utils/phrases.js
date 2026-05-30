const PHRASES = [
  "Show up every day. That's it.",
  "The gap between who you are and who you want to be is what you do today.",
  "Small steps, taken daily, move mountains.",
  "You came back. That's the whole game.",
  "Consistency beats intensity, every time.",
  "Every day you show up is a vote for the person you're becoming.",
  "The best time to start was yesterday. The second best time is today.",
  "You don't have to be perfect. You just have to be present.",
  "Progress, not perfection.",
  "One day at a time. This day.",
  "You're building something real, one day at a time.",
  "Discipline is choosing between what you want now and what you want most.",
  "The secret of your future is hidden in your daily routine.",
  "Make today count.",
  "Small wins compound into big changes.",
  "You showed up again. That matters more than you know.",
  "Every morning is a chance to get better.",
  "You're further along than you were yesterday.",
  "The journey of a thousand miles begins with a single step.",
  "Today is a good day to be your best self."
]

export function getDailyPhrase() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  return PHRASES[dayOfYear % PHRASES.length]
}
