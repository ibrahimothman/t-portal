
export default function KPICard({ title, value, delta, icon }) {
  const isPos = typeof delta === 'number' && delta > 0
  const isNeg = typeof delta === 'number' && delta < 0
  const deltaText =
    typeof delta === 'number'
      ? `${isPos ? '+' : isNeg ? '-' : ''}${Math.round(Math.abs(delta))}%`
      : null

  return (
      <article className="stats-card">
        {/* Left group: title + value stacked */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
          <h3 className="text-base font-medium">{title}</h3>

            {icon ? (
              typeof icon === 'string' ? (
                // emoji/text icon
                <span aria-hidden className="inline-flex h-5 w-5 items-center justify-center">{icon}</span>
              ) : (
                // a React node (svg component)
                <span aria-hidden className="inline-flex h-5 w-5 items-center justify-center">{icon}</span>
              )
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-4xl font-semibold">{value}</h2>
            {/* Right group: delta chip */}
            {deltaText && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                  isPos
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                    : isNeg
                    ? 'bg-rose-50 text-rose-700 ring-rose-600/20'
                    : 'bg-gray-100 text-gray-700 ring-gray-500/20'
                }`}
              >
              
                {deltaText}
              </span>
            )}
          </div>
        </div>

         
       
      </article>
   
  )
}