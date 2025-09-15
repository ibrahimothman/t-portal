import { Navbar, Footer } from '../components'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
    return (
        <>
            <Navbar />
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 pt-24 pb-24">
                <Outlet />
            </div>
            {/* <Footer /> */}
        </>
    )
}