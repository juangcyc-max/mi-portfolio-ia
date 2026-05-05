import Link from 'next/link'

const BADGE_COLORS: Record<string, string> = {
  emerald: 'bg-emerald-500',
  yellow:  'bg-yellow-400 text-slate-900',
  blue:    'bg-blue-500',
  purple:  'bg-purple-500',
  indigo:  'bg-indigo-500',
  red:     'bg-red-500',
}

type Props = {
  href: string
  title: string
  description: string
  badge?: number
  badgeColor?: string
}

export default function NavCard({ href, title, description, badge, badgeColor }: Props) {
  return (
    <Link
      href={href}
      className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors block group"
    >
      {badge !== undefined && badge > 0 && (
        <span className={`absolute top-3 right-3 min-w-[22px] h-[22px] px-1.5 rounded-full ${BADGE_COLORS[badgeColor || 'slate']} text-white text-[10px] font-black flex items-center justify-center`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
    </Link>
  )
}
