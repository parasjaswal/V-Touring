import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Menu, X, MapPin, Phone, Mail, Calendar, Users, Globe, Heart, Star, Award } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Destinations data with packages
const destinations = [
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=srgb&fm=jpg&q=85",
    description: "Experience luxury and modern architecture in the heart of UAE",
    packages: [
      { id: "dubai-luxury", name: "Dubai Luxury Escape", duration: "5 Days / 4 Nights", price: "₹65,000", highlights: ["Burj Khalifa", "Desert Safari", "Dubai Mall", "5-Star Hotel"] },
      { id: "dubai-family", name: "Dubai Family Adventure", duration: "6 Days / 5 Nights", price: "₹85,000", highlights: ["Theme Parks", "Aquarium", "Beach Resort", "City Tour"] }
    ]
  },
  {
    id: "malaysia",
    name: "Malaysia",
    country: "Southeast Asia",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?crop=entropy&cs=srgb&fm=jpg&q=85",
    description: "Discover the perfect blend of modernity and tradition",
    packages: [
      { id: "malaysia-highlight", name: "Malaysia Highlights", duration: "5 Days / 4 Nights", price: "₹45,000", highlights: ["Kuala Lumpur", "Genting Highlands", "Batu Caves", "Shopping"] },
      { id: "malaysia-islands", name: "Malaysia Island Hopping", duration: "7 Days / 6 Nights", price: "₹70,000", highlights: ["Langkawi", "Penang", "Beach Resorts", "Water Sports"] }
    ]
  },
  {
    id: "thailand",
    name: "Thailand",
    country: "Southeast Asia",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?crop=entropy&cs=srgb&fm=jpg&q=85",
    description: "Land of smiles with pristine beaches and rich culture",
    packages: [
      { id: "thailand-phuket", name: "Phuket Beach Paradise", duration: "5 Days / 4 Nights", price: "₹48,000", highlights: ["Phi Phi Islands", "Patong Beach", "Water Activities", "Thai Massage"] },
      { id: "thailand-combo", name: "Bangkok Pattaya Combo", duration: "6 Days / 5 Nights", price: "₹55,000", highlights: ["Grand Palace", "Coral Island", "Shopping", "Nightlife"] }
    ]
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Indian Ocean",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=srgb&fm=jpg&q=85",
    description: "Paradise on Earth with crystal clear waters",
    packages: [
      { id: "maldives-romantic", name: "Maldives Romantic Getaway", duration: "4 Days / 3 Nights", price: "₹95,000", highlights: ["Overwater Villa", "Snorkeling", "Spa", "Candlelight Dinner"] },
      { id: "maldives-luxury", name: "Maldives Luxury Retreat", duration: "6 Days / 5 Nights", price: "₹1,50,000", highlights: ["Private Pool Villa", "Diving", "Yacht Trip", "All Inclusive"] }
    ]
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?crop=entropy&cs=srgb&fm=jpg&q=85",
    description: "Island of Gods with stunning temples and beaches",
    packages: [
      { id: "bali-explorer", name: "Bali Explorer", duration: "5 Days / 4 Nights", price: "₹52,000", highlights: ["Ubud", "Tanah Lot", "Rice Terraces", "Beach Clubs"] },
      { id: "bali-honeymoon", name: "Bali Honeymoon Special", duration: "6 Days / 5 Nights", price: "₹75,000", highlights: ["Private Villa", "Spa", "Romantic Dinner", "Island Tour"] }
    ]
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Southeast Asia",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?crop=entropy&cs=srgb&fm=jpg&q=85",
    description: "The Lion City with futuristic attractions",
    packages: [
      { id: "singapore-family", name: "Singapore Family Fun", duration: "4 Days / 3 Nights", price: "₹58,000", highlights: ["Universal Studios", "Gardens by the Bay", "Sentosa", "Night Safari"] },
      { id: "singapore-luxury", name: "Singapore Luxury Tour", duration: "5 Days / 4 Nights", price: "₹82,000", highlights: ["Marina Bay Sands", "Shopping", "Fine Dining", "City Tour"] }
    ]
  },
  {
    id: "vietnam",
    name: "Vietnam",
    country: "Southeast Asia",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?crop=entropy&cs=srgb&fm=jpg&q=85",
    description: "Rich history and breathtaking natural beauty",
    packages: [
      { id: "vietnam-heritage", name: "Vietnam Heritage Tour", duration: "6 Days / 5 Nights", price: "₹50,000", highlights: ["Hanoi", "Halong Bay", "Hoi An", "Ho Chi Minh"] },
      { id: "vietnam-beach", name: "Vietnam Beach & Culture", duration: "7 Days / 6 Nights", price: "₹62,000", highlights: ["Nha Trang", "Da Nang", "Temples", "Cuisine Tour"] }
    ]
  },
  {
    id: "mauritius",
    name: "Mauritius",
    country: "Africa",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=srgb&fm=jpg&q=85",
    description: "Tropical paradise with diverse culture",
    packages: [
      { id: "mauritius-beach", name: "Mauritius Beach Bliss", duration: "5 Days / 4 Nights", price: "₹78,000", highlights: ["Beach Resort", "Underwater Walk", "Ile aux Cerfs", "Water Sports"] },
      { id: "mauritius-complete", name: "Mauritius Complete", duration: "7 Days / 6 Nights", price: "₹1,05,000", highlights: ["Island Tour", "Catamaran Cruise", "Spa", "All Meals"] }
    ]
  },
  {
    id: "europe",
    name: "Europe",
    country: "Multi-Country",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?crop=entropy&cs=srgb&fm=jpg&q=85",
    description: "Explore historic cities and stunning landscapes",
    packages: [
      { id: "europe-classic", name: "Classic Europe Tour", duration: "10 Days / 9 Nights", price: "₹1,85,000", highlights: ["Paris", "Switzerland", "Italy", "Amsterdam"] },
      { id: "europe-grand", name: "Grand Europe Experience", duration: "15 Days / 14 Nights", price: "₹2,75,000", highlights: ["8 Countries", "Guided Tours", "Luxury Hotels", "All Transfers"] }
    ]
  },
  {
    id: "andaman",
    name: "Andaman",
    country: "India",
    image: "https://images.unsplash.com/photo-1606219757640-b5d502e5e901?crop=entropy&cs=srgb&fm=jpg&q=85",
    description: "India's emerald islands with pristine beaches",
    packages: [
      { id: "andaman-island", name: "Andaman Island Tour", duration: "5 Days / 4 Nights", price: "₹35,000", highlights: ["Port Blair", "Havelock", "Radhanagar Beach", "Water Sports"] },
      { id: "andaman-extended", name: "Andaman Extended Paradise", duration: "7 Days / 6 Nights", price: "₹48,000", highlights: ["Neil Island", "Scuba Diving", "Cellular Jail", "Beach Resorts"] }
    ]
  },
  {
    id: "kerala",
    name: "Kerala",
    country: "India",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?crop=entropy&cs=srgb&fm=jpg&q=85",
    description: "God's Own Country with backwaters and hills",
    packages: [
      { id: "kerala-backwaters", name: "Kerala Backwaters", duration: "4 Days / 3 Nights", price: "₹28,000", highlights: ["Houseboat", "Alleppey", "Cochin", "Ayurveda Spa"] },
      { id: "kerala-complete", name: "Kerala Complete Tour", duration: "6 Days / 5 Nights", price: "₹42,000", highlights: ["Munnar", "Thekkady", "Kovalam", "Tea Gardens"] }
    ]
  },
  {
    id: "kashmir",
    name: "Kashmir",
    country: "India",
    image: "https://images.unsplash.com/photo-1568849676085-51415703900f?crop=entropy&cs=srgb&fm=jpg&q=85",
    description: "Paradise on Earth with snow-capped mountains",
    packages: [
      { id: "kashmir-valley", name: "Kashmir Valley Tour", duration: "5 Days / 4 Nights", price: "₹32,000", highlights: ["Srinagar", "Dal Lake", "Gulmarg", "Pahalgam"] },
      { id: "kashmir-premium", name: "Kashmir Premium Experience", duration: "7 Days / 6 Nights", price: "₹55,000", highlights: ["Houseboat Stay", "Gondola Ride", "Sonmarg", "Shikara Ride"] }
    ]
  }
];

