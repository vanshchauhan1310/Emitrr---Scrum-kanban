"use client";

import { OrganizationSwitcher, SignedIn } from "@clerk/nextjs";
import { useOrganization, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import React from "react";

const OrgSwitcher = () => {
    const { isLoaded } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    const pathname = usePathname();
    if(!isLoaded || !isUserLoaded) {
        return null;
    }

    return <div>
        <SignedIn>
            <OrganizationSwitcher 
             hidePersonal={true}
             afterSelectOrganizationUrl="/organisation/:slug"
             afterCreateOrganizationUrl="/organisation/:slug"
             createOrganizationMode={pathname === "/onboarding" ? "navigation" : undefined}
             createOrganizationUrl="/onboarding"
             />
        </SignedIn>
         </div>
}

export default OrgSwitcher;