import { createClient } from '@/utils/supabase/server'
import BookmarkList from '@/components/bookmark-list'
import AddBookmarkForm from '@/components/add-bookmark-form'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">My Bookmarks</h1>
                <p className="text-gray-500">Manage your collection of links.</p>
            </div>

            <AddBookmarkForm />

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Your List</h2>
                <BookmarkList
                    initialBookmarks={bookmarks || []}
                    accessToken={session?.access_token}
                />
            </div>
        </div>
    )
}
