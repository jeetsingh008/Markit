import LoginButton from '@/components/login-button'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center border border-gray-100">
                <h1 className="text-3xl font-bold mb-2 tracking-tight">Markit - Smart Bookmarks</h1>
                <p className="text-gray-500 mb-8">Sign in to manage and sync your bookmarks across devices.</p>
                <div className="flex justify-center">
                    <LoginButton />
                </div>
            </div>
        </div>
    )
}
