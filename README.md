# Expense Manager

A comprehensive project expense management system built with Next.js, TypeScript, and Prisma. This application helps organizations manage project budgets, track indents (expense requests), and generate reports for effective financial oversight.

## 🌟 Features

### Project Management
- **Project Creation & Management**: Create and manage multiple projects with detailed budget allocations
- **Budget Allocation**: Track allocations across different categories:
  - Manpower
  - Consumables
  - Equipment
  - Travel
  - Contingency
  - Overhead
- **Project Status Tracking**: Monitor project status (Ongoing, Completed, Terminated)
- **Role-based Access**: Support for Principal Investigators (PIs) and Co-Principal Investigators (CoPIs)

### Indent (Expense Request) Management
- **Multi-type Indents**: Support for different types of expense requests
- **Approval Workflow**: Structured approval process for expense requests
- **Status Tracking**: Real-time status updates (Pending, Approved, Rejected, Completed)
- **Document Management**: Upload and manage bill copies and final bills
- **Detailed Records**: Comprehensive tracking of indent amounts, quantities, and reasons

### User Management
- **Employee Registration**: Create and manage employee accounts
- **Role-based Authentication**: Admin and user roles with appropriate permissions
- **Password Management**: Secure password handling with encryption
- **Profile Management**: Update user information and change passwords

### Reporting & Analytics
- **Financial Reports**: Generate various types of reports:
  - Category-wise reports
  - General reports
  - Quarterly reports
  - Yearly reports
- **Visual Analytics**: Interactive charts and graphs using Recharts
- **Data Export**: Export reports to Excel format
- **Dashboard Overview**: Comprehensive dashboard with project summaries and charts

### Security & Authentication
- **NextAuth.js Integration**: Secure authentication system
- **Password Encryption**: Encrypted password storage using CryptoJS
- **Protected Routes**: Route-level protection for authorized access
- **Session Management**: Secure session handling

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Modern React with latest features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **Framer Motion**: Animation library
- **Recharts**: Data visualization library

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Prisma ORM**: Database toolkit and ORM
- **PostgreSQL**: Primary database
- **NextAuth.js**: Authentication library

### Utilities & Tools
- **React Hook Form**: Form management with validation
- **Zod**: Schema validation
- **Lucide React**: Icon library
- **ExcelJS**: Excel file generation
- **File Saver**: File download functionality
- **Sonner**: Toast notifications

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm (recommended) or npm

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rudraksha007/ExpenseManager
   cd ExpenseManager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/expense_manager"
   DATABASE_DIRECT_URL="postgresql://username:password@localhost:5432/expense_manager"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ROOT_ID="root.mail@example.com"
   ROOT_PASS="password_for_root"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate --sql
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── protected/         # Protected application pages
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── ui/               # UI component library
│   ├── indents/          # Indent-specific components
│   ├── projects/         # Project-specific components
│   └── reports/          # Report components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and configurations
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Prisma schema
│   └── sql/              # Raw SQL queries
└── public/               # Static assets
```

## 🗄️ Database Schema

The application uses the following main entities:

- **Users**: Employee information and authentication
- **Projects**: Project details, budget allocations, and status
- **Indents**: Expense requests with approval workflow
- **Investors**: Funding organizations

Key relationships:
- Users can be PIs or CoPIs on multiple projects
- Projects have multiple indents
- Indents have approval workflow with actionable users

## 🔐 Authentication & Authorization

- **Login System**: Email and password-based authentication
- **Role-based Access**: Admin and regular user permissions
- **Protected Routes**: Automatic redirection for unauthorized access
- **Session Management**: Secure session handling with NextAuth.js

## 📊 Features Overview

### Dashboard
- Project overview with status indicators
- Financial summaries and charts
- Quick access to recent indents
- Visual analytics with pie charts

### Project Management
- Create new projects with budget allocations
- Assign PIs and CoPIs
- Track project progress and status
- Manage project timelines

### Indent Processing
- Create equipment and manpower indents
- Upload supporting documents
- Track approval status
- Generate final bills

### Reporting
- Generate comprehensive financial reports
- Export data to Excel format
- Category-wise expense analysis
- Time-based reporting (quarterly, yearly)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- None currently reported

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using Next.js and modern web technologies**
