# Markit - Smart Bookmark App

A real-time bookmark manager built with Next.js 16, Supabase, and Tailwind CSS.

## Features

- **Google OAuth**: Secure sign-in without passwords.
- **Private Bookmarks**: Row Level Security (RLS) ensures data privacy.
- **Real-time Sync**: Updates across tabs instantly using Supabase Realtime.
- **Server Actions**: Efficient data mutations.

## Setup

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
5.  **Open [http://localhost:3000](http://localhost:3000)**.

## Architecture

- **Auth**: Handled via Supabase SSR helpers and Middleware.
- **Database**: Supabase PostgreSQL with RLS policies.
- **Realtime**: `supabse-js` client subscription in `BookmarkList` component.

## Challenges & Solutions

During the development and deployment of this application, several key challenges were encountered. Here's how i resolved them:

### 1. Google Cloud Console & Supabase Connection
**Challenge:** Connecting Google OAuth with Supabase often results in `redirect_uri_mismatch` errors or failures to exchange the authorization code for a session.
**Solution:**
-   **Google Cloud Console:** Ensure the "Authorized redirect URIs" list includes `https://[PROJECT_REF].supabase.co/auth/v1/callback` exactly.
-   **Supabase Dashboard:** In Authentication -> Providers -> Google, verify that the **Client ID** and **Client Secret** match exactly what was generated in Google Cloud.
-   **Local Development:** Add `http://localhost:3000/auth/callback` to the redirect URIs if testing locally without the Supabase proxy.

### 2. Middleware vs. Proxy Conflict
**Challenge:** Next.js throws an error `Both middleware file "./src/middleware.ts" and proxy file "./src/proxy.ts" are detected` when trying to organize middleware logic. This happens because some guides recommend `proxy.ts` (deprecated convention) while others use `middleware.ts`.
**Solution:**
-   Deleted the redundant `src/middleware.ts` file.
-   Consolidated all logic into `src/proxy.ts` (or vice-versa, ensuring only *one* entry point exists).
-   Updated the `matcher` config to properly ignore static files (`_next/static`, `favicon.ico`, etc.) to prevent infinite loops.

### 3. Styling & Theme Conflicts (Invisible Text)
**Challenge:** The application defaulted to the user's system preference for Dark Mode, but the UI was not fully optimized for it, leading to "white text on white background" issues in the login and dashboard pages.
**Solution:**
-   Modified `src/app/globals.css` to remove the `@media (prefers-color-scheme: dark)` block.
-   Forced the CSS variables (`--background`, `--foreground`) to use the light theme values by default.
-   Ensured all text elements have sufficient contrast against their backgrounds explicitly in Tailwind classes (e.g., `text-gray-900`, `bg-white`).

### 4. Production Deployment Challenges
**Challenge:** Encountered a `redirect_uri_mismatch` error after deploying to Vercel. Even with successful local authentication, the production environment failed to complete the Google OAuth "handshake."
**Solution:**
-   **Google Cloud Console:** Updated the credentials to include the Vercel production domain in both "Authorized JavaScript origins" and "Authorized redirect URIs" (pointing to the Supabase auth callback).
-   **Supabase Settings:** Reconfigured Supabase Auth Settings by updating the "Site URL" to the production domain and adding wildcard redirect paths (`/**`) to support deep-linking and preview deployments.
