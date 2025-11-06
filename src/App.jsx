import React, { useState, useEffect } from "react";
import lamarajaLogo from "./assets/lamaraja.png";
import {
  Plus,
  Search,
  ArrowLeft,
  ExternalLink,
  Calendar,
  Briefcase,
  TrendingUp,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import "./utils/storage"; // Import storage mock

const App = () => {
  const [applications, setApplications] = useState([]);
  const [view, setView] = useState("list");
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");

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

  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    level: "",
    jobLink: "",
    status: "Draft",
    appliedDate: "",
    notes: "",
  });

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (selectedApp) {
      setNotesDraft(selectedApp.notes || "");
    } else {
      setNotesDraft("");
    }
    setIsEditingNotes(false);
  }, [selectedApp]);

  const loadApplications = async () => {
    try {
      const keys = await window.storage.list("job:");
      if (keys && keys.keys) {
        const apps = await Promise.all(
          keys.keys.map(async (key) => {
            try {
              const result = await window.storage.get(key);
              return result ? JSON.parse(result.value) : null;
            } catch {
              return null;
            }
          })
        );
        setApplications(apps.filter((app) => app !== null));
      }
    } catch {
      console.log("No saved applications yet");
    }
  };

  const generateId = () => {
    return (
      "JOB" + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase()
    );
  };

  const addLogActivity = (status) => {
    const now = new Date();
    return `Status updated to ${status} at ${now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const addNotesActivity = (notes) => {
    const now = new Date();
    const hasContent = notes && notes.trim().length > 0;
    const sanitizedContent = hasContent
      ? notes.trim().replace(/"/g, "'")
      : "(empty)";
    return `Notes updated to "${sanitizedContent}" at ${now.toLocaleString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
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

  const formatLogMessage = (entry) => {
    const statusMatch = entry.match(/^Status updated to (.+) at (.+)$/);
    if (statusMatch) {
      return {
        prefix: "Status updated to ",
        highlight: statusMatch[1],
        suffix: ` at ${statusMatch[2]}`,
      };
    }

    const notesMatch = entry.match(/^Notes updated to "(.*)" at (.+)$/);
    if (notesMatch) {
      return {
        prefix: 'Notes updated to "',
        highlight: notesMatch[1],
        suffix: `" at ${notesMatch[2]}`,
      };
    }

    return {
      prefix: "",
      highlight: entry,
      suffix: "",
    };
  };

  const handleSubmit = async () => {
    if (!formData.companyName || !formData.position) {
      alert("Company Name and Position are required");
      return;
    }

    const todayISO = new Date().toISOString().split("T")[0];

    const newApp = {
      id: generateId(),
      ...formData,
      appliedDate: formData.appliedDate || todayISO,
      createdAt: new Date().toISOString(),
      logActivity: [addLogActivity(formData.status)],
    };

    try {
      await window.storage.set(`job:${newApp.id}`, JSON.stringify(newApp));
      await loadApplications();
      setShowAddForm(false);
      setFormData({
        companyName: "",
        position: "",
        level: "",
        jobLink: "",
        status: "Draft",
        appliedDate: todayISO,
        notes: "",
      });
    } catch (error) {
      console.error("Error saving application:", error);
      alert("Error saving application. Please try again.");
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const result = await window.storage.get(`job:${appId}`);
      if (result) {
        const app = JSON.parse(result.value);
        app.status = newStatus;
        app.logActivity = [
          ...(app.logActivity || []),
          addLogActivity(newStatus),
        ];
        await window.storage.set(`job:${appId}`, JSON.stringify(app));
        await loadApplications();
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp(app);
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleNotesSave = async () => {
    if (!selectedApp) {
      return;
    }

    try {
      const result = await window.storage.get(`job:${selectedApp.id}`);
      const baseApp = result ? JSON.parse(result.value) : selectedApp;
      const notesLogEntry = addNotesActivity(notesDraft);
      const updatedApp = {
        ...baseApp,
        notes: notesDraft,
        logActivity: [...(baseApp.logActivity || []), notesLogEntry],
      };

      await window.storage.set(
        `job:${selectedApp.id}`,
        JSON.stringify(updatedApp)
      );
      await loadApplications();
      setSelectedApp(updatedApp);
      setIsEditingNotes(false);
    } catch (error) {
      console.error("Error saving notes:", error);
      alert("Error saving notes. Please try again.");
    }
  };

  const handleDelete = async (appId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await window.storage.delete(`job:${appId}`);
        await loadApplications();
        setView("list");
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = filterStatus === "All" || app.status === filterStatus;
    const matchesSearch =
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "Applied").length,
    interviewing: applications.filter((a) =>
      [
        "HR Interview",
        "User Interview",
        "Head Interview",
        "Technical Test",
      ].includes(a.status)
    ).length,
    offering: applications.filter((a) => a.status === "Offering").length,
  };

  if (view === "detail" && selectedApp) {
    const activityLogs = selectedApp.logActivity
      ? [...selectedApp.logActivity].reverse()
      : [];
    const totalLogs = activityLogs.length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Applications</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 sm:px-8 sm:py-8 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-blue-100 text-sm font-medium mb-2">
                    {selectedApp.id}
                  </p>
                  <h1 className="text-3xl font-bold mb-2">
                    {selectedApp.position}
                  </h1>
                  <p className="text-xl text-blue-100">
                    {selectedApp.companyName}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    statusColors[selectedApp.status]
                  }`}
                >
                  {selectedApp.status}
                </span>
              </div>
            </div>

            <div className="px-6 py-8 sm:px-8">
              <div className="grid grid-cols-1 md:grid-cols-[2.5fr_minmax(0,1fr)] gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500 block mb-1">
                      Level
                    </label>
                    <p className="text-slate-900 font-medium">
                      {selectedApp.level || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 block mb-1">
                      Applied Date
                    </label>
                    <p className="text-slate-900 font-medium">
                      {formatDate(selectedApp.appliedDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 block mb-1">
                      Job Posting Link
                    </label>
                    {selectedApp.jobLink ? (
                      <a
                        href={selectedApp.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-2 font-medium cursor-pointer"
                      >
                        View Job Posting <ExternalLink size={16} />
                      </a>
                    ) : (
                      <p className="text-slate-900 font-medium">-</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-500 block mb-2">
                    Update Status
                  </label>
                  <div className="relative">
                    <select
                      value={selectedApp.status}
                      onChange={(e) =>
                        handleStatusUpdate(selectedApp.id, e.target.value)
                      }
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
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-500">
                    Notes
                  </label>
                  {!isEditingNotes && (
                    <button
                      onClick={() => {
                        setNotesDraft(selectedApp.notes || "");
                        setIsEditingNotes(true);
                      }}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer inline-flex items-center gap-2"
                    >
                      <i className="uil uil-edit-alt" aria-hidden="true"></i>
                      Edit Notes
                    </button>
                  )}
                </div>
                {isEditingNotes ? (
                  <div>
                    <textarea
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[120px]"
                    />
                    <div className="flex gap-3 mt-3 justify-end">
                      <button
                        onClick={() => {
                          setNotesDraft(selectedApp.notes || "");
                          setIsEditingNotes(false);
                        }}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleNotesSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {selectedApp.notes || "No notes added"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500 block mb-3">
                  Activity Log
                </label>
                {activityLogs.length > 0 ? (
                  <div className="relative pl-0">
                    <div className="absolute left-[16px] top-2 bottom-2 w-px bg-slate-100 -translate-x-1/2 transform" />
                    <div className="space-y-4">
                      {activityLogs.map((log, index) => {
                        const isLatest = index === 0;
                        const originalIndex = totalLogs - 1 - index;
                        const { prefix, highlight, suffix } =
                          formatLogMessage(log);

                        return (
                          <div
                            key={`${selectedApp.id}-log-${originalIndex}`}
                            className="relative"
                          >
                            <span
                              className={`absolute left-[16px] top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 ${
                                isLatest
                                  ? "border-blue-500 bg-blue-100"
                                  : "border-slate-300 bg-white"
                              }`}
                            />
                            <p
                              className={`ml-8 text-sm leading-relaxed ${
                                isLatest ? "text-blue-700" : "text-slate-600"
                              }`}
                            >
                              {prefix}
                              <span className="font-semibold text-current">
                                {highlight}
                              </span>
                              {suffix}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No activity recorded yet.
                  </p>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={() => handleDelete(selectedApp.id)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer"
                >
                  Delete Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={lamarajaLogo}
              alt="Lamaraja Logo"
              className="h-20 w-auto rounded-full object-cover"
            />
            {/* <h1 className="text-3xl font-bold text-slate-900">
              Job Application Tracker
            </h1> */}
          </div>
          <p className="text-slate-600">
            <b>Job Application Tracker</b> | Track and manage your job
            applications
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl p-6  bg-blue-100/80">
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="text-sm font-medium text-blue-700 tracking-wide">
                  Total Applications
                </p>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-200/80 flex items-center justify-center">
                <Briefcase className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-6  bg-yellow-100/80">
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="text-sm font-medium text-yellow-700 tracking-wide">
                  Applied
                </p>
                <p className="text-3xl font-bold text-yellow-900 mt-2">
                  {stats.applied}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-200/80 flex items-center justify-center">
                <TrendingUp className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-6  bg-purple-100/80">
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="text-sm font-medium text-purple-700  tracking-wide">
                  In Interview
                </p>
                <p className="text-3xl font-bold text-purple-900 mt-2">
                  {stats.interviewing}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-200/80 flex items-center justify-center">
                <Calendar className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-6  bg-green-100/80">
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="text-sm font-medium text-green-700 tracking-wide">
                  Offers
                </p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {stats.offering}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-200/80 flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search company or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer appearance-none"
                  >
                    <option value="All">All Status</option>
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
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md font-medium w-full md:w-auto justify-center cursor-pointer"
              >
                <Plus size={20} />
                Add Application
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="p-6 bg-white border-b border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company Name *"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="text"
                  placeholder="Position *"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="text"
                  placeholder="Level (e.g., Senior, Mid, Junior)"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="url"
                  placeholder="Job Posting Link"
                  value={formData.jobLink}
                  onChange={(e) =>
                    setFormData({ ...formData, jobLink: e.target.value })
                  }
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <div className="relative w-full">
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
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
                <input
                  type="date"
                  value={formData.appliedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, appliedDate: e.target.value })
                  }
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <textarea
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none md:col-span-2"
                  rows="3"
                />
                <div className="md:col-span-2 flex gap-3 justify-end">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                  >
                    Save Application
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Job Link
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No applications found. Click Add Application to get
                      started!
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app, index) => (
                    <tr
                      key={app.id}
                      onClick={() => {
                        setSelectedApp(app);
                        setView("detail");
                      }}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-600">{index + 1}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">
                          {app.companyName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {app.position}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[app.status]
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(app.appliedDate)}
                      </td>
                      <td className="px-6 py-4">
                        {app.jobLink ? (
                          <a
                            href={app.jobLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="text-sm font-medium">View</span>
                            <ExternalLink size={16} />
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
