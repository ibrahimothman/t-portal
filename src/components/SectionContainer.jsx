export default function SectionContainer({ children }) {
    return (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-12">
            {children}
        </div>
    )
}