"use client"

export const Card = ():React.ReactElement => {
    return(
        <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200">
      {/* Card Image */}
      <img 
        className="w-full h-48 object-cover" 
        src="https://unsplash.com" 
        alt="Product" 
      />
      
      {/* Card Content Area */}
      <div className="p-5">
        {/* Card Category / Tag */}
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mb-2">
          Trending
        </span>
        
        {/* Card Title */}
        <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">
          Classic Sneakers
        </h5>
        
        {/* Card Description */}
        <p className="font-normal text-gray-700 text-sm mb-4">
          Experience ultimate comfort and timeless style with our newly designed everyday sneakers.
        </p>
        
        {/* Card Action Button */}
        <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300">
          Read more
        </button>
      </div>
    </div>
        
    );
}