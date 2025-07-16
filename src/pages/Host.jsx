import React, { useState, useRef } from 'react';
import { Calendar, Clock, ChevronDown, ChevronLeft, ChevronRight, HelpCircle, MapPin, Users, Upload, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import SearchBox from '../components/Searchbox';


export default function Host() {
  const [eventTitle, setEventTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [locationType, setLocationType] = useState('physical');
  const [venueAddress, setVenueAddress] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [capacity, setCapacity] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [mapCoordinates, setMapCoordinates] = useState([28.6139, 77.2090]); // default Delhi


  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const categories = [
    'Business & Professional',
    'Food & Drink',
    'Health & Wellness',
    'Music',
    'Arts & Culture',
    'Sports & Fitness',
    'Technology',
    'Education',
    'Fashion & Beauty',
    'Film & Media'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">EventEase</span>
              </div>
            </div>
            
            <nav className="flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Discover</a>
              <a href="#" className="text-blue-600 px-3 py-2 text-sm font-medium">My Events</a>
            </nav>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">J</span>
              </div>
              <span className="text-sm font-medium text-gray-900">John D.</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Host New Event</h1>
          <p className="text-gray-600">Fill out the details below to create your event</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Basic Information */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            {/* Event Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title <span className="text-red-500">*</span>
                <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g., Sunset Yoga at Beachside"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
                <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-left flex items-center justify-between"
                >
                  <span className={category ? 'text-gray-900' : 'text-gray-500'}>
                    {category || 'Select a category'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {showCategoryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 outline-none transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Event Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Description <span className="text-red-500">*</span>
                <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give attendees a reason to show up..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              />
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-blue-600">Minimum 300 characters</span>
                <span className="text-gray-500">{description.length}/300</span>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Date and Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                  <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="mm/dd/yyyy"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10"
                  />
                  <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time <span className="text-red-500">*</span>
                  <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="--:--- --"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10"
                  />
                  <Clock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                  <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="mm/dd/yyyy"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10"
                  />
                  <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time <span className="text-red-500">*</span>
                  <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="--:--- --"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10"
                  />
                  <Clock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>
              
              {/* Location Type Radio Buttons */}
              <div className="flex items-center space-x-6 mb-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="locationType"
                    value="physical"
                    checked={locationType === 'physical'}
                    onChange={(e) => setLocationType(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Physical Location</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="locationType"
                    value="online"
                    checked={locationType === 'online'}
                    onChange={(e) => setLocationType(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Online Event</span>
                </label>
              </div>

              {/* Venue or Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue or Address <span className="text-red-500">*</span>
                  <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="Search for venue or type address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pl-10"
                  />
                  <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>



              {/* Map */}
              <div className="mb-6 z-0">
                              <SearchBox onResult={(coords) => setMapCoordinates(coords)} />

  <MapComponent location={mapCoordinates} onLocationChange={setMapCoordinates} />
</div>

              {/* Address Lines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Details</h2>
              
              {/* Capacity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity
                  <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Maximum number of attendees"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pl-10"
                  />
                  <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Cover Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                  <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {coverImage ? (
                    <div className="relative">
                      <img 
                        src={coverImage} 
                        alt="Cover preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button 
                        onClick={() => setCoverImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop your image here, or{' '}
                        <button 
                          onClick={handleBrowseClick}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-xs text-gray-500">
                        Recommended size: 1920 x 1080 pixels (JPG, PNG, WebP)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mb-8">
                <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                  Save as Draft
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Publish Event</span>
                </button>
              </div>
            </div>

           
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* EventEase Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">EventEase</h3>
              <p className="text-gray-600 text-sm mb-4">
                Discover and host amazing events in your neighborhood.
              </p>
            </div>

            {/* Company Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">COMPANY</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Blog</a></li>
              </ul>
            </div>

            {/* Support Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">SUPPORT</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</a></li>
              </ul>
            </div>

            {/* Connect Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">CONNECT</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">© 2022 EventEase. All rights reserved.</p>
            
            {/* Pagination */}
            
          </div>
        </div>
      </footer>
    </div>
  );
}