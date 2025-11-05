import { signOut } from "@/app/lib/actions";

export default async function DashboardPage() {
    // enable logout functionality with button click and handle any errors
    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={signOut}>Logout</button>
        </div>
    );
}