export default function StatsCard({
  title,
  value,
  delta,
  icon,
  classNames = '',
  textColor,
  onClick,
  selected = false,
  subtitle,
}) {
  const isPos = typeof delta === 'number' && delta > 0;
  const isNeg = typeof delta === 'number' && delta < 0;
  const deltaText =
    typeof delta === 'number'
      ? `${isPos ? '+' : isNeg ? '-' : ''}${Math.round(Math.abs(delta))}%`
      : null;
  const isClickable = typeof onClick === 'function';

  const baseClasses = `
    stats-card rounded-xl
    ${isClickable ? 'cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md' : ''}
  `;

  // ✅ Only apply defaults if no custom classNames provided
  const appliedClasses = classNames
    ? `${baseClasses} ${classNames}`
    : `${baseClasses} ${selected ? 'border-2 border-black' : 'border border-gray-200'} bg-white text-black`;

  return (
    <article
      className={appliedClasses}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(e);
              }
            }
          : undefined
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm">
          <h3 className="text-sm font-medium">{title}</h3>
          {icon && (
            <span
              aria-hidden
              className="inline-flex h-5 w-5 items-center justify-center"
            >
              {icon}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <h2 className={`text-4xl font-semibold ${textColor || ''}`}>
            {value}
          </h2>
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

        {subtitle && <p className="text-xs text-gray-500 -mt-1">{subtitle}</p>}
      </div>
    </article>
  );
}
