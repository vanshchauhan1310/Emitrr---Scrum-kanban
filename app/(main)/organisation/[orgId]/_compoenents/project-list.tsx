import { getProject } from "@/actions/project"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PlusIcon, FolderIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import DeleteProject from "./delete-project"

export default async function ProjectList({orgId}: {orgId: string}) {
    const projects = await getProject(orgId)

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="text-center space-y-6">
                    <div className="relative">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                            <FolderIcon className="w-12 h-12 text-blue-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                            <PlusIcon className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold gradient-title">No projects yet</h2>
                        <p className="text-lg text-gray-400 max-w-md">
                            Get started by creating your first project to organize your work and track progress.
                        </p>
                    </div>
                    
                    <Link href="/project/create">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Create Your First Project
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold gradient-title">Your Projects</h2>
              
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="relative group">
                        <Link href={`/project/${project.id}`}>
                            <Card className="group hover:bg-slate-800/50 transition-all duration-200 border-slate-700 hover:border-slate-600 cursor-pointer transform hover:scale-105">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-semibold group-hover:text-blue-400 transition-colors">
                                            {project.name}
                                        </CardTitle>
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                    <p className="text-xs text-gray-500 font-mono bg-slate-800 px-2 py-1 rounded w-fit">
                                        {project.key}
                                    </p>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-sm text-gray-400 line-clamp-2">
                                        {project.description || "No description provided"}
                                    </p>
                                    <div className="mt-4 flex items-center text-xs text-gray-500">
                                        <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                        
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            <DeleteProject projectId={project.id} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}