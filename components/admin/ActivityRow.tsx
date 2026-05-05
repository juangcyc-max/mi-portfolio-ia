export type ActivityItem = {
  id: string
  type: 'lead' | 'message' | 'incident'
  name: string
  detail: string
  time: string
}

const TYPE_CONFIG = {
  lead:     { label: 'Lead',       dot: 'bg-emerald-500' },
  message:  { label: 'Mensaje',    dot: 'bg-blue-500' },
  incident: { label: 'Incidencia', dot: 'bg-red-500' },
}

function relativeTime(d: string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (mins < 60)   return `${mins}m`
  if (mins < 1440) return `${Math.floor(mins / 60)}h`
  return `${Math.floor(mins / 1440)}d`
}

export default function ActivityRow({ item }: { item: ActivityItem }) {
  const cfg = TYPE_CONFIG[item.type]
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{item.name}</p>
        <p className="text-xs text-slate-400 truncate">{item.detail}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[10px] text-slate-400">{relativeTime(item.time)}</p>
        <p className="text-[10px] text-slate-300 dark:text-slate-600">{cfg.label}</p>
      </div>
    </div>
  )
}