// Navigation Component
const Navigation = ({ onBookingClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar" data-testid="main-navigation">
      <div className="nav-container">
        <Link to="/" className="logo" data-testid="logo-link">
          <Globe className="logo-icon" />
          <span>V Touring</span>
        </Link>
        
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} data-testid="nav-home">Home</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} data-testid="nav-about">About</Link>
          <Link to="/vision-mission" onClick={() => setIsMobileMenuOpen(false)} data-testid="nav-vision">Vision & Mission</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} data-testid="nav-contact">Contact Us</Link>
          <Button 
            onClick={() => {
              onBookingClick();
              setIsMobileMenuOpen(false);
            }} 
            className="book-now-btn"
            data-testid="nav-book-now-btn"
          >
            Book Now
          </Button>
        </div>

        <button 
          className="mobile-menu-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-testid="mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="footer" data-testid="main-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>V Touring</h3>
          <p>Your trusted travel partner for unforgettable journeys around the world.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/about" data-testid="footer-about">About Us</Link>
          <Link to="/vision-mission" data-testid="footer-vision">Vision & Mission</Link>
          <Link to="/contact" data-testid="footer-contact">Contact Us</Link>
        </div>
        
        <div className="footer-section">
          <h4>Legal</h4>
          <Link to="/privacy-policy" data-testid="footer-privacy">Privacy Policy</Link>
          <Link to="/terms-conditions" data-testid="footer-terms">Terms & Conditions</Link>
          <Link to="/refund-policy" data-testid="footer-refund">Refund Policy</Link>
          <Link to="/disclaimer" data-testid="footer-disclaimer">Disclaimer</Link>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p><Phone size={16} /> +91 98765 43210</p>
          <p><Mail size={16} /> info@vtouring.com</p>
          <p><MapPin size={16} /> Mumbai, India</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 V Touring. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Booking Dialog Component
