import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export default function SearchBar({ 
  selectedTypes, setSelectedTypes, 
  selectedAmenities, setSelectedAmenities,
  dates, setDates,
  onApply 
}) {
  const handleTypeToggle = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-24 border border-gray-100">
      <h2 className="text-[#0f284f] text-xl font-bold uppercase tracking-wider mb-8">
        Filter By
      </h2>

      {/* Dates */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Dates
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Check In</label>
            <input 
              type="date"
              value={dates.checkIn}
              onChange={(e) => setDates({...dates, checkIn: e.target.value})}
              className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:outline-none focus:border-[#0f284f]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Check Out</label>
            <input 
              type="date"
              value={dates.checkOut}
              onChange={(e) => setDates({...dates, checkOut: e.target.value})}
              className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:outline-none focus:border-[#0f284f]"
            />
          </div>
        </div>
      </div>



      {/* Room Type */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Room Type
        </h3>
        <div className="space-y-4">
          {["Single", "Double", "Suite", "Deluxe"].map((type) => (
            <div key={type} className="flex items-center space-x-3">
              <Checkbox 
                id={`type-${type}`} 
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => handleTypeToggle(type)}
              />
              <label 
                htmlFor={`type-${type}`}
                className="text-sm text-gray-600 font-medium cursor-pointer"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Amenities
        </h3>
        <div className="space-y-4">
          {["WiFi", "AC", "Breakfast", "Swimming Pool", "Gym", "Mini Bar"].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-3">
              <Checkbox 
                id={`amenity-${amenity.replace(' ', '-')}`} 
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => handleAmenityToggle(amenity)}
              />
              <label 
                htmlFor={`amenity-${amenity.replace(' ', '-')}`}
                className="text-sm text-gray-600 font-medium cursor-pointer"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <button 
        onClick={onApply}
        className="w-full bg-[#0f284f] text-white font-bold uppercase tracking-wider py-4 rounded-sm hover:bg-[#1a3d72] transition-colors mt-4"
      >
        Apply Filters
      </button>
    </div>
  );
}
