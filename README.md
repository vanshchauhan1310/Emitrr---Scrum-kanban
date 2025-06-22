# 🚀 ScrumBoard - Agile Project Management Platform

A modern, intuitive Kanban board application built with Next.js, designed to streamline sprint management and project workflows for development teams.

![ScrumBoard Logo](public/logo2.png)

## ✨ Features

### 🔐 Authentication & Organization Management
- **Clerk Authentication**: Secure user authentication with Clerk
- **Organization Support**: Multi-tenant architecture with organization-based access control
- **Role-based Permissions**: Admin and member roles with different capabilities
- **User Management**: Seamless user onboarding and profile management

### 📋 Project Management
- **Project Creation**: Create projects with custom keys and descriptions
- **Project Organization**: Organize projects within organizations
- **Project Access Control**: Role-based access to project features

### 🏃 Sprint Management
- **Sprint Creation**: Create sprints with custom names and date ranges
- **Sprint Status Tracking**: 
  - **Planned**: Future sprints that haven't started
  - **Active**: Currently running sprints
  - **Completed**: Finished sprints
- **Sprint Lifecycle Management**: Start, manage, and complete sprints
- **Date Validation**: Automatic validation of sprint start/end dates

### 📊 Kanban Board
- **Drag & Drop Interface**: Intuitive drag-and-drop functionality using `@hello-pangea/dnd`
- **Customizable Columns**: Create, edit, and delete status columns (admin only)
- **Real-time Updates**: Instant updates when moving issues between columns
- **Order Management**: Maintain issue order within columns

### 🎯 Issue Management
- **Issue Creation**: Create issues with titles, descriptions, and priorities
- **Priority Levels**: 
  - 🔴 **URGENT**: Critical issues requiring immediate attention
  - 🟠 **HIGH**: Important issues with high priority
  - 🟡 **MEDIUM**: Standard priority issues
  - 🟢 **LOW**: Low prioriers
- **Reporter Tracking**: Track who created each issue
- **Status Tracking**: Move issues through different workflow stages

### 🎨 User Interface
- **Modern Design**: Clean, responsive design with Tailwind CSS
- **Dark Theme**: Beautiful dark theme optimized for development teams
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Loading States**: Smooth loading indicators and skeleton screens
- **Toast Notifications**: Real-time feedback for user actions

## 🔄 Application Flow

### 1. User Onboarding
1. User signs up/signs in via Clerk
2. User creates or joins an organization
3. User is redirected to the organization dashboard

### 2. Project Creation
1. Admin creates a new project with name, key, and description
2. Project is associated with the current organization
3. Default status columns are created for the organization

### 3. Sprint Management
1. Admin creates sprints with start/end dates
2. Sprints start in "PLANNED" status
3. Admin can start sprints when ready (changes to "ACTIVE")
4. Admin can complete sprints (changes to "COMPLETED")

### 4. Issue Workflow
1. Users create issues in specific sprints and status columns
2. Issues can be assigned to team members
3. Users drag and drop issues between columns to update status
4. Issue order is maintained within each column

### 5. Board Management
1. Admins can create custom status columns
2. Admins can edit column names and delete columns
3. All users can view and interact with the board
4. Drag and drop updates are saved automatically


## 🛠️ Tech Stack

### Frontendty issues
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icons
- **React Hook Form**: Form management with validation
- **Zod**: Schema validation

### Backend & Database
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Primary database
- **Next.js API Routes**: Server-side API endpoints

### Authentication & Authorization
- **Clerk**: Authentication and user management
- **Organization Management**: Multi-tenant support

### State Management & Data Fetching
- **SWR**: Data fetching and caching
- **React Hooks**: Local state management

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **bun** (recommended)
- **PostgreSQL** database
- **Clerk Account** for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd kanban-board
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using bun (recommended)
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/kanban_board"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Clerk URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # (Optional) Seed the database with initial data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   # Using npm
   npm run dev
   
   # Using bun
   bun dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

The application uses PostgreSQL with the following main entities:

- **Users**: Application users linked to Clerk authentication
- **Organizations**: Multi-tenant organizations
- **Projects**: Projects within organizations
- **Sprints**: Time-boxed development cycles
- **Issues**: Work items within sprints
- **Statuses**: Customizable workflow columns


## 📁 Project Structure

```
kanban-board/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (main)/                   # Main application routes
│   ├── api/                      # API routes
│   └── lib/                      # Utility libraries
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components
│   └── ...                       # Feature-specific components
├── actions/                      # Server actions
├── hooks/                        # Custom React hooks
├── lib/                          # Shared utilities
├── prisma/                       # Database schema and migrations
└── public/                       # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio for database management

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced reporting and analytics
- [ ] Integration with external tools (GitHub, GitLab, etc.)
- [ ] Mobile app development
- [ ] Advanced search and filtering
- [ ] Custom workflows and automation
- [ ] Time tracking and estimation
- [ ] Team velocity metrics

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
