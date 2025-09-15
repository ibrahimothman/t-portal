export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gray-200/60 bg-white/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>© {year} TSG Portal</div>
          <div className="hidden sm:block">All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}


