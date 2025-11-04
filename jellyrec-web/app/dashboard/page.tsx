import { serverLogout } from "@/app/lib/actions";
import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
    async function handleLogout() {
        'use server';
        const session = await auth();
        if (session && session.user) {
            const baseurl = session.user.baseurl as string;
            const token = session.user.token as string;
            const result = await serverLogout(baseurl, token);
            if (result) {
                await signOut({ redirectTo: '/' });
            } else {
                console.error("Failed to log out from server");
            }
        }
    }

    // enable logout functionality with button click and handle any errors
    return (
        <div>
            <h1>Dashboard</h1>
            <form action={handleLogout}>
                <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
                    Logout
                </button>
            </form>
        </div>
    );
}