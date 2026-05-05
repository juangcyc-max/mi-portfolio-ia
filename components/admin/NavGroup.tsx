type Props = { title: string; children: React.ReactNode }

export default function NavGroup({ title, children }: Props) {
  return (
    <div>
      <p className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-2 px-1">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  )
}
