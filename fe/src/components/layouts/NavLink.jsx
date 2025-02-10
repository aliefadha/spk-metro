import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
const NavLink = ({ icon: Icon, label, path, subItems, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkActive = () => {
      const currentPath = window.location.pathname;
      const normalizedCurrentPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
      const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;

      setIsActive(normalizedCurrentPath === normalizedPath);
      if (normalizedCurrentPath === normalizedPath && subItems) {
        setIsOpen(true);
      }
    };

    checkActive();
    window.addEventListener('popstate', checkActive);
    return () => window.removeEventListener('popstate', checkActive);
  }, [path, subItems]);

  const handleClick = (e) => {
    if (subItems) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      onClick?.();
    }
  };

  const getCurrentSubPath = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('sub');
    }
    return null;
  };

  const currentSubPath = getCurrentSubPath();

  return (
    <div className="space-y-1">
      <a
        href={path}
        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive
          ? 'bg-secunder text-primer font-medium'
          : 'text-gray-600 hover:bg-gray-100'
          }`}
        onClick={handleClick}
      >
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </div>
        {subItems && (
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </a>

      {subItems && isOpen && (
        <div className="pl-12 space-y-1">
          {subItems.map((subItem, index) => (
            <a
              key={index}
              href={subItem.path}
              className={`block py-2 px-4 rounded-lg transition-colors ${currentSubPath === subItem.path.split('=')[1]
                ? 'text-primer font-medium'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
              onClick={() => onClick?.()}
            >
              {subItem.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
export default NavLink;