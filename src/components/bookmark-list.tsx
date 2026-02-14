'use client'

import { createClient } from '@/utils/supabase/client'
import { deleteBookmark } from '@/app/actions'
import { Trash2, ExternalLink, Globe } from 'lucide-react'
import { useEffect, useState } from 'react'

type Bookmark = {
    id: string
    created_at: string
    title: string
    url: string
    user_id: string
}

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)

    useEffect(() => {
        setBookmarks(initialBookmarks)
    }, [initialBookmarks])

    useEffect(() => {
        const supabase = createClient()

        const channel = supabase
            .channel('realtime-bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    console.log('Realtime change received:', payload)

                    if (payload.eventType === 'INSERT') {
                        const newBookmark = payload.new as Bookmark
                        setBookmarks((current) => {
                            if (current.find(b => b.id === newBookmark.id)) return current
                            return [newBookmark, ...current]
                        })
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((current) =>
                            current.filter((bookmark) => bookmark.id !== payload.old.id)
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const handleDelete = async (id: string) => {
        try {
            await deleteBookmark(id)
        } catch (error) {
            console.error('Failed to delete:', error)
            alert('Failed to delete bookmark')
        }
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <Globe className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No bookmarks yet</h3>
                <p className="text-gray-500 mt-1">Add your first bookmark to get started</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
                >
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Globe className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" />
                        </div>
                        <button
                            onClick={() => handleDelete(bookmark.id)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                            title="Delete bookmark"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-1 truncate" title={bookmark.title}>
                        {bookmark.title}
                    </h3>

                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 truncate transition-colors"
                    >
                        <span className="truncate">{bookmark.url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                </div>
            ))}
        </div>
    )
}