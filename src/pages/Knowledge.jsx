import { useState, useEffect } from "react";
import {
  Plus,
  ExternalLink,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  Copy,
} from "lucide-react";
import KnowledgeModal from "../components/KnowledgeModal";
import Card from "../components/ui/Card";
import CardContent from "../components/ui/CardContent";
import { getKnowledges, deleteKnowledge } from "../utils/knowledgeStorage";

const Knowledge = () => {
  const [knowledges, setKnowledges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKnowledge, setSelectedKnowledge] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [allTags, setAllTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    loadKnowledges();
  }, []);

  const loadKnowledges = async () => {
    const data = await getKnowledges();
    setKnowledges(data);
    const tags = new Set(data.flatMap((k) => k.tags).filter(Boolean));
    setAllTags(["All", ...tags]);
    const categories = new Set(data.map((k) => k.category).filter(Boolean));
    setAllCategories(["All", ...categories]);
  };

  const handleAddKnowledge = () => {
    setSelectedKnowledge(null);
    setIsModalOpen(true);
  };

  const handleEditKnowledge = (knowledge) => {
    setSelectedKnowledge(knowledge);
    setIsModalOpen(true);
  };

  const handleDeleteKnowledge = async (id) => {
    if (window.confirm("Are you sure you want to delete this knowledge?")) {
      await deleteKnowledge(id);
      loadKnowledges();
    }
  };

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy URL: ", err);
      alert("Failed to copy URL.");
    }
  };

  const handleSave = () => {
    loadKnowledges();
    setIsModalOpen(false);
  };

  const filteredKnowledges = knowledges.filter((knowledge) => {
    const matchesSearch = knowledge.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTag =
      selectedTag === "All" ||
      (knowledge.tags && knowledge.tags.includes(selectedTag));
    const matchesCategory =
      selectedCategory === "All" || knowledge.category === selectedCategory;
    return matchesSearch && matchesTag && matchesCategory;
  });

  const categoryEmojis = {
    Work: "💼",
    Personal: "🏡",
    "Self-Development": "🌱",
    Entertainment: "🎬",
    Technology: "💻",
    Health: "❤️",
    Finance: "💰",
    Travel: "✈️",
    Other: "✨",
  };

  const categoryColorClasses = {
    Work: "bg-blue-100 text-blue-700",
    Personal: "bg-green-100 text-green-700",
    "Self-Development": "bg-purple-100 text-purple-700",
    Entertainment: "bg-pink-100 text-pink-700",
    Technology: "bg-indigo-100 text-indigo-700",
    Health: "bg-red-100 text-red-700",
    Finance: "bg-yellow-100 text-yellow-700",
    Travel: "bg-teal-100 text-teal-700",
    Other: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="flex justify-between items-center ">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Knowledge Base
              </h1>
            </div>
            <p className="text-slate-600">
              Access helpful resources and store important career info
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
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
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full md:w-48 pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer appearance-none"
                  >
                    {allCategories.map((category) => (
                      <option key={category} value={category}>
                        {category === "All" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                <div className="relative">
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full md:w-48 pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer appearance-none"
                  >
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag === "All" ? "All Tags" : tag}
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
                onClick={handleAddKnowledge}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md font-medium w-full md:w-auto justify-center cursor-pointer"
              >
                <Plus size={20} />
                Add Knowledge
              </button>
            </div>
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredKnowledges.length === 0 ? (
              <p className="col-span-full text-center text-slate-500 py-8">
                No knowledge entries found.
              </p>
            ) : (
              filteredKnowledges.map((knowledge) => {
                const emoji = knowledge.category
                  ? categoryEmojis[knowledge.category] || "✨"
                  : "✨";
                const categoryClass = knowledge.category
                  ? categoryColorClasses[knowledge.category] ||
                    "bg-gray-100 text-gray-700"
                  : "bg-gray-100 text-gray-700";

                return (
                  <Card
                    key={knowledge.id}
                    className="relative cursor-pointer hover:shadow-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 flex flex-col" // Added pt-6 for space for label
                    onClick={() => handleEditKnowledge(knowledge)} // Make the whole card clickable
                  >
                    {knowledge.category && (
                      <span
                        className={`absolute -top-0 right-0 text-xs font-semibold px-3 py-1 rounded-tr-xl rounded-bl-xl z-10 ${categoryClass}`}
                      >
                        {emoji} {knowledge.category}
                      </span>
                    )}
                    <CardContent className="flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 pr-4">
                          {knowledge.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2 flex-grow">
                        {knowledge.summary ||
                          knowledge.content ||
                          "No content available."}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {knowledge.tags &&
                          knowledge.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-normal"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                      <div className="flex items-center mt-4 pt-4 border-t border-slate-100">
                        {knowledge.url && (
                          <a
                            href={knowledge.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-blue-500 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors cursor-pointer"
                            title="View URL"
                          >
                            View URL
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <div className="ml-auto flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyUrl(knowledge.url);
                            }}
                            className="text-blue-600 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Copy URL"
                          >
                            <Copy size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteKnowledge(knowledge.id);
                            }}
                            className="text-red-600 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Knowledge"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
      <KnowledgeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        knowledge={selectedKnowledge}
      />
    </div>
  );
};

export default Knowledge;
