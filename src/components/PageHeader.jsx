import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title }) {
    const navigate = useNavigate()
    return (
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50" aria-label="Go back">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
    )
}