const BookingDialog = ({ isOpen, onClose, selectedDestination = null, selectedPackage = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: selectedDestination || "",
    package: selectedPackage || "",
    travel_date: "",
    num_travelers: 1,
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/bookings`, formData);
      toast.success("Booking request submitted successfully! We'll contact you soon.");
      onClose();
      setFormData({
        name: "",
        email: "",
        phone: "",
        destination: "",
        package: "",
        travel_date: "",
        num_travelers: 1,
        message: ""
      });
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="booking-dialog" data-testid="booking-dialog">
        <DialogHeader>
          <DialogTitle data-testid="booking-dialog-title">Book Your Dream Vacation</DialogTitle>
          <DialogDescription>Fill in the details and we'll get back to you shortly</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="booking-form" data-testid="booking-form">
          <div className="form-grid">
            <div className="form-group">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                data-testid="booking-name-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                data-testid="booking-email-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                data-testid="booking-phone-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="destination">Destination *</Label>
              <Select value={formData.destination} onValueChange={(value) => setFormData({ ...formData, destination: value })} required>
                <SelectTrigger data-testid="booking-destination-select">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map(dest => (
                    <SelectItem key={dest.id} value={dest.name}>{dest.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="form-group">
              <Label htmlFor="package">Package *</Label>
              <Input
                id="package"
                data-testid="booking-package-input"
                value={formData.package}
                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                placeholder="Enter package name"
                required
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="travel_date">Travel Date *</Label>
              <Input
                id="travel_date"
                type="date"
                data-testid="booking-date-input"
                value={formData.travel_date}
                onChange={(e) => setFormData({ ...formData, travel_date: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="num_travelers">Number of Travelers *</Label>
              <Input
                id="num_travelers"
                type="number"
                min="1"
                data-testid="booking-travelers-input"
                value={formData.num_travelers}
                onChange={(e) => setFormData({ ...formData, num_travelers: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>
          
          <div className="form-group full-width">
            <Label htmlFor="message">Special Requests (Optional)</Label>
            <Textarea
              id="message"
              data-testid="booking-message-textarea"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
            />
          </div>
          
          <Button type="submit" className="submit-btn" disabled={isSubmitting} data-testid="booking-submit-btn">
            {isSubmitting ? "Submitting..." : "Submit Booking Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Home Page
const Home = ({ onBookingClick }) => {
  const navigate = useNavigate();

  return (
    <div className="page" data-testid="home-page">
      {/* Hero Section */}
      <section className="hero" data-testid="hero-section">
        <div className="hero-content">
          <h1 className="hero-title" data-testid="hero-title">Discover Your Next Adventure</h1>
          <p className="hero-subtitle" data-testid="hero-subtitle">Explore breathtaking destinations across the globe with V Touring</p>
          <Button onClick={onBookingClick} className="hero-cta" data-testid="hero-book-btn">
            <Calendar className="btn-icon" />
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="destinations-section" data-testid="destinations-section">
        <div className="section-container">
          <h2 className="section-title" data-testid="destinations-title">Popular Destinations</h2>
          <p className="section-subtitle">Handpicked locations for unforgettable experiences</p>
          
          <div className="destinations-grid">
            {destinations.map((dest) => (
              <div key={dest.id} className="destination-card" data-testid={`destination-card-${dest.id}`}>
                <div className="destination-image" style={{ backgroundImage: `url(${dest.image})` }}>
                  <div className="destination-overlay">
                    <h3>{dest.name}</h3>
                    <p>{dest.country}</p>
                  </div>
                </div>
                <div className="destination-content">
                  <p>{dest.description}</p>
                  <div className="destination-packages">
                    <span className="package-count">{dest.packages.length} Packages Available</span>
                  </div>
                  <Button 
                    onClick={() => navigate(`/destination/${dest.id}`)} 
                    className="view-packages-btn"
                    data-testid={`view-packages-${dest.id}`}
                  >
                    View Packages
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section" data-testid="features-section">
        <div className="section-container">
          <h2 className="section-title">Why Choose V Touring?</h2>
          
          <div className="features-grid">
            <div className="feature-card" data-testid="feature-best-prices">
              <Award className="feature-icon" />
              <h3>Best Prices</h3>
              <p>Competitive pricing with no hidden charges</p>
            </div>
            
            <div className="feature-card" data-testid="feature-expert-guidance">
              <Users className="feature-icon" />
              <h3>Expert Guidance</h3>
              <p>Professional travel consultants at your service</p>
            </div>
            
            <div className="feature-card" data-testid="feature-custom-packages">
              <Heart className="feature-icon" />
              <h3>Custom Packages</h3>
              <p>Tailored itineraries to match your preferences</p>
            </div>
            
            <div className="feature-card" data-testid="feature-support">
              <Star className="feature-icon" />
              <h3>24/7 Support</h3>
              <p>Round-the-clock assistance during your travels</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Destination Detail Page
const DestinationDetail = ({ onBookingClick }) => {
  const { id } = window.location.pathname.split('/').pop();
  const destination = destinations.find(d => d.id === id);

  if (!destination) {
    return <div className="page"><p>Destination not found</p></div>;
  }

  return (
    <div className="page destination-detail" data-testid="destination-detail-page">
      <div className="destination-hero" style={{ backgroundImage: `url(${destination.image})` }}>
        <div className="destination-hero-overlay">
          <h1 data-testid="destination-name">{destination.name}</h1>
          <p data-testid="destination-country">{destination.country}</p>
        </div>
      </div>

      <div className="section-container">
        <div className="destination-info">
          <h2>About {destination.name}</h2>
          <p className="destination-description">{destination.description}</p>
        </div>

        <h2 className="packages-title" data-testid="packages-title">Available Packages</h2>
        <div className="packages-grid">
          {destination.packages.map((pkg) => (
            <div key={pkg.id} className="package-card" data-testid={`package-card-${pkg.id}`}>
              <div className="package-header">
                <h3 data-testid={`package-name-${pkg.id}`}>{pkg.name}</h3>
                <p className="package-duration">{pkg.duration}</p>
              </div>
              
              <div className="package-price" data-testid={`package-price-${pkg.id}`}>
                <span className="price-label">Starting from</span>
                <span className="price-amount">{pkg.price}</span>
                <span className="price-per">per person</span>
              </div>
              
              <div className="package-highlights">
                <h4>Highlights:</h4>
                <ul>
                  {pkg.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
              
              <Button 
                onClick={() => onBookingClick(destination.name, pkg.name)} 
                className="book-package-btn"
                data-testid={`book-package-${pkg.id}`}
              >
                Book This Package
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// About Page
const About = () => {
  return (
    <div className="page content-page" data-testid="about-page">
      <div className="section-container">
        <h1 className="page-title" data-testid="about-title">About V Touring</h1>
        
        <div className="content-section">
          <p>Welcome to V Touring, your trusted partner in creating unforgettable travel experiences. With years of expertise in the travel industry, we specialize in crafting personalized journeys that cater to every traveler's unique preferences and dreams.</p>
          
          <h2>Our Story</h2>
          <p>Founded with a passion for exploration and adventure, V Touring has grown to become one of India's leading travel agencies. We believe that travel is not just about visiting new places; it's about creating memories that last a lifetime.</p>
          
          <h2>What We Offer</h2>
          <ul className="styled-list">
            <li>Customized tour packages for domestic and international destinations</li>
            <li>Handpicked accommodations and experiences</li>
            <li>Expert travel consultants to guide you at every step</li>
            <li>24/7 customer support during your travels</li>
            <li>Competitive pricing with transparent policies</li>
            <li>Group tours, family vacations, and honeymoon packages</li>
          </ul>
          
          <h2>Our Commitment</h2>
          <p>At V Touring, we are committed to delivering excellence in every aspect of your journey. From the moment you contact us to the time you return home with cherished memories, we ensure a seamless and delightful experience.</p>
        </div>
      </div>
    </div>
  );
};

// Vision & Mission Page
const VisionMission = () => {
  return (
    <div className="page content-page" data-testid="vision-mission-page">
      <div className="section-container">
        <h1 className="page-title" data-testid="vision-mission-title">Vision & Mission</h1>
        
        <div className="content-section">
          <div className="vision-mission-card">
            <h2>Our Vision</h2>
            <p>To be the most trusted and preferred travel partner globally, inspiring people to explore the world and create meaningful connections through travel. We envision a future where every journey we curate becomes a transformative experience that enriches lives and broadens perspectives.</p>
          </div>
          
          <div className="vision-mission-card">
            <h2>Our Mission</h2>
            <p>Our mission is to provide exceptional travel experiences that exceed expectations while maintaining the highest standards of service, safety, and sustainability. We strive to:</p>
            <ul className="styled-list">
              <li>Deliver personalized and innovative travel solutions</li>
              <li>Build lasting relationships with our clients based on trust and transparency</li>
              <li>Support local communities and promote responsible tourism</li>
              <li>Continuously innovate and adapt to changing travel needs</li>
              <li>Make travel accessible and enjoyable for everyone</li>
              <li>Create memorable experiences that inspire lifelong wanderlust</li>
            </ul>
          </div>
          
          <div className="vision-mission-card">
            <h2>Our Values</h2>
            <ul className="styled-list">
              <li><strong>Excellence:</strong> We pursue excellence in every service we provide</li>
              <li><strong>Integrity:</strong> We operate with honesty and transparency</li>
              <li><strong>Customer-Centric:</strong> Your satisfaction is our top priority</li>
              <li><strong>Innovation:</strong> We embrace new ideas and technologies</li>
              <li><strong>Sustainability:</strong> We promote responsible and eco-friendly travel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Page
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/contacts`, formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page content-page" data-testid="contact-page">
      <div className="section-container">
        <h1 className="page-title" data-testid="contact-title">Contact Us</h1>
        
        <div className="contact-layout">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <Phone className="contact-icon" />
                <div>
                  <h4>Phone</h4>
                  <p>+91 98765 43210</p>
                  <p>+91 98765 43211</p>
                </div>
              </div>
              
              <div className="contact-item">
                <Mail className="contact-icon" />
                <div>
                  <h4>Email</h4>
                  <p>info@vtouring.com</p>
                  <p>support@vtouring.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <MapPin className="contact-icon" />
                <div>
                  <h4>Address</h4>
                  <p>V Touring Headquarters</p>
                  <p>Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-form-container">
            <form onSubmit={handleSubmit} className="contact-form" data-testid="contact-form">
              <div className="form-group">
                <Label htmlFor="contact-name">Name *</Label>
                <Input
                  id="contact-name"
                  data-testid="contact-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <Label htmlFor="contact-email">Email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  data-testid="contact-email-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <Label htmlFor="contact-subject">Subject *</Label>
                <Input
                  id="contact-subject"
                  data-testid="contact-subject-input"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <Label htmlFor="contact-message">Message *</Label>
                <Textarea
                  id="contact-message"
                  data-testid="contact-message-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  required
                />
              </div>
              
              <Button type="submit" className="submit-btn" disabled={isSubmitting} data-testid="contact-submit-btn">
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Privacy Policy Page
const PrivacyPolicy = () => {
  return (
    <div className="page content-page" data-testid="privacy-policy-page">
      <div className="section-container">
        <h1 className="page-title">Privacy Policy</h1>
        
        <div className="content-section">
          <p className="last-updated">Last Updated: January 2025</p>
          
          <h2>1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including your name, email address, phone number, travel preferences, and payment information when you book our services.</p>
          
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="styled-list">
            <li>Process your bookings and provide travel services</li>
            <li>Communicate with you about your trips</li>
            <li>Send promotional materials (with your consent)</li>
            <li>Improve our services and customer experience</li>
            <li>Comply with legal obligations</li>
          </ul>
          
          <h2>3. Information Sharing</h2>
          <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
          <ul className="styled-list">
            <li>Hotels, airlines, and other service providers to fulfill your bookings</li>
            <li>Payment processors for transaction processing</li>
            <li>Legal authorities when required by law</li>
          </ul>
          
          <h2>4. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
          
          <h2>5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>
          
          <h2>6. Cookies</h2>
          <p>We use cookies to enhance your browsing experience and analyze website traffic. You can control cookie preferences through your browser settings.</p>
          
          <h2>7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@vtouring.com</p>
        </div>
      </div>
    </div>
  );
};

// Terms & Conditions Page
const TermsConditions = () => {
  return (
    <div className="page content-page" data-testid="terms-conditions-page">
      <div className="section-container">
        <h1 className="page-title">Terms & Conditions</h1>
        
        <div className="content-section">
          <p className="last-updated">Last Updated: January 2025</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using V Touring's services, you accept and agree to be bound by these terms and conditions.</p>
          
          <h2>2. Booking and Payment</h2>
          <ul className="styled-list">
            <li>All bookings are subject to availability</li>
            <li>Full payment or deposit is required to confirm bookings</li>
            <li>Prices are subject to change without notice until booking is confirmed</li>
            <li>Additional charges may apply for last-minute bookings or peak season travel</li>
          </ul>
          
          <h2>3. Cancellation Policy</h2>
          <ul className="styled-list">
            <li>Cancellations must be made in writing</li>
            <li>Cancellation charges apply as per our refund policy</li>
            <li>No refunds for no-shows or unused services</li>
          </ul>
          
          <h2>4. Travel Documents</h2>
          <p>Travelers are responsible for ensuring they have valid passports, visas, and other required travel documents. V Touring is not liable for denied entry due to invalid documentation.</p>
          
          <h2>5. Insurance</h2>
          <p>We strongly recommend purchasing comprehensive travel insurance. V Touring is not responsible for losses due to trip cancellations, medical emergencies, or lost luggage.</p>
          
          <h2>6. Liability</h2>
          <p>V Touring acts as an intermediary between travelers and service providers. We are not liable for any injury, loss, or damage arising from services provided by third parties.</p>
          
          <h2>7. Changes to Itinerary</h2>
          <p>We reserve the right to modify itineraries due to unforeseen circumstances. We will make reasonable efforts to provide suitable alternatives.</p>
          
          <h2>8. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of Mumbai courts.</p>
        </div>
      </div>
    </div>
  );
};

// Refund Policy Page
const RefundPolicy = () => {
  return (
    <div className="page content-page" data-testid="refund-policy-page">
      <div className="section-container">
        <h1 className="page-title">Refund Policy</h1>
        
        <div className="content-section">
          <p className="last-updated">Last Updated: January 2025</p>
          
          <h2>Cancellation Charges</h2>
          <p>The following cancellation charges apply for tour packages:</p>
          
          <div className="refund-table">
            <div className="refund-row">
              <span className="refund-period">More than 30 days before departure:</span>
              <span className="refund-charge">10% of package cost</span>
            </div>
            <div className="refund-row">
              <span className="refund-period">15-30 days before departure:</span>
              <span className="refund-charge">25% of package cost</span>
            </div>
            <div className="refund-row">
              <span className="refund-period">7-14 days before departure:</span>
              <span className="refund-charge">50% of package cost</span>
            </div>
            <div className="refund-row">
              <span className="refund-period">Less than 7 days before departure:</span>
              <span className="refund-charge">No refund</span>
            </div>
          </div>
          
          <h2>Refund Process</h2>
          <ul className="styled-list">
            <li>Refund requests must be submitted in writing to refunds@vtouring.com</li>
            <li>Refunds will be processed within 15-20 business days</li>
            <li>Refunds will be credited to the original payment method</li>
            <li>Bank charges and processing fees are non-refundable</li>
          </ul>
          
          <h2>Special Circumstances</h2>
          <p>In case of unforeseen circumstances such as natural disasters, political unrest, or medical emergencies, we will work with you to reschedule your trip or provide a partial refund based on recoverable costs.</p>
          
          <h2>Non-Refundable Items</h2>
          <ul className="styled-list">
            <li>Visa fees and documentation charges</li>
            <li>Travel insurance premiums</li>
            <li>Non-refundable hotel deposits</li>
            <li>Peak season surcharges</li>
          </ul>
          
          <h2>Contact Us</h2>
          <p>For refund inquiries, please contact us at refunds@vtouring.com or call +91 98765 43210</p>
        </div>
      </div>
    </div>
  );
};

// Disclaimer Page
const Disclaimer = () => {
  return (
    <div className="page content-page" data-testid="disclaimer-page">
      <div className="section-container">
        <h1 className="page-title">Disclaimer</h1>
        
        <div className="content-section">
          <h2>General Information</h2>
          <p>The information provided on this website is for general informational purposes only. While we strive to keep the information accurate and up-to-date, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or availability of the information.</p>
          
          <h2>Third-Party Services</h2>
          <p>V Touring acts as an intermediary between travelers and various service providers including airlines, hotels, transport companies, and local tour operators. We are not responsible for the quality, safety, or performance of services provided by these third parties.</p>
          
          <h2>Travel Risks</h2>
          <p>Travel involves inherent risks. Travelers are responsible for:</p>
          <ul className="styled-list">
            <li>Ensuring they are medically fit to travel</li>
            <li>Obtaining necessary vaccinations and health precautions</li>
            <li>Understanding local laws and customs of destination countries</li>
            <li>Taking appropriate safety measures during their travels</li>
          </ul>
          
          <h2>Price Variations</h2>
          <p>Prices displayed on our website are indicative and subject to change based on availability, seasonality, and currency fluctuations. Final prices will be confirmed at the time of booking.</p>
          
          <h2>Images and Content</h2>
          <p>Images on this website are for representational purposes only. Actual services, accommodations, and experiences may vary.</p>
          
          <h2>External Links</h2>
          <p>Our website may contain links to external sites. We are not responsible for the content, privacy practices, or services of these third-party websites.</p>
          
          <h2>Force Majeure</h2>
          <p>V Touring shall not be liable for any failure to perform its obligations due to circumstances beyond its control, including but not limited to natural disasters, acts of terrorism, civil unrest, pandemics, or government restrictions.</p>
          
          <h2>Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, V Touring shall not be liable for any indirect, consequential, or incidental damages arising from the use of our services.</p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleBookingClick = (destination = null, packageName = null) => {
    setSelectedDestination(destination);
    setSelectedPackage(packageName);
    setIsBookingOpen(true);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navigation onBookingClick={() => handleBookingClick()} />
        
        <Routes>
          <Route path="/" element={<Home onBookingClick={handleBookingClick} />} />
          <Route path="/about" element={<About />} />
          <Route path="/vision-mission" element={<VisionMission />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/destination/:id" element={<DestinationDetail onBookingClick={handleBookingClick} />} />
        </Routes>
        
        <Footer />
        
        <BookingDialog 
          isOpen={isBookingOpen} 
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedDestination(null);
            setSelectedPackage(null);
          }}
          selectedDestination={selectedDestination}
          selectedPackage={selectedPackage}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;