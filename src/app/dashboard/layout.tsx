import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { signOut } from '@/app/actions'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">
                            SB
                        </div>
                        <span className="font-semibold text-lg tracking-tight">Smart Bookmarks</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
                        <form action={signOut}>
                            <button
                                type="submit"
                                className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-gray-100"
                                title="Sign out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </header>
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {children}
            </main>
        </div>
    )
}
