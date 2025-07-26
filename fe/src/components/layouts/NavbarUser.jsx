import React from "react";
import { Menu } from "lucide-react";

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-10 h-16 border-b bg-white px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium hidden sm:inline">
            User / Member
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
