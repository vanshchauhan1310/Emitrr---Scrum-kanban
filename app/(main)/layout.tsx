import { syncOrganizationAndMembership } from "@/actions/organization";
import { auth } from "@clerk/nextjs/server";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authData = await auth();

    if (authData.orgId) {
        // This runs on the server for every request in the (main) group.
        // It will find or create the organization and sync the user's admin status.
        try {
            await syncOrganizationAndMembership();
        } catch (error) {
            console.error("Error syncing organization and membership:", error);
            // Continue rendering even if sync fails
        }
    }
    
    return (
        <main className="h-full">
            {children}
        </main>
    )
}