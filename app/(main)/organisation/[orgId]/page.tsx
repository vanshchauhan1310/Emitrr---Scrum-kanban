import { getOrganization, checkOrganizationExists, cleanupDeletedOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/org-switcher";
import ProjectList from "./_compoenents/project-list";
import { redirect } from "next/navigation";

const OrganisationPage = async ({ params }: { params: Promise<{ orgId: string }> }) => {
  const { orgId } = await params;
  
  // First check if organization exists
  const exists = await checkOrganizationExists(orgId);
  if (!exists) {
    // Try to clean up any remnants
    await cleanupDeletedOrganization(orgId);
    // Redirect to onboarding or home
    redirect('/onboarding');
  }
  
  let organization;
  try {
    organization = await getOrganization({ orgId });
  } catch (error) {
    console.error("Error fetching organization:", error);
    // If we can't fetch the organization, redirect to onboarding
    redirect('/onboarding');
  }

  if (!organization) {
    redirect('/onboarding');
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-5xl font-bold gradient-title pb-2">{organization.name ?? "Unknown"}'s Projects</h1>
        <OrgSwitcher />
      
      </div>
      
      {organization.id && (
        <div className="mb-4">
          <ProjectList orgId={organization.id} />
        </div>
      )}

    </div>
  );
};

export default OrganisationPage;