'use client'

import { addBookmark } from '@/app/actions'
import { Plus, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function AddBookmarkForm() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            await addBookmark(formData)
            const form = document.querySelector('form') as HTMLFormElement
            if (form) form.reset()
        } catch (error) {
            console.error(error)
            alert('Failed to add bookmark')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-lg font-semibold mb-4">Add New Bookmark</h2>
            <form action={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        name="title"
                        type="text"
                        placeholder="Title (e.g., My Portfolio)"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                </div>
                <div className="flex-[2]">
                    <input
                        name="url"
                        type="url"
                        placeholder="URL (e.g., https://example.com)"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-w-[120px]"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add
                </button>
            </form>
        </div>
    )
}
