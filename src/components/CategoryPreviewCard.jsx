import React from 'react';
import { ExternalLink } from 'lucide-react';

const CategoryPreviewCard = ({ title, emoji, items }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <span className="text-2xl mr-2">{emoji}</span>
        {title}
      </h3>
      <ul className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline flex justify-between items-center group"
              >
                <span className="truncate pr-2">{item.title}</span>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-700 transition-colors" />
              </a>
            </li>
          ))
        ) : (
          <p className="text-slate-500 text-sm">No items in this category yet.</p>
        )}
      </ul>
    </div>
  );
};

export default CategoryPreviewCard;
