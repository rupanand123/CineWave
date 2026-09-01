export interface CityData {
  id: string;
  name: string;
  state: string;
  country: string;
  region: 'India' | 'North America' | 'Europe & UK' | 'Asia-Pacific' | 'Middle East' | 'Latin America & Africa';
  isPopular: boolean;
  currency: string;
  currencySymbol: string;
  flagEmoji?: string;
  icon?: string;
  lat?: number;
  lng?: number;
}

export interface BMSMovie {
  id: string;
  title: string;
  tagline: string;
  genres: string[];
  languages: string[];
  formats: string[];
  certificate: 'U' | 'U/A' | 'UA 16+' | 'A' | 'R' | 'PG-13';
  durationMinutes: number;
  releaseDate: string;
  ratingPercent: number; // e.g. 96%
  ratingScore: number; // e.g. 9.4
  voteCount: string; // e.g. "248.5K"
  posterUrl: string;
  backdropUrl: string;
  trailerYoutubeId: string;
  synopsis: string;
  director: string;
  cast: {
    name: string;
    role: string;
    imageUrl: string;
  }[];
  crew: {
    name: string;
    role: string;
  }[];
  trendingRank: number;
  isPremiere?: boolean;
}

export interface BMSEvent {
  id: string;
  title: string;
  category: 'Concerts' | 'Comedy' | 'Plays' | 'Sports' | 'Workshops';
  venue: string;
  city: string;
  dateTime: string;
  startingPrice: number;
  bannerUrl: string;
  artist: string;
  description: string;
  tags: string[];
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Combos' | 'Popcorn' | 'Snacks' | 'Beverages';
  price: number;
  description: string;
  isVeg: boolean;
  calories: number;
  imageUrl: string;
}

export interface CinemaShowtime {
  showId: string;
  time: string; // "10:15 AM", "01:30 PM", "04:45 PM", "07:30 PM", "10:45 PM"
  format: 'IMAX 3D' | '4DX 3D' | 'Dolby Atmos 2D' | '2D' | '3D' | 'Luxe VIP';
  audioLanguage: string;
  priceStart: number;
  status: 'AVAILABLE' | 'FILLING_FAST' | 'ALMOST_FULL' | 'SOLD_OUT';
  availablePercent: number;
  cancellationAvailable: boolean;
}

export interface CinemaVenue {
  id: string;
  name: string;
  chain: string;
  location: string;
  distance: string;
  amenities: string[];
  showtimes: CinemaShowtime[];
}

