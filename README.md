# KaamSaathi - Local Labour Booking Platform

A responsive web application for connecting customers with local laborers, featuring dual authentication, service booking, and bilingual support (English/Hindi).

## 🚀 Features

- **Dual Authentication System**: Separate login flows for customers and workers (partners)
- **Service Categories**: Electrician, Builder, Plumber, Carpenter, Whitewasher
- **Horizontal Scrollable Categories**: Smooth, touch-friendly category selection
- **Worker Listings**: Detailed worker profiles with ratings, pricing, and availability
- **Blinkit-Style Booking**: Quick and intuitive booking flow with bottom sheet modal
- **Bilingual Support**: Toggle between English and Hindi throughout the app
- **Responsive Design**: Fully mobile-responsive with elegant, eye-friendly colors
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Lottie Animation Placeholders**: Ready for professional animations

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context API

## 📁 Project Structure

```
kaamsathi/
├── app/
│   ├── dashboard/
│   │   ├── customer/          # Customer dashboard
│   │   └── partner/           # Partner dashboard
│   ├── login/
│   │   ├── customer/          # Customer auth
│   │   └── partner/           # Partner auth
│   ├── workers/
│   │   └── [category]/        # Dynamic worker listings
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Landing page
├── components/
│   ├── Navbar.tsx
│   ├── ServiceCategory.tsx
│   ├── WorkerCard.tsx
│   ├── BookingModal.tsx
│   └── LottiePlayer.tsx
├── contexts/
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   └── BookingContext.tsx
├── data/
│   └── mockData.ts            # Mock worker data
├── types/
│   └── index.ts
└── public/
    └── placeholder-worker.jpg
```

## 🎨 Design Features

- **Color Palette**: Soft blues, greens, and warm neutrals for trust and professionalism
- **Custom Animations**: Fade-in, slide-up, slide-in, and float effects
- **Glass Effect**: Modern glassmorphism for overlays
- **Gradient Backgrounds**: Eye-catching service category cards
- **Smooth Transitions**: All interactions have polished animations

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm installed

### Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 📱 Usage Flow

### For Customers:
1. Click "Login as Customer" on landing page
2. Sign up or log in
3. Browse service categories (horizontal scroll)
4. Click a category to view available workers
5. Click "Book Now" on a worker card
6. Fill in booking details (date, address, days)
7. Confirm booking

### For Partners (Workers):
1. Click "Login as Partner" on landing page
2. Sign up or log in
3. View dashboard with booking statistics
4. Manage incoming bookings

## 🌐 Language Support

Click the globe icon (🌐) in the navbar to toggle between:
- **English** (EN)
- **Hindi** (हिं)

All UI text, service descriptions, and worker details are translated.

## 🎭 Lottie Animations

The app includes placeholder components for Lottie animations. To add actual animations:

1. **Install lottie-react**:
   ```bash
   npm install lottie-react
   ```

2. **Download Animations**:
   - Visit [LottieFiles.com](https://lottiefiles.com/)
   - Search for: builder, electrician, carpenter, plumber, painter
   - Download as JSON files

3. **Add to Project**:
   - Create `/public/animations/` folder
   - Place JSON files there

4. **Update Component**:
   - See instructions in `components/LottiePlayer.tsx`

## 🔧 Customization

### Adding New Service Categories

1. Update `types/index.ts`:
   ```typescript
   export type ServiceCategory = 'electrician' | 'builder' | 'your-new-category';
   ```

2. Add translations in `contexts/LanguageContext.tsx`

3. Add mock workers in `data/mockData.ts`

4. Add icon in `components/ServiceCategory.tsx`

### Changing Colors

Edit `tailwind.config.ts` to customize the color palette:
```typescript
colors: {
  primary: { /* your colors */ },
  secondary: { /* your colors */ },
}
```

## 🔐 Authentication

Currently uses **mock authentication** with localStorage. For production:

1. Replace mock login/signup in `contexts/AuthContext.tsx`
2. Integrate with your backend API
3. Add JWT token management
4. Implement secure session handling

## 💾 Data Management

Currently uses **mock data** from `data/mockData.ts`. For production:

1. Create backend API endpoints
2. Replace mock data fetching with API calls
3. Add loading states and error handling
4. Implement real-time updates

## 📸 Screenshots

> **Note**: Replace placeholder-worker.jpg in `/public/` with actual worker photos

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Icons by [Lucide React](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Styling by [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ for connecting communities with skilled workers**
