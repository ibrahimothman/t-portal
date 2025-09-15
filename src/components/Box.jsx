export default function Box({ children, colSpan=6 }) {
    return (
        <div className={`rounded-xl border border-gray-200 bg-white p-4 sm:col-span-${colSpan}`}>
            {children}
        </div>
    )
}