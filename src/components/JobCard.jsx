import React from "react";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import { ExternalLink } from "lucide-react";

const statusColors = {
  Draft: "bg-gray-100 text-gray-700",
  Applied: "bg-blue-100 text-blue-700",
  "HR Interview": "bg-purple-100 text-purple-700",
  "User Interview": "bg-indigo-100 text-indigo-700",
  "Head Interview": "bg-violet-100 text-violet-700",
  "Technical Test": "bg-cyan-100 text-cyan-700",
  Ghosting: "bg-orange-100 text-orange-700",
  Failed: "bg-red-100 text-red-700",
  Rejected: "bg-red-100 text-red-700",
  Offering: "bg-green-100 text-green-700",
};

const levelColors = {
  Intern: "bg-gray-400",
  Junior: "bg-yellow-400",
  Mid: "bg-blue-400",
  Senior: "bg-purple-400",
  Lead: "bg-red-400",
  Manager: "bg-green-400",
  Director: "bg-indigo-400",
  VP: "bg-pink-400",
  Executive: "bg-teal-400",
};

const formatDate = (dateString) => {
  if (!dateString) {
    return "-";
  }

  const parse = (value) => {
    const direct = new Date(value);
    if (!Number.isNaN(direct.getTime())) {
      return direct;
    }

    const withTime = new Date(`${value}T00:00:00`);
    return Number.isNaN(withTime.getTime()) ? null : withTime;
  };

  const parsedDate = parse(dateString);
  if (!parsedDate) {
    return "-";
  }

  return parsedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const JobCard = ({ job, onClick }) => {
  const displayNotes = job.notes
    ? job.notes.split("\n").slice(0, 2).join("\n")
    : "No notes.";

  return (
    <Card
      className="relative cursor-pointer hover:shadow-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 flex flex-col"
      onClick={() => onClick(job)}
    >
      <span
        className={`absolute -top-0 right-0 text-xs font-semibold px-3 py-1 rounded-tr-xl rounded-bl-xl z-10 ${
          statusColors[job.status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {job.status}
      </span>
      <CardContent className="flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900 pr-12 mb-2">
          {job.companyName}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          {job.level && (
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                levelColors[job.level] || "bg-gray-400"
              }`}
              title={job.level}
            ></span>
          )}
          <span className="text-sm text-slate-700">
            {job.level || "Unspecified Level"}
          </span>
          <span className="text-sm text-slate-600">•</span>
          <span className="text-sm font-semibold text-slate-600">
            {job.position}
          </span>
        </div>

        <p className="text-sm text-slate-500 mb-3 line-clamp-2 flex-grow">
          {displayNotes}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Applied: {formatDate(job.appliedDate)}
          </span>
          {job.jobLink && (
            <a
              href={job.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-blue-500 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors cursor-pointer"
            >
              View Job <ExternalLink size={14} />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
