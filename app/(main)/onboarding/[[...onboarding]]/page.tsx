"use client";

import { OrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const OnboardingPage = () => {
    return (
      <div className="flex justify-center items-center pt-14">
        <OrganizationList
          hidePersonal={true}
          afterSelectOrganizationUrl="/organisation/:slug"
          afterCreateOrganizationUrl="/organisation/:slug"
        />
      </div>
    );
  };

export default OnboardingPage;