
import React, { useState } from 'react';
import { QuestionCategory } from '../types';
import { ALL_CATEGORIES } from '../constants';

interface CategorySelectionProps {
  onCategoriesSet: (categories: QuestionCategory[]) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ onCategoriesSet }) => {
  const [selectedCategories, setSelectedCategories] = useState<Set<QuestionCategory>>(new Set([QuestionCategory.FUN]));

  const handleCategoryChange = (category: QuestionCategory) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.size === 0) {
      alert('Please select at least one category.');
      return;
    }
    onCategoriesSet(Array.from(selectedCategories));
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-pink-400">Select Categories</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {ALL_CATEGORIES.map(category => (
            <label
              key={category}
              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 ease-in-out
                ${selectedCategories.has(category) ? 'bg-pink-500 border-pink-400 text-white ring-2 ring-pink-300' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
            >
              <input
                type="checkbox"
                checked={selectedCategories.has(category)}
                onChange={() => handleCategoryChange(category)}
                className="form-checkbox h-5 w-5 text-pink-600 bg-slate-600 border-slate-500 rounded focus:ring-pink-500 focus:ring-offset-slate-800"
              />
              <span className="font-medium">{category}</span>
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500 transition-colors duration-150"
        >
          Start Game!
        </button>
      </form>
    </div>
  );
};

export default CategorySelection;
