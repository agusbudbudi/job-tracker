import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

// Helper function to format date for input fields
const formatInputDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
};

const JobApplicationModal = ({ isOpen, onClose, onSave, application }) => {
  const statusOptions = [
    "Draft",
    "Applied",
    "HR Interview",
    "User Interview",
    "Head Interview",
    "Technical Test",
    "Ghosting",
    "Failed",
    "Rejected",
    "Offering",
  ];

  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    level: "",
    jobLink: "",
    status: "Draft",
    appliedDate: formatInputDate(new Date()),
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (application) {
        setFormData({
          companyName: application.companyName || "",
          position: application.position || "",
          level: application.level || "",
          jobLink: application.jobLink || "",
          status: application.status || "Draft",
          appliedDate: formatInputDate(application.appliedDate),
          notes: application.notes || "",
        });
      } else {
        setFormData({
          companyName: "",
          position: "",
          level: "",
          jobLink: "",
          status: "Draft",
          appliedDate: formatInputDate(new Date()),
          notes: "",
        });
      }
    }
  }, [isOpen, application]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.position) {
      alert("Company Name and Position are required");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {application ? "Edit" : "Add New"} Application
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Position *
              </label>
              <input
                type="text"
                id="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Level (e.g., Senior, Mid, Junior)
              </label>
              <input
                type="text"
                id="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="jobLink"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Job Posting Link
              </label>
              <input
                type="url"
                id="jobLink"
                value={formData.jobLink}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer appearance-none"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="appliedDate"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Applied Date
              </label>
              <input
                type="date"
                id="appliedDate"
                value={formData.appliedDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md font-medium cursor-pointer"
            >
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;
