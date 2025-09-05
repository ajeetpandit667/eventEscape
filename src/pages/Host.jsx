import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, ChevronLeft, ChevronRight, HelpCircle, MapPin, Users, Upload, Send, Facebook, Twitter, Instagram, Linkedin, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import SearchBox from '../components/SearchBox';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Host() {
  const navigate = useNavigate();
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
  const [price, setPrice] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState([28.6139, 77.2090]); // default Delhi
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);

  // Fetch categories from API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setCategories(data.results || data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

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
      setCoverImageFile(file);
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

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!eventTitle.trim()) {
      newErrors.eventTitle = 'Event title is required';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!description.trim()) {
      newErrors.description = 'Event description is required';
    } else if (description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (!venueAddress.trim()) {
      newErrors.venueAddress = 'Venue or address is required';
    }

    if (capacity && isNaN(capacity)) {
      newErrors.capacity = 'Capacity must be a number';
    }

    if (!isFree && (!price || isNaN(price))) {
      newErrors.price = 'Please enter a valid price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (isDraft = false) => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Basic event data
      const eventData = {
        title: eventTitle,
        description: description,
        start_date: `${startDate}T${startTime}`,
        end_date: `${endDate}T${endTime}`,
        location: venueAddress,
        address_line_1: addressLine1,
        address_line_2: addressLine2,
        latitude: mapCoordinates[0],
        longitude: mapCoordinates[1],
        capacity: capacity ? parseInt(capacity) : 0,
        price: isFree ? 0 : parseFloat(price),
        is_free: isFree,
        status: isDraft ? 'draft' : 'published'
      };

      // Add category if selected
      if (category) {
        eventData.category = category;
      }

      // Append all data to FormData
      Object.keys(eventData).forEach(key => {
        formData.append(key, eventData[key]);
      });

      // Append cover image if selected
      if (coverImageFile) {
        formData.append('cover_image', coverImageFile);
      }

      const response = await fetch('http://127.0.0.1:8000/api/events/', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for FormData
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(true);
        
        // Show success message and redirect after 2 seconds
        setTimeout(() => {
          navigate('/my-events');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Error creating event:', errorData);
        
        // Handle specific field errors
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setErrors({ general: 'Failed to create event. Please try again.' });
        }
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({ general: 'Network error. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    handleSubmit(true);
  };

  const handlePublishEvent = () => {
    handleSubmit(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Success Message */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Event created successfully! Redirecting to My Events...</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Host New Event</h1>
          <p className="text-gray-600">Fill out the details below to create your event</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {errors.general}
            </div>
          )}

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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.eventTitle ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.eventTitle && (
                <p className="text-red-500 text-sm mt-1">{errors.eventTitle}</p>
              )}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-left flex items-center justify-between ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <span className={category ? 'text-gray-900' : 'text-gray-500'}>
                    {category ? categories.find(c => c.id == category)?.name || category : 'Select a category'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {showCategoryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategory(cat.id);
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 outline-none transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-blue-600">Minimum 50 characters</span>
                <span className={`${description.length < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                  {description.length}/50
                </span>
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="mb-10">
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
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10 ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time <span className="text-red-500">*</span>
                  <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10 ${
                      errors.startTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <Clock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                  <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10 ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time <span className="text-red-500">*</span>
                  <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10 ${
                      errors.endTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <Clock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
                {errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
                )}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pl-10 ${
                    errors.venueAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.venueAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.venueAddress}</p>
              )}
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
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Maximum number of attendees"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pl-10 ${
                    errors.capacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.capacity && (
                <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
                <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" />
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceType"
                    checked={isFree}
                    onChange={() => setIsFree(true)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Free Event</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceType"
                    checked={!isFree}
                    onChange={() => setIsFree(false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Paid Event</span>
                </label>
              </div>
              {!isFree && (
                <div className="mt-3">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter ticket price"
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
              )}
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
                      onClick={() => {
                        setCoverImage(null);
                        setCoverImageFile(null);
                      }}
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
              <button 
                onClick={handleSaveDraft}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>
              <button 
                onClick={handlePublishEvent}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Publishing...' : 'Publish Event'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
     