export interface BookingTicketRecord {
  bookingId: string;
  bookingTime: string;
  movieTitle: string;
  moviePoster: string;
  movieLanguage: string;
  movieFormat: string;
  cinemaName: string;
  cinemaLocation: string;
  audiNumber: string;
  showDate: string;
  showTime: string;
  seats: string[];
  seatTier: string;
  ticketCount: number;
  baseAmount: number;
  convenienceFee: number;
  foodAmount: number;
  discountAmount: number;
  totalPaid: number;
  foodItems: { name: string; quantity: number; price: number }[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  qrCodeUrl: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

export const CITIES_LIST: CityData[] = [
  // ===================== INDIA =====================
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', country: 'India', region: 'India', isPopular: true, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 19.0760, lng: 72.8777 },
  { id: 'delhi', name: 'Delhi-NCR', state: 'Delhi', country: 'India', region: 'India', isPopular: true, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 28.6139, lng: 77.2090 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', country: 'India', region: 'India', isPopular: true, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 12.9716, lng: 77.5946 },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', country: 'India', region: 'India', isPopular: true, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 17.3850, lng: 78.4867 },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', country: 'India', region: 'India', isPopular: true, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 23.0225, lng: 72.5714 },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Punjab', country: 'India', region: 'India', isPopular: true, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 30.7333, lng: 76.7794 },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', country: 'India', region: 'India', isPopular: true, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 13.0827, lng: 80.2707 },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', country: 'India', region: 'India', isPopular: true, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 18.5204, lng: 73.8567 },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', country: 'India', region: 'India', isPopular: true, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 22.5726, lng: 88.3639 },
  { id: 'kochi', name: 'Kochi', state: 'Kerala', country: 'India', region: 'India', isPopular: true, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 9.9312, lng: 76.2673 },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 26.9124, lng: 75.7873 },
  { id: 'goa', name: 'Goa', state: 'Goa', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 15.2993, lng: 74.1240 },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 26.8467, lng: 80.9462 },
  { id: 'indore', name: 'Indore', state: 'Madhya Pradesh', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 22.7196, lng: 75.8577 },
  { id: 'surat', name: 'Surat', state: 'Gujarat', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 21.1702, lng: 72.8311 },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 21.1458, lng: 79.0882 },
  { id: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 17.6868, lng: 83.2185 },
  { id: 'patna', name: 'Patna', state: 'Bihar', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 25.5941, lng: 85.1376 },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 20.2961, lng: 85.8245 },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 11.0168, lng: 76.9558 },
  { id: 'vadodara', name: 'Vadodara', state: 'Gujarat', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 22.3072, lng: 73.1812 },
  { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 23.2599, lng: 77.4126 },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 25.3176, lng: 82.9739 },
  { id: 'amritsar', name: 'Amritsar', state: 'Punjab', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 31.6340, lng: 74.8723 },
  { id: 'srinagar', name: 'Srinagar', state: 'Jammu & Kashmir', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 34.0837, lng: 74.7973 },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 26.1445, lng: 91.7362 },
  { id: 'mysore', name: 'Mysore', state: 'Karnataka', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 12.2958, lng: 76.6394 },
  { id: 'trivandrum', name: 'Thiruvananthapuram', state: 'Kerala', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 8.5241, lng: 76.9366 },
  { id: 'mangalore', name: 'Mangalore', state: 'Karnataka', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 12.9141, lng: 74.8560 },
  { id: 'raipur', name: 'Raipur', state: 'Chhattisgarh', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 21.2514, lng: 81.6296 },
  { id: 'agra', name: 'Agra', state: 'Uttar Pradesh', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 27.1767, lng: 78.0081 },
  { id: 'dehradun', name: 'Dehradun', state: 'Uttarakhand', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 30.3165, lng: 78.0322 },
  { id: 'ranchi', name: 'Ranchi', state: 'Jharkhand', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 23.3441, lng: 85.3096 },
  { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 24.5854, lng: 73.7125 },
  { id: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 26.2389, lng: 73.0243 },
  { id: 'madurai', name: 'Madurai', state: 'Tamil Nadu', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 9.9252, lng: 78.1198 },
  { id: 'vijayawada', name: 'Vijayawada', state: 'Andhra Pradesh', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 16.5062, lng: 80.6480 },
  { id: 'nashik', name: 'Nashik', state: 'Maharashtra', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 19.9975, lng: 73.7898 },
  { id: 'rajkot', name: 'Rajkot', state: 'Gujarat', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 22.3039, lng: 70.8022 },
  { id: 'aurangabad', name: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 19.8762, lng: 75.3433 },
  { id: 'pondicherry', name: 'Puducherry', state: 'Puducherry', country: 'India', region: 'India', isPopular: false, currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', lat: 11.9416, lng: 79.8083 },

  // ===================== NORTH AMERICA =====================
  { id: 'nyc', name: 'New York', state: 'New York', country: 'United States', region: 'North America', isPopular: true, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 40.7128, lng: -74.0060 },
  { id: 'la', name: 'Los Angeles', state: 'California', country: 'United States', region: 'North America', isPopular: true, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 34.0522, lng: -118.2437 },
  { id: 'chicago', name: 'Chicago', state: 'Illinois', country: 'United States', region: 'North America', isPopular: true, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 41.8781, lng: -87.6298 },
  { id: 'sf', name: 'San Francisco', state: 'California', country: 'United States', region: 'North America', isPopular: true, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 37.7749, lng: -122.4194 },
  { id: 'toronto', name: 'Toronto', state: 'Ontario', country: 'Canada', region: 'North America', isPopular: true, currency: 'CAD', currencySymbol: 'C$', flagEmoji: '🇨🇦', lat: 43.6532, lng: -79.3832 },
  { id: 'vancouver', name: 'Vancouver', state: 'British Columbia', country: 'Canada', region: 'North America', isPopular: false, currency: 'CAD', currencySymbol: 'C$', flagEmoji: '🇨🇦', lat: 49.2827, lng: -123.1207 },
  { id: 'montreal', name: 'Montreal', state: 'Quebec', country: 'Canada', region: 'North America', isPopular: false, currency: 'CAD', currencySymbol: 'C$', flagEmoji: '🇨🇦', lat: 45.5017, lng: -73.5673 },
  { id: 'seattle', name: 'Seattle', state: 'Washington', country: 'United States', region: 'North America', isPopular: false, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 47.6062, lng: -122.3321 },
  { id: 'austin', name: 'Austin', state: 'Texas', country: 'United States', region: 'North America', isPopular: false, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 30.2672, lng: -97.7431 },
  { id: 'miami', name: 'Miami', state: 'Florida', country: 'United States', region: 'North America', isPopular: false, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 25.7617, lng: -80.1918 },
  { id: 'boston', name: 'Boston', state: 'Massachusetts', country: 'United States', region: 'North America', isPopular: false, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 42.3601, lng: -71.0589 },
  { id: 'dallas', name: 'Dallas', state: 'Texas', country: 'United States', region: 'North America', isPopular: false, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 32.7767, lng: -96.7970 },
  { id: 'atlanta', name: 'Atlanta', state: 'Georgia', country: 'United States', region: 'North America', isPopular: false, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 33.7490, lng: -84.3880 },
  { id: 'vegas', name: 'Las Vegas', state: 'Nevada', country: 'United States', region: 'North America', isPopular: false, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 36.1699, lng: -115.1398 },
  { id: 'houston', name: 'Houston', state: 'Texas', country: 'United States', region: 'North America', isPopular: false, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 29.7604, lng: -95.3698 },
  { id: 'dc', name: 'Washington D.C.', state: 'District of Columbia', country: 'United States', region: 'North America', isPopular: false, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 38.9072, lng: -77.0369 },
  { id: 'denver', name: 'Denver', state: 'Colorado', country: 'United States', region: 'North America', isPopular: false, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 39.7392, lng: -104.9903 },
  { id: 'philadelphia', name: 'Philadelphia', state: 'Pennsylvania', country: 'United States', region: 'North America', isPopular: false, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 39.9526, lng: -75.1652 },
  { id: 'sandiego', name: 'San Diego', state: 'California', country: 'United States', region: 'North America', isPopular: false, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 32.7157, lng: -117.1611 },
  { id: 'calgary', name: 'Calgary', state: 'Alberta', country: 'Canada', region: 'North America', isPopular: false, currency: 'CAD', currencySymbol: 'C$', flagEmoji: '🇨🇦', lat: 51.0447, lng: -114.0719 },
  { id: 'honolulu', name: 'Honolulu', state: 'Hawaii', country: 'United States', region: 'North America', isPopular: false, currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', lat: 21.3069, lng: -157.8583 },

  // ===================== EUROPE & UK =====================
  { id: 'london', name: 'London', state: 'Greater London', country: 'United Kingdom', region: 'Europe & UK', isPopular: true, currency: 'GBP', currencySymbol: '£', flagEmoji: '🇬🇧', lat: 51.5074, lng: -0.1278 },
  { id: 'paris', name: 'Paris', state: 'Île-de-France', country: 'France', region: 'Europe & UK', isPopular: true, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇫🇷', lat: 48.8566, lng: 2.3522 },
  { id: 'berlin', name: 'Berlin', state: 'Berlin', country: 'Germany', region: 'Europe & UK', isPopular: true, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇩🇪', lat: 52.5200, lng: 13.4050 },
  { id: 'madrid', name: 'Madrid', state: 'Community of Madrid', country: 'Spain', region: 'Europe & UK', isPopular: true, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇪🇸', lat: 40.4168, lng: -3.7038 },
  { id: 'rome', name: 'Rome', state: 'Lazio', country: 'Italy', region: 'Europe & UK', isPopular: true, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇮🇹', lat: 41.9028, lng: 12.4964 },
  { id: 'amsterdam', name: 'Amsterdam', state: 'North Holland', country: 'Netherlands', region: 'Europe & UK', isPopular: true, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇳🇱', lat: 52.3676, lng: 4.9041 },
  { id: 'dublin', name: 'Dublin', state: 'Leinster', country: 'Ireland', region: 'Europe & UK', isPopular: false, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇮🇪', lat: 53.3498, lng: -6.2603 },
  { id: 'vienna', name: 'Vienna', state: 'Vienna', country: 'Austria', region: 'Europe & UK', isPopular: false, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇦🇹', lat: 48.2082, lng: 16.3738 },
  { id: 'zurich', name: 'Zurich', state: 'Zurich', country: 'Switzerland', region: 'Europe & UK', isPopular: false, currency: 'CHF', currencySymbol: 'CHF', flagEmoji: '🇨🇭', lat: 47.3769, lng: 8.5417 },
  { id: 'stockholm', name: 'Stockholm', state: 'Stockholm County', country: 'Sweden', region: 'Europe & UK', isPopular: false, currency: 'SEK', currencySymbol: 'kr', flagEmoji: '🇸🇪', lat: 59.3293, lng: 18.0686 },
  { id: 'barcelona', name: 'Barcelona', state: 'Catalonia', country: 'Spain', region: 'Europe & UK', isPopular: false, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇪🇸', lat: 41.3851, lng: 2.1734 },
  { id: 'munich', name: 'Munich', state: 'Bavaria', country: 'Germany', region: 'Europe & UK', isPopular: false, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇩🇪', lat: 48.1351, lng: 11.5820 },
  { id: 'milan', name: 'Milan', state: 'Lombardy', country: 'Italy', region: 'Europe & UK', isPopular: false, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇮🇹', lat: 45.4642, lng: 9.1900 },
  { id: 'edinburgh', name: 'Edinburgh', state: 'Scotland', country: 'United Kingdom', region: 'Europe & UK', isPopular: false, currency: 'GBP', currencySymbol: '£', flagEmoji: '🇬🇧', lat: 55.9533, lng: -3.1883 },
  { id: 'manchester', name: 'Manchester', state: 'Greater Manchester', country: 'United Kingdom', region: 'Europe & UK', isPopular: false, currency: 'GBP', currencySymbol: '£', flagEmoji: '🇬🇧' },
  { id: 'brussels', name: 'Brussels', state: 'Brussels-Capital', country: 'Belgium', region: 'Europe & UK', isPopular: false, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇧🇪' },
  { id: 'copenhagen', name: 'Copenhagen', state: 'Capital Region', country: 'Denmark', region: 'Europe & UK', isPopular: false, currency: 'DKK', currencySymbol: 'kr', flagEmoji: '🇩🇰' },
  { id: 'oslo', name: 'Oslo', state: 'Oslo', country: 'Norway', region: 'Europe & UK', isPopular: false, currency: 'NOK', currencySymbol: 'kr', flagEmoji: '🇳🇴' },
  { id: 'prague', name: 'Prague', state: 'Prague', country: 'Czech Republic', region: 'Europe & UK', isPopular: false, currency: 'CZK', currencySymbol: 'Kč', flagEmoji: '🇨🇿' },
  { id: 'warsaw', name: 'Warsaw', state: 'Masovian', country: 'Poland', region: 'Europe & UK', isPopular: false, currency: 'PLN', currencySymbol: 'zł', flagEmoji: '🇵🇱' },
  { id: 'lisbon', name: 'Lisbon', state: 'Lisbon District', country: 'Portugal', region: 'Europe & UK', isPopular: false, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇵🇹' },
  { id: 'athens', name: 'Athens', state: 'Attica', country: 'Greece', region: 'Europe & UK', isPopular: false, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇬🇷' },
  { id: 'helsinki', name: 'Helsinki', state: 'Uusimaa', country: 'Finland', region: 'Europe & UK', isPopular: false, currency: 'EUR', currencySymbol: '€', flagEmoji: '🇫🇮' },
  { id: 'budapest', name: 'Budapest', state: 'Central Hungary', country: 'Hungary', region: 'Europe & UK', isPopular: false, currency: 'HUF', currencySymbol: 'Ft', flagEmoji: '🇭🇺' },

  // ===================== ASIA-PACIFIC =====================
  { id: 'tokyo', name: 'Tokyo', state: 'Kanto', country: 'Japan', region: 'Asia-Pacific', isPopular: true, currency: 'JPY', currencySymbol: '¥', flagEmoji: '🇯🇵' },
  { id: 'singapore', name: 'Singapore', state: 'Singapore', country: 'Singapore', region: 'Asia-Pacific', isPopular: true, currency: 'SGD', currencySymbol: 'S$', flagEmoji: '🇸🇬' },
  { id: 'sydney', name: 'Sydney', state: 'New South Wales', country: 'Australia', region: 'Asia-Pacific', isPopular: true, currency: 'AUD', currencySymbol: 'A$', flagEmoji: '🇦🇺' },
  { id: 'melbourne', name: 'Melbourne', state: 'Victoria', country: 'Australia', region: 'Asia-Pacific', isPopular: true, currency: 'AUD', currencySymbol: 'A$', flagEmoji: '🇦🇺' },
  { id: 'seoul', name: 'Seoul', state: 'Seoul Capital Area', country: 'South Korea', region: 'Asia-Pacific', isPopular: true, currency: 'KRW', currencySymbol: '₩', flagEmoji: '🇰🇷' },
  { id: 'hongkong', name: 'Hong Kong', state: 'Hong Kong SAR', country: 'Hong Kong', region: 'Asia-Pacific', isPopular: true, currency: 'HKD', currencySymbol: 'HK$', flagEmoji: '🇭🇰' },
  { id: 'bangkok', name: 'Bangkok', state: 'Central Thailand', country: 'Thailand', region: 'Asia-Pacific', isPopular: false, currency: 'THB', currencySymbol: '฿', flagEmoji: '🇹🇭' },
  { id: 'kualalumpur', name: 'Kuala Lumpur', state: 'Federal Territory', country: 'Malaysia', region: 'Asia-Pacific', isPopular: false, currency: 'MYR', currencySymbol: 'RM', flagEmoji: '🇲🇾' },
  { id: 'auckland', name: 'Auckland', state: 'North Island', country: 'New Zealand', region: 'Asia-Pacific', isPopular: false, currency: 'NZD', currencySymbol: 'NZ$', flagEmoji: '🇳🇿' },
  { id: 'taipei', name: 'Taipei', state: 'Northern Taiwan', country: 'Taiwan', region: 'Asia-Pacific', isPopular: false, currency: 'TWD', currencySymbol: 'NT$', flagEmoji: '🇹🇼' },
  { id: 'osaka', name: 'Osaka', state: 'Kansai', country: 'Japan', region: 'Asia-Pacific', isPopular: false, currency: 'JPY', currencySymbol: '¥', flagEmoji: '🇯🇵' },
  { id: 'brisbane', name: 'Brisbane', state: 'Queensland', country: 'Australia', region: 'Asia-Pacific', isPopular: false, currency: 'AUD', currencySymbol: 'A$', flagEmoji: '🇦🇺' },
  { id: 'perth', name: 'Perth', state: 'Western Australia', country: 'Australia', region: 'Asia-Pacific', isPopular: false, currency: 'AUD', currencySymbol: 'A$', flagEmoji: '🇦🇺' },
  { id: 'jakarta', name: 'Jakarta', state: 'Java', country: 'Indonesia', region: 'Asia-Pacific', isPopular: false, currency: 'IDR', currencySymbol: 'Rp', flagEmoji: '🇮🇩' },
  { id: 'manila', name: 'Manila', state: 'Metro Manila', country: 'Philippines', region: 'Asia-Pacific', isPopular: false, currency: 'PHP', currencySymbol: '₱', flagEmoji: '🇵🇭' },
  { id: 'hochiminh', name: 'Ho Chi Minh City', state: 'Southeast Region', country: 'Vietnam', region: 'Asia-Pacific', isPopular: false, currency: 'VND', currencySymbol: '₫', flagEmoji: '🇻🇳' },
  { id: 'bali', name: 'Bali', state: 'Lesser Sunda', country: 'Indonesia', region: 'Asia-Pacific', isPopular: false, currency: 'IDR', currencySymbol: 'Rp', flagEmoji: '🇮🇩' },

  // ===================== MIDDLE EAST =====================
  { id: 'dubai', name: 'Dubai', state: 'Emirate of Dubai', country: 'United Arab Emirates', region: 'Middle East', isPopular: true, currency: 'AED', currencySymbol: 'AED', flagEmoji: '🇦🇪' },
  { id: 'abudhabi', name: 'Abu Dhabi', state: 'Emirate of Abu Dhabi', country: 'United Arab Emirates', region: 'Middle East', isPopular: true, currency: 'AED', currencySymbol: 'AED', flagEmoji: '🇦🇪' },
  { id: 'doha', name: 'Doha', state: 'Ad-Dawhah', country: 'Qatar', region: 'Middle East', isPopular: true, currency: 'QAR', currencySymbol: 'QR', flagEmoji: '🇶🇦' },
  { id: 'riyadh', name: 'Riyadh', state: 'Riyadh Province', country: 'Saudi Arabia', region: 'Middle East', isPopular: true, currency: 'SAR', currencySymbol: 'SR', flagEmoji: '🇸🇦' },
  { id: 'jeddah', name: 'Jeddah', state: 'Makkah Province', country: 'Saudi Arabia', region: 'Middle East', isPopular: false, currency: 'SAR', currencySymbol: 'SR', flagEmoji: '🇸🇦' },
  { id: 'kuwait', name: 'Kuwait City', state: 'Al Asimah', country: 'Kuwait', region: 'Middle East', isPopular: false, currency: 'KWD', currencySymbol: 'KD', flagEmoji: '🇰🇼' },
  { id: 'muscat', name: 'Muscat', state: 'Muscat Governorate', country: 'Oman', region: 'Middle East', isPopular: false, currency: 'OMR', currencySymbol: 'OMR', flagEmoji: '🇴🇲' },
  { id: 'manama', name: 'Manama', state: 'Capital Governorate', country: 'Bahrain', region: 'Middle East', isPopular: false, currency: 'BHD', currencySymbol: 'BD', flagEmoji: '🇧🇭' },
  { id: 'cairo', name: 'Cairo', state: 'Cairo Governorate', country: 'Egypt', region: 'Middle East', isPopular: false, currency: 'EGP', currencySymbol: 'E£', flagEmoji: '🇪🇬' },
  { id: 'istanbul', name: 'Istanbul', state: 'Marmara', country: 'Turkey', region: 'Middle East', isPopular: false, currency: 'TRY', currencySymbol: '₺', flagEmoji: '🇹🇷' },

  // ===================== LATIN AMERICA & AFRICA =====================
  { id: 'mexicocity', name: 'Mexico City', state: 'CDMX', country: 'Mexico', region: 'Latin America & Africa', isPopular: true, currency: 'MXN', currencySymbol: 'Mex$', flagEmoji: '🇲🇽' },
  { id: 'saopaulo', name: 'São Paulo', state: 'São Paulo State', country: 'Brazil', region: 'Latin America & Africa', isPopular: true, currency: 'BRL', currencySymbol: 'R$', flagEmoji: '🇧🇷' },
  { id: 'buenosaires', name: 'Buenos Aires', state: 'Autonomous City', country: 'Argentina', region: 'Latin America & Africa', isPopular: true, currency: 'ARS', currencySymbol: '$', flagEmoji: '🇦🇷' },
  { id: 'riodejaneiro', name: 'Rio de Janeiro', state: 'Rio de Janeiro State', country: 'Brazil', region: 'Latin America & Africa', isPopular: false, currency: 'BRL', currencySymbol: 'R$', flagEmoji: '🇧🇷' },
  { id: 'bogota', name: 'Bogotá', state: 'Capital District', country: 'Colombia', region: 'Latin America & Africa', isPopular: false, currency: 'COP', currencySymbol: 'Col$', flagEmoji: '🇨🇴' },
  { id: 'santiago', name: 'Santiago', state: 'Santiago Metropolitan', country: 'Chile', region: 'Latin America & Africa', isPopular: false, currency: 'CLP', currencySymbol: 'CLP$', flagEmoji: '🇨🇱' },
  { id: 'lima', name: 'Lima', state: 'Lima Province', country: 'Peru', region: 'Latin America & Africa', isPopular: false, currency: 'PEN', currencySymbol: 'S/', flagEmoji: '🇵🇪' },
  { id: 'johannesburg', name: 'Johannesburg', state: 'Gauteng', country: 'South Africa', region: 'Latin America & Africa', isPopular: false, currency: 'ZAR', currencySymbol: 'R', flagEmoji: '🇿🇦' },
  { id: 'capetown', name: 'Cape Town', state: 'Western Cape', country: 'South Africa', region: 'Latin America & Africa', isPopular: false, currency: 'ZAR', currencySymbol: 'R', flagEmoji: '🇿🇦' },
  { id: 'nairobi', name: 'Nairobi', state: 'Nairobi County', country: 'Kenya', region: 'Latin America & Africa', isPopular: false, currency: 'KES', currencySymbol: 'KSh', flagEmoji: '🇰🇪' },
  { id: 'lagos', name: 'Lagos', state: 'Lagos State', country: 'Nigeria', region: 'Latin America & Africa', isPopular: false, currency: 'NGN', currencySymbol: '₦', flagEmoji: '🇳🇬' }
];

export const BMS_FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1280&q=80';
export const BMS_FALLBACK_POSTER = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=780&q=80';

export const BMS_MOVIES: BMSMovie[] = [
  {
    id: 'mov-dune2',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    genres: ['Sci-Fi', 'Action', 'Adventure', 'Drama'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    formats: ['IMAX 3D', '3D', '4DX 3D', 'Dolby Atmos 2D', '2D'],
    certificate: 'UA 16+',
    durationMinutes: 166,
    releaseDate: 'In Cinemas Now',
    ratingPercent: 96,
    ratingScore: 9.4,
    voteCount: '312.4K',
    posterUrl: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520bIm.jpg',
    trailerYoutubeId: 'Way9Dexny3w',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Timoth%C3%A9e_Chalamet_2019_%28cropped%29.jpg' },
      { name: 'Zendaya', role: 'Chani', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Zendaya_-_2019_by_Glenn_Francis.jpg' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Rebecca_Ferguson_in_2018.jpg' },
      { name: 'Austin Butler', role: 'Feyd-Rautha', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Austin_Butler_2019_by_Glenn_Francis.jpg' }
    ],
    crew: [
      { name: 'Denis Villeneuve', role: 'Director & Screenplay' },
      { name: 'Hans Zimmer', role: 'Original Music Score' },
      { name: 'Greig Fraser', role: 'Director of Photography' }
    ],
    trendingRank: 1
  },
  {
    id: 'mov-deadpool',
    title: 'Deadpool & Wolverine',
    tagline: 'Come together.',
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Telugu', 'Tamil'],
    formats: ['IMAX 3D', '3D', '4DX 3D', '2D'],
    certificate: 'A',
    durationMinutes: 128,
    releaseDate: 'Blockbuster In Theatres',
    ratingPercent: 93,
    ratingScore: 9.1,
    voteCount: '425.8K',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    trailerYoutubeId: '73_1biulkYk',
    synopsis: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary Deadpool behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit up with an even more reluctant Wolverine.',
    director: 'Shawn Levy',
    cast: [
      { name: 'Ryan Reynolds', role: 'Wade Wilson / Deadpool', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Deadpool_2_Japan_Premiere_Red_Carpet_Ryan_Reynolds_%28cropped%29.jpg' },
      { name: 'Hugh Jackman', role: 'Logan / Wolverine', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Logan_Japan_Premiere_Red_Carpet_Hugh_Jackman_%2838445328406%29_%28cropped%29.jpg' },
      { name: 'Emma Corrin', role: 'Cassandra Nova', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Emma_Corrin_at_2021_Critics_Choice_Awards_%28cropped%29.jpg' },
      { name: 'Morena Baccarin', role: 'Vanessa', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Morena_Baccarin_by_Gage_Skidmore_2.jpg' }
    ],
    crew: [
      { name: 'Shawn Levy', role: 'Director' },
      { name: 'Rob Simonsen', role: 'Original Score' }
    ],
    trendingRank: 2
  },
  {
    id: 'mov-kalki',
    title: 'Kalki 2898 AD',
    tagline: 'The future of Indian mythology and sci-fi.',
    genres: ['Sci-Fi', 'Action', 'Mythology'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada', 'English'],
    formats: ['IMAX 3D', '3D', '4DX 3D', '2D'],
    certificate: 'U/A',
    durationMinutes: 181,
    releaseDate: 'Global Sci-Fi Sensation',
    ratingPercent: 95,
    ratingScore: 9.3,
    voteCount: '512.6K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    trailerYoutubeId: 'kQDd1AhGIHk',
    synopsis: 'A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to the earth to protect the world from evil forces in a futuristic dystopian world of Kasi.',
    director: 'Nag Ashwin',
    cast: [
      { name: 'Prabhas', role: 'Bhairava', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Prabhas_at_Saaho_Trailer_Launch.jpg' },
      { name: 'Amitabh Bachchan', role: 'Ashwatthama', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Amitabh_Bachchan_photo.jpg' },
      { name: 'Kamal Haasan', role: 'Supreme Yaskin', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Kamal_Haasan_at_Vikram_Success_Meet.jpg' },
      { name: 'Deepika Padukone', role: 'SUM-80', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Deepika_Padukone_Cannes_2018_%28cropped%29.jpg' }
    ],
    crew: [
      { name: 'Nag Ashwin', role: 'Director & Writer' },
      { name: 'Santhosh Narayanan', role: 'Music Composer' }
    ],
    trendingRank: 3
  },
  {
    id: 'mov-oppenheimer',
    title: 'Oppenheimer',
    tagline: 'The world forever changes.',
    genres: ['Biography', 'Drama', 'History'],
    languages: ['English', 'Hindi'],
    formats: ['IMAX 3D', 'Dolby Atmos 2D', '2D'],
    certificate: 'A',
    durationMinutes: 180,
    releaseDate: 'Academy Award Winner',
    ratingPercent: 95,
    ratingScore: 9.3,
    voteCount: '580.1K',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    trailerYoutubeId: 'uYPbbksJxIg',
    synopsis: 'The story of American scientist J. Robert Oppenheimer and his historical role in the development of the atomic bomb during World War II at Los Alamos Laboratory.',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Cillian_Murphy_at_Berlinale_2024_Ausschnitt.jpg' },
      { name: 'Emily Blunt', role: 'Katherine Oppenheimer', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Emily_Blunt_2018.jpg' },
      { name: 'Matt Damon', role: 'Leslie Groves', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Matt_Damon_TIFF_2015.jpg' },
      { name: 'Robert Downey Jr.', role: 'Lewis Strauss', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg' }
    ],
    crew: [
      { name: 'Christopher Nolan', role: 'Director & Screenplay' },
      { name: 'Ludwig Göransson', role: 'Original Score' },
      { name: 'Hoyte van Hoytema', role: 'Director of Photography' }
    ],
    trendingRank: 4
  },
  {
    id: 'mov-interstellar',
    title: 'Interstellar (10th Anniversary IMAX)',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    languages: ['English', 'Hindi'],
    formats: ['IMAX 3D', 'Dolby Cinema', '2D'],
    certificate: 'U/A',
    durationMinutes: 169,
    releaseDate: 'Special Limited Run',
    ratingPercent: 98,
    ratingScore: 9.7,
    voteCount: '690.8K',
    posterUrl: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    trailerYoutubeId: 'zSWdZVtXT7E',
    synopsis: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans across a mysterious wormhole near Saturn.',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Matthew McConaughey', role: 'Cooper', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Matthew_McConaughey_2019_%2848648345872%29_%28cropped%29.jpg' },
      { name: 'Anne Hathaway', role: 'Brand', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Anne_Hathaway_at_the_2024_Golden_Globes_2_%28cropped%29.jpg' },
      { name: 'Jessica Chastain', role: 'Murph', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Jessica_Chastain_Cannes_2017.jpg' },
      { name: 'Michael Caine', role: 'Professor Brand', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Michael_Caine_at_the_2015_European_Film_Awards_%28cropped%29.jpg' }
    ],
    crew: [
      { name: 'Christopher Nolan', role: 'Director' },
      { name: 'Hans Zimmer', role: 'Music Composer' }
    ],
    trendingRank: 5
  },
  {
    id: 'mov-spiderverse',
    title: 'Spider-Man: Across the Spider-Verse',
    tagline: 'It\'s how you wear the mask that matters.',
    genres: ['Animation', 'Action', 'Sci-Fi', 'Adventure'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    formats: ['IMAX 3D', '3D', '4DX', '2D'],
    certificate: 'U',
    durationMinutes: 140,
    releaseDate: 'Critically Acclaimed',
    ratingPercent: 97,
    ratingScore: 9.5,
    voteCount: '488.2K',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    trailerYoutubeId: 'cqGjhVJWtEg',
    synopsis: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: [
      { name: 'Shameik Moore', role: 'Miles Morales', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Shameik_Moore_by_Gage_Skidmore.jpg' },
      { name: 'Hailee Steinfeld', role: 'Gwen Stacy', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Hailee_Steinfeld_by_Gage_Skidmore_2.jpg' },
      { name: 'Oscar Isaac', role: 'Miguel O\'Hara', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Oscar_Isaac_by_Gage_Skidmore.jpg' },
      { name: 'Daniel Kaluuya', role: 'Hobie Brown', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Daniel_Kaluuya_2018.jpg' }
    ],
    crew: [
      { name: 'Phil Lord & Christopher Miller', role: 'Producers & Writers' },
      { name: 'Daniel Pemberton', role: 'Music Composer' }
    ],
    trendingRank: 6
  },
  {
    id: 'mov-avatar2',
    title: 'Avatar: The Way of Water',
    tagline: 'Return to Pandora.',
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    languages: ['English', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'],
    formats: ['IMAX 3D', '4DX 3D', 'Dolby Cinema 3D', '3D', '2D'],
    certificate: 'U/A',
    durationMinutes: 192,
    releaseDate: 'Global Phenomenon',
    ratingPercent: 94,
    ratingScore: 9.2,
    voteCount: '620.0K',
    posterUrl: 'https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
    trailerYoutubeId: 'd9MyW72ELq0',
    synopsis: 'Set more than a decade after the events of the first film, Jake Sully and Neytiri have formed a family and are doing everything to stay together. However, they must leave their home and explore the oceanic regions of Pandora when an ancient threat resurfaces.',
    director: 'James Cameron',
    cast: [
      { name: 'Sam Worthington', role: 'Jake Sully', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Sam_Worthington_2013.jpg' },
      { name: 'Zoe Saldaña', role: 'Neytiri', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Zoe_Saldana_by_Gage_Skidmore_2.jpg' },
      { name: 'Sigourney Weaver', role: 'Kiri', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Sigourney_Weaver_2016.jpg' },
      { name: 'Stephen Lang', role: 'Miles Quaritch', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Stephen_Lang_by_Gage_Skidmore.jpg' }
    ],
    crew: [
      { name: 'James Cameron', role: 'Director & Writer' },
      { name: 'Simon Franglen', role: 'Music Composer' }
    ],
    trendingRank: 7
  },
  {
    id: 'mov-gladiator2',
    title: 'Gladiator II',
    tagline: 'What we do in life echoes in eternity.',
    genres: ['Action', 'Drama', 'History', 'Adventure'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    formats: ['IMAX 3D', '4DX', 'Dolby Atmos 2D', '2D'],
    certificate: 'A',
    durationMinutes: 148,
    releaseDate: 'Epic Spectacle',
    ratingPercent: 94,
    ratingScore: 9.2,
    voteCount: '340.5K',
    posterUrl: 'https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/euYIwmwkmz95mnExloguf0MweqP.jpg',
    trailerYoutubeId: '4rgYUipGJNo',
    synopsis: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
    director: 'Ridley Scott',
    cast: [
      { name: 'Paul Mescal', role: 'Lucius Verus', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Paul_Mescal_BAFTA_2023.jpg' },
      { name: 'Pedro Pascal', role: 'Marcus Acacius', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Pedro_Pascal_by_Gage_Skidmore.jpg' },
      { name: 'Denzel Washington', role: 'Macrinus', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Denzel_Washington_2018.jpg' },
      { name: 'Connie Nielsen', role: 'Lucilla', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Connie_Nielsen_by_Gage_Skidmore.jpg' }
    ],
    crew: [
      { name: 'Ridley Scott', role: 'Director & Producer' },
      { name: 'Harry Gregson-Williams', role: 'Original Score' }
    ],
    trendingRank: 8
  },
  {
    id: 'mov-inception',
    title: 'Inception',
    tagline: 'Your mind is the scene of the crime.',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    languages: ['English', 'Hindi'],
    formats: ['IMAX 3D', 'Dolby Atmos 2D', '2D'],
    certificate: 'UA 16+',
    durationMinutes: 148,
    releaseDate: 'Classic Spotlight',
    ratingPercent: 97,
    ratingScore: 9.6,
    voteCount: '780.4K',
    posterUrl: 'https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    trailerYoutubeId: 'YoHD9XEInc0',
    synopsis: 'Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state. Given a chance at redemption, he must accomplish the impossible: inception.',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Leonardo DiCaprio', role: 'Dom Cobb', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Leonardo_Dicaprio_Cannes_2019.jpg' },
      { name: 'Joseph Gordon-Levitt', role: 'Arthur', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Joseph_Gordon-Levitt_2013.jpg' },
      { name: 'Elliot Page', role: 'Ariadne', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Elliot_Page_in_2019.jpg' },
      { name: 'Tom Hardy', role: 'Eames', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Tom_Hardy_by_Gage_Skidmore.jpg' }
    ],
    crew: [
      { name: 'Christopher Nolan', role: 'Director & Screenplay' },
      { name: 'Hans Zimmer', role: 'Original Score' }
    ],
    trendingRank: 9
  },
  {
    id: 'mov-darkknight',
    title: 'The Dark Knight',
    tagline: 'Why so serious?',
    genres: ['Action', 'Crime', 'Drama'],
    languages: ['English', 'Hindi'],
    formats: ['IMAX 3D', '4DX', '2D'],
    certificate: 'UA 16+',
    durationMinutes: 152,
    releaseDate: 'Legendary Masterpiece',
    ratingPercent: 99,
    ratingScore: 9.8,
    voteCount: '950.2K',
    posterUrl: 'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
    trailerYoutubeId: 'EXeTwQWrcwY',
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne / Batman', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Christian_Bale-7837.jpg' },
      { name: 'Heath Ledger', role: 'The Joker', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Heath_Ledger_%28Claudio_Carpi_photo%29.jpg' },
      { name: 'Aaron Eckhart', role: 'Harvey Dent', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Aaron_Eckhart_2011.jpg' },
      { name: 'Michael Caine', role: 'Alfred Pennyworth', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Michael_Caine_at_the_2015_European_Film_Awards_%28cropped%29.jpg' }
    ],
    crew: [
      { name: 'Christopher Nolan', role: 'Director' },
      { name: 'Hans Zimmer', role: 'Original Score' }
    ],
    trendingRank: 10
  },
  {
    id: 'mov-pushpa2',
    title: 'Pushpa 2: The Rule',
    tagline: 'His rule begins across the world.',
    genres: ['Action', 'Crime', 'Drama', 'Thriller'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam'],
    formats: ['IMAX 2D', '4DX', 'Dolby Atmos 2D', '2D'],
    certificate: 'U/A',
    durationMinutes: 195,
    releaseDate: 'Global Mega Release',
    ratingPercent: 96,
    ratingScore: 9.6,
    voteCount: '780.5K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/11/Pushpa_2-_The_Rule.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520bIm.jpg',
    trailerYoutubeId: '1kVK0MZlbI4',
    synopsis: 'Pushpa Raj continues to rule the red sandalwood smuggling syndicate with unmatched swagger and iron will, leading to an explosive confrontation with SP Bhanwar Singh Shekhawat.',
    director: 'Sukumar',
    cast: [
      { name: 'Allu Arjun', role: 'Pushpa Raj', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Allu_Arjun_at_69th_National_Film_Awards_%28cropped%29.jpg' },
      { name: 'Rashmika Mandanna', role: 'Srivalli', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Rashmika_Mandanna_at_Mission_Majnu_promotion_%28cropped%29.jpg' },
      { name: 'Fahadh Faasil', role: 'Bhanwar Singh Shekhawat', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Fahadh_Faasil_at_Aavesham_Press_Meet_%28cropped%29.jpg' },
      { name: 'Jagapathi Babu', role: 'Dharma', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Jagapathi_Babu_at_Srimanthudu_audio_launch.jpg' }
    ],
    crew: [
      { name: 'Sukumar', role: 'Director & Screenplay' },
      { name: 'Devi Sri Prasad (DSP)', role: 'Music Composer' }
    ],
    trendingRank: 11
  },
  {
    id: 'mov-devara',
    title: 'Devara: Part 1',
    tagline: 'When courage turns into a tidal wave.',
    genres: ['Action', 'Drama', 'Thriller'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'],
    formats: ['IMAX 2D', '4DX', 'Dolby Atmos 2D', '2D'],
    certificate: 'U/A',
    durationMinutes: 178,
    releaseDate: 'Coastal Action Spectacle',
    ratingPercent: 93,
    ratingScore: 9.3,
    voteCount: '480.2K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f0/Devara_Part_1.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    trailerYoutubeId: 'gskf1v8Bpm4',
    synopsis: 'Set in the tempestuous coastal lands, an uncompromising hero rises against ruthless maritime syndicates to defend his people, passing down an epic legacy of valor.',
    director: 'Koratala Siva',
    cast: [
      { name: 'N.T. Rama Rao Jr.', role: 'Devara / Varadha', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/N._T._Rama_Rao_Jr._in_2024.jpg' },
      { name: 'Janhvi Kapoor', role: 'Thangam', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Janhvi_Kapoor_at_Nykaa_Femina_Beauty_Awards_2022_%28cropped%29.jpg' },
      { name: 'Saif Ali Khan', role: 'Bhaira', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Saif_Ali_Khan_at_the_launch_of_the_book_%E2%80%98The_Style_Diary_Of_A_Bollywood_Diva%E2%80%99_%28cropped%29.jpg' },
      { name: 'Prakash Raj', role: 'Singappa', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Prakash_Raj_at_Gouravam_press_meet.jpg' }
    ],
    crew: [
      { name: 'Koratala Siva', role: 'Director & Writer' },
      { name: 'Anirudh Ravichander', role: 'Music Composer' }
    ],
    trendingRank: 12
  },
  {
    id: 'mov-rrr',
    title: 'RRR (Rise Roar Revolt)',
    tagline: 'Fire and Water unite to shake the empire.',
    genres: ['Action', 'Drama', 'History'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'],
    formats: ['IMAX 3D', '3D', 'Dolby Atmos 2D', '2D'],
    certificate: 'U/A',
    durationMinutes: 187,
    releaseDate: 'Academy Award Winner',
    ratingPercent: 98,
    ratingScore: 9.8,
    voteCount: '920.4K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    trailerYoutubeId: 'NgBoMJy386M',
    synopsis: 'Two legendary revolutionaries journey far from home and fight for their country against British colonialists in the 1920s, forming a bond forged in fire and water.',
    director: 'S.S. Rajamouli',
    cast: [
      { name: 'N.T. Rama Rao Jr.', role: 'Komaram Bheem', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/N._T._Rama_Rao_Jr._in_2024.jpg' },
      { name: 'Ram Charan', role: 'Alluri Sitarama Raju', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Ram_Charan_at_RRR_Press_Meet.jpg' },
      { name: 'Alia Bhatt', role: 'Sita', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Alia_Bhatt_at_Berlinale_2022_%28cropped%29.jpg' },
      { name: 'Ajay Devgn', role: 'Venkata Rama Raju', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Ajay_Devgn_promoting_Runway_34.jpg' }
    ],
    crew: [
      { name: 'S.S. Rajamouli', role: 'Director & Screenplay' },
      { name: 'M.M. Keeravaani', role: 'Oscar Winning Music Composer' }
    ],
    trendingRank: 13
  },
  {
    id: 'mov-salaar',
    title: 'Salaar: Part 1 – Ceasefire',
    tagline: 'The most violent man for one man.',
    genres: ['Action', 'Crime', 'Thriller'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam'],
    formats: ['IMAX 2D', 'Dolby Atmos 2D', '2D'],
    certificate: 'A',
    durationMinutes: 175,
    releaseDate: 'High Voltage Action Blockbuster',
    ratingPercent: 92,
    ratingScore: 9.1,
    voteCount: '410.6K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Salaar_Part_1_%E2%80%93_Ceasefire.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520bIm.jpg',
    trailerYoutubeId: '4GPvYMKsrtI',
    synopsis: 'In the heavily fortified sovereign city-state of Khansaar, Deva returns to protect his childhood companion Varadharaja Mannar as brutal factions vie for the royal seal.',
    director: 'Prashanth Neel',
    cast: [
      { name: 'Prabhas', role: 'Deva / Salaar', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Prabhas_at_Saaho_Trailer_Launch.jpg' },
      { name: 'Prithviraj Sukumaran', role: 'Varadharaja Mannar', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Prithviraj_Sukumaran_at_Aadujeevitham_Press_Meet_%28cropped%29.jpg' },
      { name: 'Shruti Haasan', role: 'Aadya', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Shruti_Haasan_at_63rd_Filmfare_Awards_South_%28cropped%29.jpg' },
      { name: 'Jagapathi Babu', role: 'Raja Mannar', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Jagapathi_Babu_at_Srimanthudu_audio_launch.jpg' }
    ],
    crew: [
      { name: 'Prashanth Neel', role: 'Director' },
      { name: 'Ravi Basrur', role: 'Music & BGM' }
    ],
    trendingRank: 14
  },
  {
    id: 'mov-goat',
    title: 'The Greatest of All Time (G.O.A.T)',
    tagline: 'A hero is born twice.',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    languages: ['Tamil', 'Telugu', 'Hindi'],
    formats: ['IMAX 2D', 'Dolby Atmos 2D', '2D'],
    certificate: 'U/A',
    durationMinutes: 179,
    releaseDate: 'Thalapathy Vijay Spy Thriller',
    ratingPercent: 93,
    ratingScore: 9.2,
    voteCount: '510.4K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1e/The_Greatest_of_All_Time.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    trailerYoutubeId: 'jxCRlebiebw',
    synopsis: 'An elite former Special Anti-Terrorist Squad field leader is thrust back into action when an unresolved espionage mission unleashes a deadly clone adversary.',
    director: 'Venkat Prabhu',
    cast: [
      { name: 'Thalapathy Vijay', role: 'Gandhi / Jeevan', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Vijay_at_the_Nadigar_Sangam_Protest.jpg' },
      { name: 'Prashanth', role: 'Sunil Thiagarajan', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Prashanth_at_Andhagan_Audio_Launch.jpg' },
      { name: 'Prabhu Deva', role: 'Kalyan Sundaram', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Prabhu_Deva_at_the_Special_Screening_Of_%E2%80%98Tutak_Tutak_Tutiya%E2%80%99_%28cropped%29.jpg' },
      { name: 'Sneha', role: 'Anuradha Gandhi', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Sneha_at_SIIMA_2016.jpg' }
    ],
    crew: [
      { name: 'Venkat Prabhu', role: 'Director & Screenplay' },
      { name: 'Yuvan Shankar Raja', role: 'Music Composer' }
    ],
    trendingRank: 15
  },
  {
    id: 'mov-vettaiyan',
    title: 'Vettaiyan',
    tagline: 'The hunter takes aim.',
    genres: ['Action', 'Crime', 'Drama', 'Thriller'],
    languages: ['Tamil', 'Telugu', 'Hindi', 'Kannada'],
    formats: ['IMAX 2D', 'Dolby Atmos 2D', '2D'],
    certificate: 'U/A',
    durationMinutes: 163,
    releaseDate: 'Superstar Rajinikanth Mega Action',
    ratingPercent: 94,
    ratingScore: 9.4,
    voteCount: '460.9K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/6/68/Vettaiyan_poster.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    trailerYoutubeId: 'X7m-aG29g4g',
    synopsis: 'A ruthless encounter specialist IPS officer confronts ethical questions and systemic fraud when an educational empire conspiracy sparks a national outcry.',
    director: 'T.J. Gnanavel',
    cast: [
      { name: 'Rajinikanth', role: 'SP Athiyan IPS', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Rajinikanth_in_2013_%28cropped%29.jpg' },
      { name: 'Amitabh Bachchan', role: 'Justice Sathyadev', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Amitabh_Bachchan_photo.jpg' },
      { name: 'Fahadh Faasil', role: 'Patrick', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Fahadh_Faasil_at_Aavesham_Press_Meet_%28cropped%29.jpg' },
      { name: 'Rana Daggubati', role: 'Natraj', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Rana_Daggubati_at_SIIMA_2016.jpg' }
    ],
    crew: [
      { name: 'T.J. Gnanavel', role: 'Director & Writer' },
      { name: 'Anirudh Ravichander', role: 'Music Composer' }
    ],
    trendingRank: 16
  },
  {
    id: 'mov-leo',
    title: 'Leo: Bloody Sweet',
    tagline: 'Keep calm and avoid the fire.',
    genres: ['Action', 'Crime', 'Thriller'],
    languages: ['Tamil', 'Telugu', 'Hindi', 'Malayalam'],
    formats: ['IMAX 2D', '4DX', 'Dolby Atmos 2D', '2D'],
    certificate: 'UA 16+',
    durationMinutes: 164,
    releaseDate: 'Lokesh Cinematic Universe (LCU)',
    ratingPercent: 95,
    ratingScore: 9.4,
    voteCount: '670.3K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/7/75/Leo_%282023_Indian_film%29.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    trailerYoutubeId: 'Po3jStA673E',
    synopsis: 'A mild-mannered cafe owner in Theog defends his family against bandits, only to find himself hunted by a violent crime syndicate convinced he is Leo Das.',
    director: 'Lokesh Kanagaraj',
    cast: [
      { name: 'Thalapathy Vijay', role: 'Parthiban / Leo Das', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Vijay_at_the_Nadigar_Sangam_Protest.jpg' },
      { name: 'Sanjay Dutt', role: 'Antony Das', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Sanjay_Dutt_at_Bhoomi_promotions.jpg' },
      { name: 'Trisha Krishnan', role: 'Sathya Parthiban', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Trisha_Krishnan_at_PS1_Press_Meet.jpg' },
      { name: 'Arjun Sarja', role: 'Harold Das', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Arjun_Sarja_at_Irumbuthirai_Press_Meet.jpg' }
    ],
    crew: [
      { name: 'Lokesh Kanagaraj', role: 'Director' },
      { name: 'Anirudh Ravichander', role: 'Music Composer' }
    ],
    trendingRank: 17
  },
  {
    id: 'mov-stree2',
    title: 'Stree 2: Sarkate Ka Aatank',
    tagline: 'O Stree Raksha Karna!',
    genres: ['Comedy', 'Horror', 'Mystery'],
    languages: ['Hindi'],
    formats: ['2D', '4DX', 'Dolby Atmos 2D'],
    certificate: 'U/A',
    durationMinutes: 147,
    releaseDate: 'All-Time Record Blockbuster',
    ratingPercent: 96,
    ratingScore: 9.5,
    voteCount: '890.1K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a1/Stree_2.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    trailerYoutubeId: 'KVnheXwqFAw',
    synopsis: 'The town of Chanderi is terrorized by Sarkata, a headless evil entity abducting independent progressive women. Vicky and his loyal gang must enlist Stree herself to save their town.',
    director: 'Amar Kaushik',
    cast: [
      { name: 'Shraddha Kapoor', role: 'The Mystery Woman / Stree', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Shraddha_Kapoor_at_Stree_trailer_launch_%28cropped%29.jpg' },
      { name: 'Rajkummar Rao', role: 'Vicky', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Rajkummar_Rao_at_Stree_trailer_launch_%28cropped%29.jpg' },
      { name: 'Pankaj Tripathi', role: 'Rudra', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Pankaj_Tripathi_at_a_press_conference_%28cropped%29.jpg' },
      { name: 'Abhishek Banerjee', role: 'Jana', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Abhishek_Banerjee_at_Apurva_promotions.jpg' }
    ],
    crew: [
      { name: 'Amar Kaushik', role: 'Director' },
      { name: 'Sachin-Jigar', role: 'Music Composers' },
      { name: 'Niren Bhatt', role: 'Writer' }
    ],
    trendingRank: 18
  },
  {
    id: 'mov-jawan',
    title: 'Jawan',
    tagline: 'Ready to change the system.',
    genres: ['Action', 'Thriller', 'Drama'],
    languages: ['Hindi', 'Tamil', 'Telugu'],
    formats: ['IMAX 2D', '4DX', 'Dolby Atmos 2D', '2D'],
    certificate: 'U/A',
    durationMinutes: 169,
    releaseDate: 'Megastar Shah Rukh Khan Sensation',
    ratingPercent: 96,
    ratingScore: 9.6,
    voteCount: '950.4K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
    trailerYoutubeId: 'MWOlnZSnXjo',
    synopsis: 'A high-spirited prison officer orchestrates bold hijacks and socio-economic rescues with a dedicated squad of women inmates, uncovering a deep conspiracy linked to his heroic past.',
    director: 'Atlee',
    cast: [
      { name: 'Shah Rukh Khan', role: 'Vikram Rathore / Azad', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Shah_Rukh_Khan_graces_the_launch_of_the_new_Santro.jpg' },
      { name: 'Nayanthara', role: 'Narmada Rai', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Nayanthara_at_SIIMA_2016_%28cropped%29.jpg' },
      { name: 'Vijay Sethupathi', role: 'Kaalie Gaikwad', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Vijay_Sethupathi_at_Jawan_Pre-Release_Event_%28cropped%29.jpg' },
      { name: 'Deepika Padukone', role: 'Aishwarya Rathore', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Deepika_Padukone_Cannes_2018_%28cropped%29.jpg' }
    ],
    crew: [
      { name: 'Atlee', role: 'Director & Screenplay' },
      { name: 'Anirudh Ravichander', role: 'Music Composer' }
    ],
    trendingRank: 19
  },
  {
    id: 'mov-fighter',
    title: 'Fighter',
    tagline: 'Wings of glory. Hearts of steel.',
    genres: ['Action', 'Thriller', 'Adventure'],
    languages: ['Hindi', 'Telugu', 'Tamil'],
    formats: ['IMAX 3D', '3D', '4DX 3D', '2D'],
    certificate: 'U/A',
    durationMinutes: 166,
    releaseDate: 'Indian Air Force Aerial Action',
    ratingPercent: 92,
    ratingScore: 9.1,
    voteCount: '430.0K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/d/df/Fighter_film_teaser.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    trailerYoutubeId: '6amIq_mP4xM',
    synopsis: 'Top IAF squadron leaders unite under the Air Dragons unit in Srinagar to execute daring surgical strikes and aerial dogfights against hostile threats.',
    director: 'Siddharth Anand',
    cast: [
      { name: 'Hrithik Roshan', role: 'Shamsher Pathania (Patty)', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Hrithik_at_Rado_launch.jpg' },
      { name: 'Deepika Padukone', role: 'Minal Rathore (Minni)', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Deepika_Padukone_Cannes_2018_%28cropped%29.jpg' },
      { name: 'Anil Kapoor', role: 'Rakesh Jaisingh (Rocky)', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Anil_Kapoor_promoting_Jugjugg_Jeeyo.jpg' },
      { name: 'Karan Singh Grover', role: 'Sartaj Gill (Taj)', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Karan_Singh_Grover_at_Fighter_promotions.jpg' }
    ],
    crew: [
      { name: 'Siddharth Anand', role: 'Director' },
      { name: 'Vishal-Shekhar', role: 'Music Composers' }
    ],
    trendingRank: 20
  },
  {
    id: 'mov-kantara',
    title: 'Kantara: A Legend',
    tagline: 'The divine call of the forest resonates.',
    genres: ['Action', 'Drama', 'Thriller', 'Mythology'],
    languages: ['Kannada', 'Telugu', 'Hindi', 'Tamil', 'Malayalam'],
    formats: ['Dolby Atmos 2D', '2D'],
    certificate: 'U/A',
    durationMinutes: 148,
    releaseDate: 'National Award Winning Phenomenon',
    ratingPercent: 97,
    ratingScore: 9.7,
    voteCount: '780.0K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/8/84/Kantara_poster.jpeg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
    trailerYoutubeId: '8nr763m5yis',
    synopsis: 'In a coastal Karnataka hamlet, the sacred folklore of Bhoota Kola and nature spirits collides with human greed, leading to a spiritual and physical battle of epic proportions.',
    director: 'Rishab Shetty',
    cast: [
      { name: 'Rishab Shetty', role: 'Shiva / Panjurli Daiva', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Rishab_Shetty_at_69th_National_Film_Awards_%28cropped%29.jpg' },
      { name: 'Sapthami Gowda', role: 'Leela', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Sapthami_Gowda_at_Kantara_Celebration.jpg' },
      { name: 'Kishore', role: 'Murali (Forest Officer)', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Kishore_Kumar_G_at_SIIMA_2023.jpg' },
      { name: 'Achyuth Kumar', role: 'Devendra Suttooru', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Achyuth_Kumar_at_KGF_event.jpg' }
    ],
    crew: [
      { name: 'Rishab Shetty', role: 'Director & Writer' },
      { name: 'B. Ajaneesh Loknath', role: 'Music Composer' }
    ],
    trendingRank: 21
  },
  {
    id: 'mov-gamechanger',
    title: 'Game Changer',
    tagline: 'An honest officer against the corrupt system.',
    genres: ['Action', 'Drama', 'Political Thriller'],
    languages: ['Telugu', 'Tamil', 'Hindi'],
    formats: ['IMAX 2D', '4DX', 'Dolby Atmos 2D', '2D'],
    certificate: 'U/A',
    durationMinutes: 168,
    releaseDate: 'Grand Festive Release',
    ratingPercent: 92,
    ratingScore: 9.1,
    voteCount: '340.5K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/3/36/Game_Changer_Telugu_film_poster.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    trailerYoutubeId: 'X0vL2vX2gqY',
    synopsis: 'An honest Indian Administrative Service (IAS) officer takes on corrupt political figures to advocate for fair elections and clean governance.',
    director: 'S. Shankar',
    cast: [
      { name: 'Ram Charan', role: 'Ram Nandan IAS', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Ram_Charan_at_RRR_Press_Meet.jpg' },
      { name: 'Kiara Advani', role: 'Deepika', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Kiara_Advani_at_Satyaprem_Ki_Katha_screening.jpg' },
      { name: 'S.J. Suryah', role: 'Murali Krishna', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/SJ_Suryah_at_Mark_Antony_Event.jpg' },
      { name: 'Anjali', role: 'Bhavani', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Anjali_at_SIIMA_2016.jpg' }
    ],
    crew: [
      { name: 'S. Shankar', role: 'Director' },
      { name: 'Thaman S', role: 'Music Composer' }
    ],
    trendingRank: 22
  },
  {
    id: 'mov-amaran',
    title: 'Amaran',
    tagline: 'The story of Major Mukund Varadarajan AC.',
    genres: ['Action', 'Biography', 'Drama', 'War'],
    languages: ['Tamil', 'Telugu', 'Hindi', 'Malayalam', 'Kannada'],
    formats: ['IMAX 2D', 'Dolby Atmos 2D', '2D'],
    certificate: 'U/A',
    durationMinutes: 169,
    releaseDate: 'Blockbuster Biopic',
    ratingPercent: 97,
    ratingScore: 9.6,
    voteCount: '620.1K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Amaran_2024_poster.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/euYIwmwkmz95mnExloguf0MweqP.jpg',
    trailerYoutubeId: 'hylIXfZeB4c',
    synopsis: 'A heartfelt, action-packed military biopic chronicling the life, courage, and ultimate sacrifice of Major Mukund Varadarajan, an Indian Army officer awarded the Ashoka Chakra.',
    director: 'Rajkumar Periasamy',
    cast: [
      { name: 'Sivakarthikeyan', role: 'Major Mukund Varadarajan', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Sivakarthikeyan_at_the_Doctor_Audio_Launch.jpg' },
      { name: 'Sai Pallavi', role: 'Indu Rebecca Varghese', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Sai_Pallavi_at_Gargi_Press_Meet_%28cropped%29.jpg' },
      { name: 'Bhuvan Arora', role: 'Sepoy Vikram Singh', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bhuvan_Arora_Farzi_Success.jpg' }
    ],
    crew: [
      { name: 'Rajkumar Periasamy', role: 'Director' },
      { name: 'G.V. Prakash Kumar', role: 'Music Composer' }
    ],
    trendingRank: 23
  },
  {
    id: 'mov-jailer',
    title: 'Jailer',
    tagline: 'Hukum - Tiger Ka Hukum.',
    genres: ['Action', 'Comedy', 'Crime', 'Thriller'],
    languages: ['Tamil', 'Telugu', 'Hindi', 'Kannada', 'Malayalam'],
    formats: ['Dolby Atmos 2D', '2D'],
    certificate: 'U/A',
    durationMinutes: 168,
    releaseDate: 'Record Breaking All-Time Blockbuster',
    ratingPercent: 95,
    ratingScore: 9.3,
    voteCount: '690.4K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cb/Jailer_2023_film_poster.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520bIm.jpg',
    trailerYoutubeId: 'Y5BeWdODPqo',
    synopsis: 'Muthuvel Pandian, a retired prison jailer living a quiet domestic life, reawakens his ruthless undercover instincts when an antique smuggling syndicate endangers his family.',
    director: 'Nelson Dilipkumar',
    cast: [
      { name: 'Rajinikanth', role: 'Tiger Muthuvel Pandian', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Rajinikanth_in_2013_%28cropped%29.jpg' },
      { name: 'Mohanlal', role: 'Mathew (Cameo)', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Mohanlal_at_2019_Kerala_State_Film_Awards.jpg' },
      { name: 'Shiva Rajkumar', role: 'Narasimha (Cameo)', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Shiva_Rajkumar_at_Ghost_Press_Meet.jpg' },
      { name: 'Vinayakan', role: 'Varman', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Vinayakan_at_Jailer_Audio_Launch.jpg' }
    ],
    crew: [
      { name: 'Nelson', role: 'Director' },
      { name: 'Anirudh Ravichander', role: 'Music Composer' }
    ],
    trendingRank: 24
  },
  {
    id: 'mov-12thfail',
    title: '12th Fail',
    tagline: 'Restart. Zero se shuru.',
    genres: ['Biography', 'Drama'],
    languages: ['Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam'],
    formats: ['Dolby Atmos 2D', '2D'],
    certificate: 'U',
    durationMinutes: 147,
    releaseDate: 'National Sensation & Critic Favorite',
    ratingPercent: 99,
    ratingScore: 9.8,
    voteCount: '850.3K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpeg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    trailerYoutubeId: 'we3nS2j0k1k',
    synopsis: 'Based on the inspiring real-life journey of IPS officer Manoj Kumar Sharma, who rose from extreme rural poverty and academic failure in Chambal to clear the rigorous UPSC civil services examination.',
    director: 'Vidhu Vinod Chopra',
    cast: [
      { name: 'Vikrant Massey', role: 'Manoj Kumar Sharma', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Vikrant_Massey_in_2023.jpg' },
      { name: 'Medha Shankr', role: 'Shraddha Joshi', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Medha_Shankr_at_12th_Fail_Success_Party.jpg' },
      { name: 'Anant V Joshi', role: 'Pritam Pandey', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Anant_V_Joshi_at_event.jpg' }
    ],
    crew: [
      { name: 'Vidhu Vinod Chopra', role: 'Director & Screenplay' },
      { name: 'Shantanu Moitra', role: 'Music Composer' }
    ],
    trendingRank: 25
  },
  {
    id: 'mov-hanuman',
    title: 'HanuMan',
    tagline: 'An underdog superhero of Anjanadri.',
    genres: ['Action', 'Fantasy', 'Mythology', 'Adventure'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam'],
    formats: ['3D', 'Dolby Atmos 2D', '2D'],
    certificate: 'U/A',
    durationMinutes: 158,
    releaseDate: 'Prasanth Varma Cinematic Universe',
    ratingPercent: 96,
    ratingScore: 9.4,
    voteCount: '470.2K',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/18/Hanu_Man_film_poster.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    trailerYoutubeId: '7B0z3u3rLp8',
    synopsis: 'In the fictional village of Anjanadri, a petty thief gains the divine powers of Lord Hanuman after discovering a celestial gem, rising to defend his people against a high-tech supervillain.',
    director: 'Prasanth Varma',
    cast: [
      { name: 'Teja Sajja', role: 'Hanumanthu', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Teja_Sajja_at_HanuMan_pre-release_event_%28cropped%29.jpg' },
      { name: 'Amritha Aiyer', role: 'Meenakshi', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Amritha_Aiyer_at_HanuMan_Success_Meet.jpg' },
      { name: 'Varalaxmi Sarathkumar', role: 'Anjamma', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Varalaxmi_Sarathkumar_at_Krack_Success_Meet.jpg' },
      { name: 'Vinay Rai', role: 'Michael', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Vinay_Rai_at_Doctor_Celebrations.jpg' }
    ],
    crew: [
      { name: 'Prasanth Varma', role: 'Director' },
      { name: 'GowraHari', role: 'Music Composer' }
    ],
    trendingRank: 26
  }
];

export const BMS_EVENTS: BMSEvent[] = [
  {
    id: 'evt-coldplay',
    title: 'Coldplay: Music of the Spheres World Tour Live',
    category: 'Concerts',
    venue: 'Global Grand Stadium Arena',
    city: 'Global Tour',
    dateTime: 'Sun, 18 Jan 2026 • 6:30 PM',
    startingPrice: 3500,
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    artist: 'Coldplay with Chris Martin',
    description: 'The world\'s biggest stadium pop spectacle arrives with groundbreaking kinetic dance floors and sustainable visual light wristbands.',
    tags: ['Music', 'Stadium', 'International']
  },
  {
    id: 'evt-zakir',
    title: 'Zakir Khan Live - Tathastu & Beyond Standup',
    category: 'Comedy',
    venue: 'Royal Opera & Arts Center',
    city: 'World Tour',
    dateTime: 'Sat, 06 Sep 2026 • 8:00 PM',
    startingPrice: 999,
    bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80',
    artist: 'Zakir Khan (Sakht Launda)',
    description: 'An evening of relatable storytelling, witty banter, heartwarming nostalgia, and classic punchlines from India\'s top comedic icon.',
    tags: ['Standup', 'Hindi Comedy', 'Solo Special']
  },
  {
    id: 'evt-arrahman',
    title: 'AR Rahman: Symphony of Sufi & Cinema',
    category: 'Concerts',
    venue: 'Grand Philharmonic Arena',
    city: 'World Tour',
    dateTime: 'Fri, 25 Sep 2026 • 7:00 PM',
    startingPrice: 2500,
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    artist: 'A.R. Rahman & The Royal Philharmonic Orchestra',
    description: 'Oscar-winning maestro AR Rahman live in grand symphonic concert featuring three decades of legendary film scores and transcendent Sufi suites.',
    tags: ['Symphony', 'Live Orchestra', 'Bollywood & Hollywood']
  },
  {
    id: 'evt-mughal',
    title: 'Mughal-e-Azam: The Grand Broadway Musical',
    category: 'Plays',
    venue: 'Broadway & West End Majestic Theatre',
    city: 'Global Premiere',
    dateTime: 'Sun, 13 Sep 2026 • 4:00 PM & 7:30 PM',
    startingPrice: 1499,
    bannerUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
    artist: 'Directed by Feroz Abbas Khan',
    description: 'A visual extravaganza of Kathak dancers, Manish Malhotra couture costumes, live acoustics, and timeless drama celebrating epic love.',
    tags: ['Theatre', 'Live Singing', 'Historical Drama']
  }
];

export const FOOD_MENU: FoodItem[] = [
  {
    id: 'fnb-pop-caramel',
    name: 'Caramel Crunch Popcorn (Large Tub)',
    category: 'Popcorn',
    price: 240,
    description: 'Freshly popped jumbo corn kernel coated in rich golden caramelized brown sugar butter.',
    isVeg: true,
    calories: 460,
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fnb-combo-duo',
    name: 'Blockbuster Combo (Large Popcorn + 2 Coke)',
    category: 'Combos',
    price: 420,
    description: '1 Jumbo Salted/Caramel Tub Popcorn + 2 Fountain Soft Drinks (500ml each) with free tub refill.',
    isVeg: true,
    calories: 780,
    imageUrl: 'https://images.unsplash.com/photo-1572177191856-3cde618dee1f?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fnb-nachos-cheese',
    name: 'Loaded Mexican Nachos with Warm Cheese & Salsa',
    category: 'Snacks',
    price: 260,
    description: 'Crispy stone-ground tortilla chips served with melted jalapeno cheddar cheese sauce and fresh tomato salsa.',
    isVeg: true,
    calories: 520,
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fnb-sliders',
    name: 'Crispy Gourmet Sliders (Trio Box)',
    category: 'Snacks',
    price: 310,
    description: 'Three mini gourmet brioche sliders with chipotle aioli, crispy patties, and house pickled cucumbers.',
    isVeg: false,
    calories: 620,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fnb-coke',
    name: 'Ice Chilled Fountain Pepsi / Coca-Cola (Large)',
    category: 'Beverages',
    price: 140,
    description: 'Ice-cold carbonated beverage served in an insulated CineWave cup with biodegradable straw.',
    isVeg: true,
    calories: 180,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fnb-coldbrew',
    name: 'Artisan Hazelnut Cold Brew Coffee',
    category: 'Beverages',
    price: 190,
    description: '18-hour steeped single-origin Arabica coffee infused with creamy roasted hazelnut notes.',
    isVeg: true,
    calories: 110,
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=300&q=80'
  }
];

/**
 * Generates realistic cinema venues tailored to the selected city.
 */
export function getCinemaVenuesForCity(city: CityData): CinemaVenue[] {
  const cityName = city.name;
  const isIndia = city.region === 'India';
  const isUS = city.country === 'United States';
  const isUK = city.country === 'United Kingdom';
  const isEU = city.region === 'Europe & UK' && !isUK;
  const isJapan = city.country === 'Japan';
  const isUAE = city.country === 'United Arab Emirates';
  const isAustralia = city.country === 'Australia';

  if (isIndia) {
    return [
      {
        id: `cin-pvr-inox-${city.id}`,
        name: `PVR INOX: ${cityName} Grand IMAX Laser`,
        chain: 'PVR INOX',
        location: `Central Galleria, ${cityName}`,
        distance: '2.4 km away',
        amenities: ['IMAX Laser', 'Dolby Atmos 7.1', 'M-Ticket', 'Recliner Seats', 'F&B Concessions', 'Wheelchair Access'],
        showtimes: [
          { showId: 'st-101', time: '10:30 AM', format: 'IMAX 3D', audioLanguage: 'Telugu', priceStart: 250, status: 'AVAILABLE', availablePercent: 78, cancellationAvailable: true },
          { showId: 'st-102', time: '01:45 PM', format: 'IMAX 3D', audioLanguage: 'Hindi', priceStart: 350, status: 'FILLING_FAST', availablePercent: 32, cancellationAvailable: true },
          { showId: 'st-103', time: '05:15 PM', format: 'IMAX 3D', audioLanguage: 'Telugu', priceStart: 450, status: 'ALMOST_FULL', availablePercent: 12, cancellationAvailable: true },
          { showId: 'st-104', time: '08:45 PM', format: 'IMAX 3D', audioLanguage: 'Hindi', priceStart: 450, status: 'FILLING_FAST', availablePercent: 24, cancellationAvailable: true },
          { showId: 'st-105', time: '11:55 PM', format: 'IMAX 3D', audioLanguage: 'Tamil', priceStart: 300, status: 'AVAILABLE', availablePercent: 65, cancellationAvailable: true }
        ]
      },
      {
        id: `cin-cinepolis-${city.id}`,
        name: `Cinépolis: Nexus VIP Luxury Cinemas`,
        chain: 'Cinépolis',
        location: `Prime Business District, ${cityName}`,
        distance: '4.8 km away',
        amenities: ['VIP Lounge Service', 'Full Recliners', 'Gourmet Dining at Seat', 'Dolby Atmos', 'M-Ticket'],
        showtimes: [
          { showId: 'st-201', time: '11:15 AM', format: 'Luxe VIP', audioLanguage: 'Telugu', priceStart: 350, status: 'AVAILABLE', availablePercent: 82, cancellationAvailable: true },
          { showId: 'st-202', time: '02:30 PM', format: 'Luxe VIP', audioLanguage: 'Hindi', priceStart: 450, status: 'AVAILABLE', availablePercent: 54, cancellationAvailable: true },
          { showId: 'st-203', time: '06:00 PM', format: 'Luxe VIP', audioLanguage: 'Telugu', priceStart: 550, status: 'FILLING_FAST', availablePercent: 28, cancellationAvailable: true },
          { showId: 'st-204', time: '09:30 PM', format: 'Luxe VIP', audioLanguage: 'Tamil', priceStart: 550, status: 'ALMOST_FULL', availablePercent: 8, cancellationAvailable: true }
        ]
      },
      {
        id: `cin-moviemax-${city.id}`,
        name: `MovieMax: Apex 4DX & Laser Screen`,
        chain: 'MovieMax',
        location: `West Boulevard, ${cityName}`,
        distance: '6.1 km away',
        amenities: ['4DX Motion Seats', 'Environmental Effects', 'Dolby 7.1', 'Self-Serve Kiosk', 'M-Ticket'],
        showtimes: [
          { showId: 'st-301', time: '12:00 PM', format: '4DX 3D', audioLanguage: 'Telugu', priceStart: 300, status: 'AVAILABLE', availablePercent: 60, cancellationAvailable: true },
          { showId: 'st-302', time: '03:45 PM', format: '4DX 3D', audioLanguage: 'Hindi', priceStart: 400, status: 'FILLING_FAST', availablePercent: 35, cancellationAvailable: true },
          { showId: 'st-303', time: '07:15 PM', format: '4DX 3D', audioLanguage: 'Telugu', priceStart: 450, status: 'FILLING_FAST', availablePercent: 18, cancellationAvailable: true },
          { showId: 'st-304', time: '10:30 PM', format: '4DX 3D', audioLanguage: 'Hindi', priceStart: 350, status: 'AVAILABLE', availablePercent: 50, cancellationAvailable: true }
        ]
      },
      {
        id: `cin-pvr-directors-${city.id}`,
        name: `PVR Director's Cut: Grand Empyrean`,
        chain: 'PVR Director\'s Cut',
        location: `Heritage Waterfront, ${cityName}`,
        distance: '5.2 km away',
        amenities: ['Chef Curated Menu', 'Belgian Chocolate Bar', 'Personal Butler Call Button', 'Laser Projection'],
        showtimes: [
          { showId: 'st-401', time: '01:00 PM', format: 'Luxe VIP', audioLanguage: 'Telugu', priceStart: 650, status: 'AVAILABLE', availablePercent: 70, cancellationAvailable: true },
          { showId: 'st-402', time: '04:30 PM', format: 'Luxe VIP', audioLanguage: 'Hindi', priceStart: 850, status: 'FILLING_FAST', availablePercent: 40, cancellationAvailable: true },
          { showId: 'st-403', time: '08:00 PM', format: 'Luxe VIP', audioLanguage: 'Tamil', priceStart: 1100, status: 'ALMOST_FULL', availablePercent: 10, cancellationAvailable: true }
        ]
      }
    ];
  }

  if (isUS) {
    return [
      {
        id: `cin-amc-${city.id}`,
        name: `AMC Theatres: ${cityName} Flagship IMAX Laser`,
        chain: 'AMC Theatres',
        location: `Downtown Metropolis, ${cityName}, ${city.state}`,
        distance: '1.8 miles away',
        amenities: ['IMAX with Laser', 'Dolby Cinema at AMC', 'AMC Signature Recliners', 'F&B Mobile Order', 'M-Ticket'],
        showtimes: [
          { showId: 'st-101', time: '10:45 AM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 21.00, status: 'AVAILABLE', availablePercent: 80, cancellationAvailable: true },
          { showId: 'st-102', time: '02:00 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 25.50, status: 'FILLING_FAST', availablePercent: 35, cancellationAvailable: true },
          { showId: 'st-103', time: '05:30 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 28.00, status: 'ALMOST_FULL', availablePercent: 10, cancellationAvailable: true },
          { showId: 'st-104', time: '09:00 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 28.00, status: 'FILLING_FAST', availablePercent: 20, cancellationAvailable: true }
        ]
      },
      {
        id: `cin-regal-${city.id}`,
        name: `Regal Cinemas: ${cityName} 4DX & RPX`,
        chain: 'Regal Cinemas',
        location: `Grand Promenade, ${cityName}, ${city.state}`,
        distance: '3.2 miles away',
        amenities: ['Regal RPX', '4DX Motion Immersive', 'King Size Recliners', 'Unlimited Refills'],
        showtimes: [
          { showId: 'st-201', time: '11:30 AM', format: '4DX 3D', audioLanguage: 'English', priceStart: 23.00, status: 'AVAILABLE', availablePercent: 75, cancellationAvailable: true },
          { showId: 'st-202', time: '03:15 PM', format: '4DX 3D', audioLanguage: 'English', priceStart: 27.00, status: 'FILLING_FAST', availablePercent: 40, cancellationAvailable: true },
          { showId: 'st-203', time: '07:00 PM', format: '4DX 3D', audioLanguage: 'English', priceStart: 29.00, status: 'ALMOST_FULL', availablePercent: 15, cancellationAvailable: true }
        ]
      },
      {
        id: `cin-alamo-${city.id}`,
        name: `Alamo Drafthouse Cinema: ${cityName} Dine-In`,
        chain: 'Alamo Drafthouse',
        location: `Arts & Entertainment District, ${cityName}`,
        distance: '4.5 miles away',
        amenities: ['Craft Beer & Cocktails', 'In-Theatre Hot Food Service', '35mm Projection Available', 'No Talking Rule'],
        showtimes: [
          { showId: 'st-301', time: '01:15 PM', format: 'Luxe VIP', audioLanguage: 'English', priceStart: 24.00, status: 'AVAILABLE', availablePercent: 65, cancellationAvailable: true },
          { showId: 'st-302', time: '04:45 PM', format: 'Luxe VIP', audioLanguage: 'English', priceStart: 28.00, status: 'FILLING_FAST', availablePercent: 25, cancellationAvailable: true },
          { showId: 'st-303', time: '08:30 PM', format: 'Luxe VIP', audioLanguage: 'English', priceStart: 30.00, status: 'ALMOST_FULL', availablePercent: 8, cancellationAvailable: true }
        ]
      }
    ];
  }

  if (isUK) {
    return [
      {
        id: `cin-odeon-${city.id}`,
        name: `Odeon Luxe: ${cityName} Dolby Cinema & IMAX`,
        chain: 'Odeon Luxe',
        location: `City Centre Square, ${cityName}`,
        distance: '1.2 miles away',
        amenities: ['Dolby Cinema', 'Luxury Full Power Recliners', 'Oscar\'s Bar & Lounge', 'Dolby Atmos', 'M-Ticket'],
        showtimes: [
          { showId: 'st-101', time: '11:00 AM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 19.50, status: 'AVAILABLE', availablePercent: 85, cancellationAvailable: true },
          { showId: 'st-102', time: '02:30 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 24.00, status: 'FILLING_FAST', availablePercent: 30, cancellationAvailable: true },
          { showId: 'st-103', time: '06:15 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 26.50, status: 'ALMOST_FULL', availablePercent: 12, cancellationAvailable: true },
          { showId: 'st-104', time: '09:45 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 24.00, status: 'AVAILABLE', availablePercent: 55, cancellationAvailable: true }
        ]
      },
      {
        id: `cin-vue-${city.id}`,
        name: `Vue Cinema: ${cityName} West End Laser`,
        chain: 'Vue Cinemas',
        location: `Grand Plaza, ${cityName}`,
        distance: '2.8 miles away',
        amenities: ['Laser Projection', 'VIP Recliner Seating', 'Sony 4K Digital Screens', 'F&B Concessions'],
        showtimes: [
          { showId: 'st-201', time: '12:15 PM', format: 'Dolby Atmos 2D', audioLanguage: 'English', priceStart: 18.00, status: 'AVAILABLE', availablePercent: 70, cancellationAvailable: true },
          { showId: 'st-202', time: '04:00 PM', format: 'Dolby Atmos 2D', audioLanguage: 'English', priceStart: 22.00, status: 'FILLING_FAST', availablePercent: 38, cancellationAvailable: true },
          { showId: 'st-203', time: '07:45 PM', format: 'Dolby Atmos 2D', audioLanguage: 'English', priceStart: 24.00, status: 'ALMOST_FULL', availablePercent: 14, cancellationAvailable: true }
        ]
      }
    ];
  }

  if (isUAE) {
    return [
      {
        id: `cin-vox-${city.id}`,
        name: `VOX Cinemas: ${cityName} Grand IMAX Laser`,
        chain: 'VOX Cinemas',
        location: `Grand City Mall, ${cityName}`,
        distance: '3.0 km away',
        amenities: ['IMAX Laser', 'THEATRE by Rhodes Gourmet', 'Dolby Atmos', 'M-Ticket', 'Valet Parking'],
        showtimes: [
          { showId: 'st-101', time: '11:30 AM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 25.00, status: 'AVAILABLE', availablePercent: 80, cancellationAvailable: true },
          { showId: 'st-102', time: '03:00 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 30.00, status: 'FILLING_FAST', availablePercent: 35, cancellationAvailable: true },
          { showId: 'st-103', time: '06:45 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 35.00, status: 'ALMOST_FULL', availablePercent: 10, cancellationAvailable: true },
          { showId: 'st-104', time: '10:15 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 32.00, status: 'FILLING_FAST', availablePercent: 25, cancellationAvailable: true }
        ]
      },
      {
        id: `cin-roxy-${city.id}`,
        name: `Roxy Cinemas: ${cityName} Platinum Plus`,
        chain: 'Roxy Cinemas',
        location: `Waterfront Boulevard, ${cityName}`,
        distance: '5.2 km away',
        amenities: ['Platinum Luxury Recliners', 'Personal Waiter Call', 'Fine Dining Menu', 'Private Cinema Lounge'],
        showtimes: [
          { showId: 'st-201', time: '01:30 PM', format: 'Luxe VIP', audioLanguage: 'English', priceStart: 38.00, status: 'AVAILABLE', availablePercent: 60, cancellationAvailable: true },
          { showId: 'st-202', time: '05:00 PM', format: 'Luxe VIP', audioLanguage: 'English', priceStart: 45.00, status: 'FILLING_FAST', availablePercent: 20, cancellationAvailable: true },
          { showId: 'st-203', time: '08:30 PM', format: 'Luxe VIP', audioLanguage: 'English', priceStart: 45.00, status: 'ALMOST_FULL', availablePercent: 8, cancellationAvailable: true }
        ]
      }
    ];
  }

  if (isJapan) {
    return [
      {
        id: `cin-toho-${city.id}`,
        name: `TOHO Cinemas: ${cityName} IMAX Laser & MX4D`,
        chain: 'TOHO Cinemas',
        location: `Central Station Plaza, ${cityName}`,
        distance: '0.8 km away',
        amenities: ['IMAX Laser 12ch', 'MX4D Motion Effects', 'Premium Sound TCX', 'Ticket Kiosks', 'Mobile M-Ticket'],
        showtimes: [
          { showId: 'st-101', time: '10:00 AM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 22.00, status: 'AVAILABLE', availablePercent: 82, cancellationAvailable: true },
          { showId: 'st-102', time: '01:15 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 26.00, status: 'FILLING_FAST', availablePercent: 30, cancellationAvailable: true },
          { showId: 'st-103', time: '04:45 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 28.00, status: 'ALMOST_FULL', availablePercent: 12, cancellationAvailable: true },
          { showId: 'st-104', time: '08:15 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 28.00, status: 'FILLING_FAST', availablePercent: 22, cancellationAvailable: true }
        ]
      }
    ];
  }

  // Default Global Metros & International Hubs
  return [
    {
      id: `cin-global-imax-${city.id}`,
      name: `CineWorld International: ${cityName} IMAX Laser`,
      chain: 'CineWorld International',
      location: `Metropolitan Galleria, ${cityName}, ${city.country}`,
      distance: '2.5 km away',
      amenities: ['IMAX Laser', 'Dolby Atmos 7.1', 'Luxury Recliners', 'F&B Concessions', 'M-Ticket'],
      showtimes: [
        { showId: 'st-101', time: '10:30 AM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 18.00, status: 'AVAILABLE', availablePercent: 78, cancellationAvailable: true },
        { showId: 'st-102', time: '01:45 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 24.50, status: 'FILLING_FAST', availablePercent: 32, cancellationAvailable: true },
        { showId: 'st-103', time: '05:15 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 28.00, status: 'ALMOST_FULL', availablePercent: 12, cancellationAvailable: true },
        { showId: 'st-104', time: '08:45 PM', format: 'IMAX 3D', audioLanguage: 'English', priceStart: 28.00, status: 'FILLING_FAST', availablePercent: 24, cancellationAvailable: true }
      ]
    },
    {
      id: `cin-global-luxe-${city.id}`,
      name: `Grand Palais Cinemas: ${cityName} VIP Royale`,
      chain: 'Grand Palais',
      location: `Avenue of the Arts, ${cityName}`,
      distance: '4.2 km away',
      amenities: ['VIP Lounge Service', 'Full Recliners', 'In-Seat Gourmet Dining', 'Dolby Atmos'],
      showtimes: [
        { showId: 'st-201', time: '11:15 AM', format: 'Luxe VIP', audioLanguage: 'English', priceStart: 22.00, status: 'AVAILABLE', availablePercent: 82, cancellationAvailable: true },
        { showId: 'st-202', time: '02:30 PM', format: 'Luxe VIP', audioLanguage: 'English', priceStart: 26.00, status: 'AVAILABLE', availablePercent: 54, cancellationAvailable: true },
        { showId: 'st-203', time: '06:00 PM', format: 'Luxe VIP', audioLanguage: 'English', priceStart: 32.00, status: 'FILLING_FAST', availablePercent: 28, cancellationAvailable: true }
      ]
    },
    {
      id: `cin-global-4dx-${city.id}`,
      name: `Apex Cinemas: ${cityName} 4DX Motion Experience`,
      chain: 'Apex Cinemas',
      location: `Shopping Promenade, ${cityName}`,
      distance: '5.8 km away',
      amenities: ['4DX Motion Seats', 'Environmental Effects', 'Dolby 7.1', 'M-Ticket'],
      showtimes: [
        { showId: 'st-301', time: '12:00 PM', format: '4DX 3D', audioLanguage: 'English', priceStart: 22.00, status: 'AVAILABLE', availablePercent: 60, cancellationAvailable: true },
        { showId: 'st-302', time: '03:45 PM', format: '4DX 3D', audioLanguage: 'English', priceStart: 26.00, status: 'FILLING_FAST', availablePercent: 35, cancellationAvailable: true },
        { showId: 'st-303', time: '07:15 PM', format: '4DX 3D', audioLanguage: 'English', priceStart: 28.00, status: 'FILLING_FAST', availablePercent: 18, cancellationAvailable: true }
      ]
    }
  ];
}

export const SAMPLE_CINEMA_VENUES: CinemaVenue[] = getCinemaVenuesForCity(CITIES_LIST[0]);

export const INITIAL_USER_BOOKINGS: BookingTicketRecord[] = [
  {
    bookingId: 'BMS-8921-9481',
    bookingTime: '2026-08-30 18:42',
    movieTitle: 'Pushpa 2: The Rule',
    moviePoster: 'https://upload.wikimedia.org/wikipedia/en/1/11/Pushpa_2-_The_Rule.jpg',
    movieLanguage: 'Telugu',
    movieFormat: 'IMAX 3D',
    cinemaName: 'PVR INOX: Mumbai Grand IMAX Laser',
    cinemaLocation: 'Central Galleria, Mumbai',
    audiNumber: 'Audi 1 (IMAX Laser)',
    showDate: 'Tonight • Sun, 31 Aug',
    showTime: '08:45 PM',
    seats: ['F7', 'F8'],
    seatTier: 'PRIME / CLUB',
    ticketCount: 2,
    baseAmount: 700,
    convenienceFee: 68,
    foodAmount: 420,
    discountAmount: 150,
    totalPaid: 1038,
    foodItems: [{ name: 'Blockbuster Combo (Large Popcorn + 2 Coke)', quantity: 1, price: 420 }],
    customerName: 'Jane Doe',
    customerEmail: 'jane.doe@example.com',
    customerPhone: '+91 98765 43210',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BMS-8921-9481-PUSHPA2-F7F8',
    status: 'CONFIRMED'
  }
];

export const SAMPLE_BOOKINGS = INITIAL_USER_BOOKINGS;
