import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { sidebarLinksUser } from "@/data/data";
import NavLink from "./NavLink";
import api from "@/utils/axios";
import { getUser } from "@/utils/auth";

const Sidebar = ({ isOpen, onClose }) => {
  const [hasProjects, setHasProjects] = useState(false);

  useEffect(() => {
    const checkUserProjects = async () => {
      try {
        const currentUser = getUser();
        if (!currentUser) {
          setHasProjects(false);
          return;
        }

        // Fetch user projects to check if user has any PM projects
        const projectsResponse = await api.get(`http://localhost:3000/api/v1/projects/user/${currentUser.id}`);
        const allUserProjects = projectsResponse.data.data || [];

        // Filter to only show projects where user is project manager
        const pmProjects = allUserProjects.filter(project => {
          if (project.projectCollaborator && project.projectCollaborator.length > 0) {
            return project.projectCollaborator.some(collab => 
              collab.userId === currentUser.id && collab.isProjectManager === true
            );
          }
          return false;
        });

        setHasProjects(pmProjects.length > 0);
      } catch (error) {
        console.error("Error checking user projects:", error);
        setHasProjects(false);
      }
    };

    checkUserProjects();
  }, []);
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 transform bg-white border-r 
        transition-transform duration-300 ease-in-out lg:translate-x-0 
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } h-screen flex flex-col`}
      >
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-primer">Metro</span>
            <span>Wise</span>
          </h1>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1 overflow-hidden overflow-y-auto flex-1">
          {sidebarLinksUser.map((link, index) => {
            // Hide assessment link if user has no projects and link requires projects
            if (link.showWhenProjects && !hasProjects) {
              return null;
            }
            
            return (
              <NavLink
                key={index}
                {...link}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              />
            );
          })}
        </nav>
      </aside>
    </>
  );
};
export default Sidebar;
