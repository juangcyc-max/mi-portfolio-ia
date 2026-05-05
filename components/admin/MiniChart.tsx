type Props = { data: { day: string; count: number }[] }

export default function MiniChart({ data }: Props) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div
            className="w-full bg-emerald-500/30 dark:bg-emerald-500/40 hover:bg-emerald-500/60 rounded-sm transition-colors"
            style={{ height: `${Math.max((d.count / max) * 100, 6)}%` }}
            title={`${d.day}: ${d.count} leads`}
          />
          {(i === 0 || i === data.length - 1 || i === 6) && (
            <span className="text-[8px] text-slate-400 whitespace-nowrap">{d.day}</span>
          )}
        </div>
      ))}
    </div>
  )
}
