'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function addBookmark(formData: FormData) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const title = formData.get('title') as string
    const url = formData.get('url') as string

    if (!title || !url) {
        throw new Error('Title and URL are required')
    }

    // Basic URL validation
    let validUrl = url
    if (!/^https?:\/\//i.test(url)) {
        validUrl = 'https://' + url
    }

    const { error } = await supabase.from('bookmarks').insert({
        title,
        url: validUrl,
        user_id: user.id,
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
}

export async function deleteBookmark(id: number) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('bookmarks').delete().eq('id', id).eq('user_id', user.id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
}
