
import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";

export const checkUser = async () => {
    try {
        console.log("Starting checkUser function...");
        
        const user = await currentUser();
        console.log("Clerk user data:", {
            id: user?.id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.emailAddresses[0]?.emailAddress,
            imageUrl: user?.imageUrl
        });

        if (!user) {
            console.log("No authenticated user found");
            return null;
        }

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id,
            },
        });

        if (existingUser) {
            console.log("User already exists in database:", existingUser);
            return existingUser;
        }

        console.log("Creating new user in database...");

        // Ensure we have required data
        if (!user.emailAddresses || user.emailAddresses.length === 0) {
            console.error("User has no email addresses");
            return null;
        }

        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
        const email = user.emailAddresses[0].emailAddress;

        console.log("Creating user with data:", {
            clerkUserId: user.id,
            name,
            email,
            imageUrl: user.imageUrl
        });

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl || '',
                email,
            },
        });

        console.log("New user created successfully:", newUser);
        return newUser;

    } catch (error) {
        console.error("Error in checkUser function:", error);
        
        // Log more specific error details
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        
        return null;
    }
}