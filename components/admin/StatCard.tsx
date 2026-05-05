type Trend = { value: number; positive: boolean }

const COLOR_MAP: Record<string, string> = {
  emerald: 'text-emerald-500',
  yellow:  'text-yellow-400',
  blue:    'text-blue-400',
  purple:  'text-purple-400',
  pink:    'text-pink-400',
  indigo:  'text-indigo-400',
  red:     'text-red-400',
}

type Props = { label: string; value: number; color: string; trend?: Trend }

export default function StatCard({ label, value, color, trend }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${COLOR_MAP[color]}`}>{value}</p>
      {trend && trend.value !== 0 && (
        <p className={`text-xs mt-1.5 font-semibold ${trend.positive ? 'text-emerald-500' : 'text-red-400'}`}>
          {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)} esta semana
        </p>
      )}
      {trend && trend.value === 0 && (
        <p className="text-xs mt-1.5 text-slate-300 dark:text-slate-600">— sin cambios</p>
      )}
    </div>
  )
}
