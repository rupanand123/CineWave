# BookMyShow - Movies, Events & Entertainment Booking Platform

A high-performance entertainment ticketing and cinema booking web platform inspired by BookMyShow. Built with React 19, TypeScript, Tailwind CSS, Motion, and Firebase.

---

## 🌟 Key Features

### 🎬 1. Discovery & Cinematic Experience
- **Hero Carousel & Trailer Modals**: Embedded high-definition movie and event trailers with synopsis, cast, crew, and censor rating certifications.
- **Multi-City & Geo-Location Support**: Switch between major entertainment hubs (Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad) with localized pricing in ₹ INR.
- **Movies & Live Events Matrix**: Filter by genre, language, formats (IMAX 3D, 4DX, Dolby Atmos, 2D), and venue categories (Stand-up Comedy, Music Concerts, Plays, Sports).

### 💺 2. Interactive Seating Layout Engine
- **Tiered Cinema Seating**:
  - **Royal VIP Recliner** (Plush motorized leather recliners with food call service)
  - **Prime Club** (Optimum acoustic and sightline positioning)
  - **Classic Executive** (Tiered stadium theater seating)
- **Subtle Pulse & Available Seat Highlights**: Visual pulse indicators highlighting available seats in active tiers.
- **Interactive Seat Tooltips**: Hover over any seat to view live Seat ID, pricing, tier name, and real-time status (`Available`, `Selected`, or `Booked`).
- **Real-Time Seat Hold Timer**: Countdown locking mechanism (8-minute reservation timer) to prevent double-booking.

### 🍿 3. Food & Beverages Concessions (F&B)
- Pre-order cinema snacks including Butter Popcorn buckets, Nachos with Warm Cheese, Gourmet Combos, and Soft Drinks.
- Live cart calculation with customizable quantity modifiers and seamless checkout integration.

### 🎟️ 4. Checkout, QuikPay & Digital M-Tickets
- **Multiple Payment Channels**: UPI, Credit/Debit Cards, Net Banking, and BookMyShow **QuikPay Wallet**.
- **Digital M-Ticket**: Instant booking confirmation featuring dynamic QR Code scanner, auditorium screen details, seat codes, convenience fee breakdowns, and printable/downloadable pass.
- **My Bookings History**: Persistent Firestore synchronization of all past and active ticket reservations.

### 🔐 5. Authentication & User Profiles
- **Google Sign-In & Phone OTP**: Multi-channel authentication with instant Firestore profile synchronization.
- **SuperStar VIP Rewards & Member Profiles**: Track QuikPay balance, BMS Reward Points, saved cards, and booking history.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion
- **Icons**: Lucide React
- **Backend / Services**: Node.js, Express
- **Database & Auth**: Firebase Firestore, Firebase Authentication
- **Build Tool**: Vite

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd bookmyshow-clone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   └── bms/
│   │       ├── BMSAuthModal.tsx          # Multi-channel Auth Modal (Google, OTP, Demo)
│   │       ├── BMSCheckoutModal.tsx      # Payment gateway & QuikPay checkout
│   │       ├── BMSCinematicIntroPage.tsx # Cinematic landing page & quick login
│   │       ├── BMSCityModal.tsx          # City & location selector
│   │       ├── BMSDigitalTicketModal.tsx # Digital M-Ticket with QR Code
│   │       ├── BMSEventsSection.tsx      # Live concerts, comedy & sports
│   │       ├── BMSFoodConcessions.tsx    # F&B snack ordering engine
│   │       ├── BMSHeroCarousel.tsx       # Featured trailers carousel
│   │       ├── BMSMovieDetailModal.tsx   # Detailed movie synopsis & cast
│   │       ├── BMSMovieGrid.tsx          # Movie catalog with filters
│   │       ├── BMSMyBookingsModal.tsx    # Booking history & active tickets
│   │       ├── BMSNavbar.tsx             # Main header with search & profile
│   │       ├── BMSSeatLayoutEngine.tsx   # Interactive cinema seat grid
│   │       ├── BMSShowtimeMatrix.tsx     # Theater list & showtime selection
│   │       ├── BMSTrailerModal.tsx       # HD trailer video player
│   │       └── BMSUserProfileModal.tsx   # QuikPay wallet & user preferences
│   ├── data/
│   │   └── bmsData.ts                    # Movies, venues, events & F&B catalog
│   ├── lib/
│   │   └── firebase.ts                   # Firebase Auth, Firestore sync & models
│   ├── types/
│   │   └── bms.ts                        # TypeScript interfaces & domain types
│   ├── App.tsx                           # Main application orchestrator
│   ├── main.tsx                          # App entry point
│   └── index.css                         # Global CSS & seat animations
├── metadata.json                         # App capabilities & permissions
├── package.json                          # Dependencies and scripts
└── vite.config.ts                        # Vite configuration
```

---

## 📄 License

MIT License. Designed for high-concurrency movie and entertainment ticketing experiences.
