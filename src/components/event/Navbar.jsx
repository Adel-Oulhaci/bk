import { useState } from 'react';

export default function Navbar({ categories, selectedCategory, onSelectCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // const toggleExpand = () => setIsExpanded(prev => !prev);

  return (
    <nav className="bg-white shadow-lg sticky top-[5rem] z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center sm:p-5">
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedCategory === category.id
                        ? 'bg-green-bk text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 
                      ${selectedCategory === category.id
                        ? ' text-white'
                        : 'text-green-bk'
                      }`} />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Navbar: Toggle icons/text */}
        <div className="md:hidden overflow-x-auto">
          {/* <div className="flex items-center justify-between py-4">
            <button 
              onClick={toggleExpand}
              className="text-gray-600 text-sm px-4 py-2"
            >
              {isExpanded ? "Show Icons Only" : "Show All"}
            </button>
          </div> */}
          <div className={`flex py-4 ${isExpanded ? 'flex-wrap' : ''}`}>
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={`flex items-center px-[0.618rem] py-2 rounded-md text-sm font-medium whitespace-nowrap
                    ${selectedCategory === category.id
                      ? 'bg-green-bk text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {(isExpanded || selectedCategory === category.id) && category.label} 
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
