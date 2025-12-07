import { NavLink } from "react-router-dom";
import { BriefcaseBusiness, BookMarked } from "lucide-react";
import lamarajaLogo from "../assets/lamaraja-logo.png";

const Sidebar = () => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-600 font-bold" // Active: bold text, icon inherits text color
        : "text-slate-700 hover:bg-slate-100 hover:text-blue-700 " // Inactive: normal text, icon inherits text color
    }`;

  return (
    <aside className="w-52 h-screen bg-white flex flex-col shadow-md">
      <div className="p-4">
        <img src={lamarajaLogo} alt="Lamaraja Logo" className="w-40 mx-auto" />
      </div>
      <nav className="flex-1 p-4">
        <ul>
          <li className="mb-2">
            <NavLink to="/job-tracking" className={navLinkClasses}>
              <BriefcaseBusiness className="mr-3 size-4" />
              <span className="font-normal">Job Tracking</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/knowledge" className={navLinkClasses}>
              <BookMarked className="mr-3 size-4" />
              <span className="font-normal">Knowledge</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
