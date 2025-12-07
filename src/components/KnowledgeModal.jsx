import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { saveKnowledge } from "../utils/knowledgeStorage";

const categories = [
  "Work",
  "Personal",
  "Self-Development",
  "Entertainment",
  "Technology",
  "Health",
  "Finance",
  "Travel",
  "Other",
];

const KnowledgeModal = ({ isOpen, onClose, onSave, knowledge }) => {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    tags: [],
    url: "",
    category: categories[0], // Default to the first category
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (knowledge) {
        setFormData({
          title: knowledge.title || "",
          summary: knowledge.summary || "",
          tags: knowledge.tags || [],
          url: knowledge.url || "",
          category: knowledge.category || categories[0],
        });
      } else {
        setFormData({
          title: "",
          summary: "",
          tags: [],
          url: "",
          category: categories[0],
        });
      }
      setTagInput("");
    }
  }, [isOpen, knowledge]);

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      const newTags = tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "" && !formData.tags.includes(tag));
      setFormData({ ...formData, tags: [...formData.tags, ...newTags] });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.url &&
      !/^(ftp|http|https|hyper|tel|file|magnet):(\/\/)?[^\s$.?#].[^\s]*$/.test(
        formData.url
      )
    ) {
      alert("Please enter a valid URL.");
      return;
    }
    await saveKnowledge({ ...knowledge, ...formData });
    onSave();
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
            {knowledge ? "Edit" : "Add New"} Knowledge
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="summary"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Summary
              </label>
              <textarea
                id="summary"
                value={formData.summary}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
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
                htmlFor="tags"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Type a tag and press Enter"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-semibold flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-500 hover:text-blue-800 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                URL
              </label>
              <input
                type="url"
                id="url"
                value={formData.url}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KnowledgeModal;
