# Claude AI Clone - Full-Stack Next.js Application

A powerful, feature-rich clone of Claude.ai built with modern web technologies. This application provides a complete chat interface with authentication, conversation management, and a modular architecture.

## Features

- **Authentication System**: Secure user registration and login with JWT sessions
- **Real-time Chat Interface**: Interactive messaging with conversation history
- **Conversation Management**: Create, view, and manage multiple conversations
- **Modern UI**: Beautiful, responsive interface with dark/light theme support
- **Type-Safe**: Full TypeScript implementation with strict mode
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Modular Architecture**: Clean, maintainable codebase with feature modules

## Tech Stack

### Frontend
- **Next.js 15+** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Icon library
- **TanStack Query v5** - Data fetching and caching
- **Zustand** - Lightweight state management
- **React Hook Form + Zod** - Form validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Relational database (Neon serverless)
- **Drizzle ORM** - Type-safe database toolkit
- **Jose** - JWT authentication
- **bcryptjs** - Password hashing

### Development Tools
- **Biome.js** - Fast linter and formatter
- **pnpm** - Efficient package manager

## Project Structure

```
claude-ai-clone/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (main)/                   # Main application
│   │   │   └── chat/
│   │   │       └── [conversationId]/
│   │   └── api/                      # API routes
│   │       ├── auth/
│   │       ├── conversations/
│   │       └── messages/
│   │
│   ├── modules/                      # Feature modules
│   │   ├── auth/                     # Authentication module
│   │   ├── chat/                     # Chat module
│   │   ├── artifacts/                # Artifacts module
│   │   └── shared/                   # Shared utilities
│   │
│   ├── components/                   # Shared UI components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── layouts/                  # Layout components
│   │   ├── common/                   # Common components
│   │   └── providers/                # React providers
│   │
│   ├── lib/                          # Core libraries
│   │   ├── db/                       # Database configuration
│   │   ├── api/                      # API client setup
│   │   ├── auth/                     # Authentication utilities
│   │   └── utils/                    # Helper functions
│   │
│   └── styles/                       # Global styles
│
├── drizzle/                          # Database migrations
├── public/                           # Static assets
└── Configuration files
```

## Getting Started

### Prerequisites

- Node.js 20+ installed
- pnpm installed (`npm install -g pnpm`)
- PostgreSQL database (we recommend [Neon](https://neon.tech) for serverless PostgreSQL)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd claude-ai-clone
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

   # Authentication
   JWT_SECRET="your-secure-random-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"

   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**

   Generate and run database migrations:
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

### Using Neon (Recommended)

1. Sign up for a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to your `.env.local` file as `DATABASE_URL`

### Using Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE claude_clone;
   ```
3. Update `DATABASE_URL` in `.env.local` with your local credentials

### Database Schema

The application uses the following main tables:

- **users** - User accounts
- **conversations** - Chat conversations
- **messages** - Individual messages
- **artifacts** - Code/content artifacts (for future implementation)

## Available Scripts

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Check code with Biome
pnpm format           # Format code with Biome

# Database
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema changes (dev only)
pnpm db:studio        # Open Drizzle Studio (database GUI)
```

## Module Structure

Each feature module follows this structure:

```
module/
├── ui/                    # UI components
│   ├── components/        # React components
│   ├── forms/            # Form components
│   ├── layouts/          # Layout components
│   └── views/            # Page views
├── api/                  # API functions
├── hooks/                # React hooks
├── stores/               # Zustand stores
├── types/                # TypeScript types
├── schemas/              # Zod validation schemas
└── utils/                # Utility functions
```

## Key Features Implementation

### Authentication

- JWT-based session management
- Secure password hashing with bcryptjs
- Protected routes with middleware
- Login and registration forms with validation

### Chat System

- Real-time message display
- Conversation creation and management
- Message history with infinite scroll
- Responsive chat interface

### State Management

- TanStack Query for server state (conversations, messages)
- Zustand for client state (UI state, current conversation)
- Optimistic updates for better UX

### Styling

- Tailwind CSS for utility-first styling
- CSS variables for theming
- Dark/light mode support
- Responsive design for all screen sizes

## Development Workflow

### Adding a New Feature

1. Create a new module in `src/modules/`
2. Follow the module structure pattern
3. Define Zod schemas for validation
4. Create API functions and hooks
5. Build UI components
6. Add API routes if needed
7. Update navigation/routing

### Database Changes

1. Modify schema in `src/lib/db/schema.ts`
2. Generate migration: `pnpm db:generate`
3. Review the generated SQL
4. Apply migration: `pnpm db:migrate`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

Ensure these are set in your production environment:

- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A secure random string (use a strong generator)
- `NEXTAUTH_URL` - Your production domain
- `NEXT_PUBLIC_APP_URL` - Your production domain

## Performance Optimizations

- Server-side rendering for initial page load
- Automatic code splitting with Next.js
- Image optimization with next/image
- Database query optimization with indexes
- Client-side caching with TanStack Query

## Security Features

- Password hashing with bcrypt
- JWT authentication with secure cookies
- CSRF protection
- SQL injection prevention with Drizzle ORM
- XSS protection with React
- Secure session management

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to the database:

1. Check your `DATABASE_URL` is correct
2. Ensure your database is accessible
3. Verify SSL settings (use `?sslmode=require` for Neon)
4. Check firewall rules

### Build Errors

If you encounter build errors:

1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && pnpm install`
3. Check TypeScript errors: `pnpm tsc --noEmit`

### Session Issues

If authentication isn't working:

1. Verify `JWT_SECRET` is set
2. Clear browser cookies
3. Check that cookies are being set (DevTools → Application → Cookies)

## Future Enhancements

- [ ] Artifact system (code execution, React components, diagrams)
- [ ] File upload support
- [ ] Message editing and regeneration
- [ ] Conversation search
- [ ] Export conversations
- [ ] Real-time collaboration
- [ ] Voice input
- [ ] Mobile app
- [ ] AI integration (OpenAI, Anthropic)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review the code examples

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Database toolkit [Drizzle ORM](https://orm.drizzle.team)
- Icons from [Lucide](https://lucide.dev)

---

**Happy Coding!** 🚀

Built with ❤️ using modern web technologies.
