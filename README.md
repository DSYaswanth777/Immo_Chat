# Immochat - Real Estate Platform

A comprehensive real estate platform built with Next.js, featuring user management, property management, Google Maps integration, and role-based access control.

## Features

- 🏠 **Property Management**: Complete CRUD operations for properties
- 👥 **User Management**: Admin and Customer roles with different permissions
- 🗺️ **Google Maps Integration**: Interactive map with property markers
- 🔐 **Authentication**: NextAuth.js with Google OAuth and credentials
- 📱 **Responsive Design**: Mobile-friendly interface
- 🎯 **Role-Based Access**: Different features for Admin and Customer users
- 💾 **Database**: MySQL with Prisma ORM
- 🔍 **Search & Filters**: Advanced property search and filtering

## Tech Stack

- **Frontend**: Next.js 15.2.4, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js v4.24.11
- **Database**: MySQL with Prisma ORM
- **Maps**: Google Maps API
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- Google OAuth credentials
- Google Maps API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd immochat
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/immochat"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Maps API
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
immochat/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth configuration
│   │   ├── users/                # User management APIs
│   │   ├── properties/           # Property management APIs
│   │   └── inquiries/            # Inquiry management APIs
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Dashboard pages
│   │   ├── map/                  # Google Maps view
│   │   └── properties/           # Property management
│   └── layout.tsx                # Root layout
├── components/                   # Reusable components
│   ├── dashboard/                # Dashboard-specific components
│   ├── auth/                     # Authentication components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility libraries
│   ├── prisma.ts                 # Prisma client
│   ├── auth-config.ts            # NextAuth configuration
│   └── utils.ts                  # Utility functions
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema
└── middleware.ts                 # Route protection middleware
```

## Database Schema

The application uses the following main models:

- **User**: User accounts with roles (ADMIN/CUSTOMER)
- **Property**: Real estate properties with detailed information
- **Favorite**: User's favorite properties
- **Inquiry**: Property inquiries from potential buyers/renters
- **Account/Session**: NextAuth.js authentication tables

## API Endpoints

### Authentication

- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Users

- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user (Admin only)

### Properties

- `GET /api/properties` - Get all properties (with filters)
- `POST /api/properties` - Create property
- `GET /api/properties/[id]` - Get property by ID
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property
- `POST /api/properties/[id]/favorite` - Add to favorites
- `DELETE /api/properties/[id]/favorite` - Remove from favorites

### Inquiries

- `GET /api/inquiries` - Get inquiries
- `POST /api/inquiries` - Create inquiry

## User Roles

### Admin

- Full access to all features
- User management
- View all properties and inquiries
- Analytics dashboard
- System administration

### Customer

- Manage own properties
- View property map
- Save favorites
- Send inquiries
- Basic dashboard

## Demo Credentials

For testing purposes, you can use these demo credentials:

**Admin User:**

- Email: `admin@immochat.com`
- Password: `admin123`

**Customer User:**

- Email: `customer@immochat.com`
- Password: `customer123`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

## Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create an API key
4. Restrict the API key to your domain
5. Add the API key to your environment variables

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@immochat.com or create an issue in the repository.
