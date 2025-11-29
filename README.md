# Real-Time Chat Application

A full-stack real-time chat application built with .NET 9, React, TypeScript, and SignalR.

## 🚀 Features

- **Real-time messaging** with SignalR WebSockets
- **User authentication** with JWT Bearer tokens
- **User search** and conversation management
- **Message history** with pagination
- **Unread message counters** and badges
- **Desktop notifications** for new messages
- **Responsive UI** with Tailwind CSS and shadcn/ui
- **Dark/Light mode** support
- **Online/Offline status** indicators

## 🛠️ Tech Stack

### Backend
- **.NET 9** - Web API
- **ASP.NET Core Identity** - Authentication & Authorization
- **Entity Framework Core** - ORM
- **SQL Server** - Database
- **SignalR** - Real-time communication
- **JWT Bearer** - Token-based authentication
- **Swagger** - API documentation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **Axios** - HTTP client
- **SignalR Client** - WebSocket client
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## 📁 Project Structure

```
chatProject/
├── server/                          # Backend (.NET)
│   ├── server.api/                  # Web API project
│   │   ├── Controllers/             # API endpoints
│   │   │   ├── AuthController.cs    # Authentication
│   │   │   ├── UserController.cs    # User management
│   │   │   └── MessageController.cs # Message operations
│   │   ├── Hubs/                    # SignalR hubs
│   │   │   └── ChatHub.cs           # Real-time chat hub
│   │   ├── DTOs/                    # Data transfer objects
│   │   ├── Services/                # Business logic
│   │   └── Program.cs               # App configuration
│   ├── server.domain/               # Domain entities
│   │   └── Entities/
│   │       ├── User.cs
│   │       └── Message.cs
│   └── server.infrastructure/       # Data access
│       ├── Data/
│       │   └── ApplicationDbContext.cs
│       └── Migrations/              # EF Core migrations
├── client/                          # Frontend (React)
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── features/
│   │   │   ├── auth/                # Authentication
│   │   │   └── chat/                # Chat features
│   │   │       ├── components/      # Chat UI components
│   │   │       ├── layout/          # Layout components
│   │   │       └── services/        # API services
│   │   ├── store/                   # Zustand stores
│   │   │   ├── useAuthStore.ts
│   │   │   └── useChatStore.ts
│   │   ├── lib/                     # Utilities
│   │   └── types/                   # TypeScript types
│   └── package.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites

#### Required Software
- **[.NET 9 SDK](https://dotnet.microsoft.com/download)** - Backend framework
- **[Node.js 18+](https://nodejs.org/)** - JavaScript runtime (includes npm)
- **[SQL Server](https://www.microsoft.com/sql-server)** or **SQL Server Express** - Database
- **Git** - Version control (optional but recommended)

#### Backend Dependencies (Auto-installed)
The following packages will be automatically restored when you run `dotnet restore` or `dotnet build`:
- `Microsoft.AspNetCore.Identity.EntityFrameworkCore` (v9.0.0)
- `Microsoft.EntityFrameworkCore.SqlServer` (v9.0.0)
- `Microsoft.EntityFrameworkCore.Tools` (v9.0.0)
- `Microsoft.AspNetCore.Authentication.JwtBearer` (v9.0.0)
- `Swashbuckle.AspNetCore` (v6.5.0)
- `System.IdentityModel.Tokens.Jwt` (v8.2.1)

#### Frontend Dependencies (Auto-installed)
The following packages will be installed via `npm install`:

**Core Libraries:**
- `react` (^18.3.1) - UI library
- `react-dom` (^18.3.1) - React DOM rendering
- `react-router-dom` (^7.1.1) - Routing

**State Management & Data Fetching:**
- `zustand` (^5.0.2) - State management
- `axios` (^1.7.9) - HTTP client
- `@microsoft/signalr` (^8.0.7) - Real-time communication

**UI & Styling:**
- `tailwindcss` (^3.4.17) - Utility-first CSS
- `@radix-ui/*` - Unstyled UI components:
  - `@radix-ui/react-avatar` (^1.1.2)
  - `@radix-ui/react-dropdown-menu` (^2.1.4)
  - `@radix-ui/react-label` (^2.1.1)
  - `@radix-ui/react-scroll-area` (^1.2.2)
  - `@radix-ui/react-separator` (^1.1.1)
  - `@radix-ui/react-slot` (^1.1.1)
  - `@radix-ui/react-switch` (^1.1.2)
  - `@radix-ui/react-tooltip` (^1.1.6)
- `lucide-react` (^0.468.0) - Icon library
- `class-variance-authority` (^0.7.1) - CSS variant management
- `clsx` (^2.1.1) - Conditional className utility
- `tailwind-merge` (^2.6.0) - Tailwind class merging

**Form & Validation:**
- `react-hook-form` (^7.54.2) - Form management
- `zod` (^3.24.1) - Schema validation
- `@hookform/resolvers` (^3.9.1) - Form resolvers

**Development Tools:**
- `vite` (^6.0.5) - Build tool
- `typescript` (^5.6.2) - Type safety
- `@vitejs/plugin-react` (^4.3.4) - React plugin for Vite
- `eslint` (^9.17.0) - Code linting
- `postcss` (^8.4.49) - CSS processing
- `autoprefixer` (^10.4.20) - CSS vendor prefixes

### Backend Setup

1. **Clone the repository** (if you haven't already):
```bash
git clone https://github.com/yusufdilmec/realtime-chat-app.git
cd realtime-chat-app
```

2. **Navigate to the server API directory**:
```bash
cd server/server.api
```

3. **Restore .NET dependencies** (optional, as build will do this):
```bash
dotnet restore
```

4. **Update the connection string** in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ChatDB;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

5. **Apply database migrations**:
```bash
cd ../server.infrastructure
dotnet ef database update --startup-project ../server.api/server.api.csproj
```

> **Note**: If `dotnet ef` command is not found, install EF Core tools:
> ```bash
> dotnet tool install --global dotnet-ef
> ```

6. **Run the backend**:
```bash
cd ../server.api
dotnet run
```

Backend will run on `http://localhost:5285`

### Frontend Setup

1. **Navigate to the client directory**:
```bash
cd client
```

2. **Install all npm dependencies** (this will install all packages listed above):
```bash
npm install
```

> **Note**: This command will install:
> - React and React DOM
> - SignalR client for real-time messaging
> - Zustand for state management
> - Axios for API calls
> - Tailwind CSS and shadcn/ui components
> - Lucide React for icons
> - All other dependencies automatically

3. **Verify shadcn/ui components** (optional):
The project already includes shadcn/ui components in `src/components/ui/`. If you need to add more:
```bash
npx shadcn@latest add button
npx shadcn@latest add avatar
# etc.
```

4. **Update API URLs** in `src/lib/api.ts` and `src/store/useChatStore.ts` if needed (default: `http://localhost:5285`)

5. **Run the development server**:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🎯 Quick Start

After completing the setup:

1. **Start the backend**: 
   ```bash
   cd server/server.api && dotnet run
   ```

2. **Start the frontend** (in a new terminal):
   ```bash
   cd client && npm run dev
   ```

3. **Open your browser**: Navigate to `http://localhost:5173`

4. **Register a new user**: Click "Sign Up" and create an account

5. **Start chatting**: Search for users and send messages!

## 📝 API Endpoints

### Authentication
- `POST /api/Auth/register` - Register new user
- `POST /api/Auth/login` - Login user

### Users
- `GET /api/User/search?query={query}` - Search users
- `GET /api/User/all` - Get all users
- `GET /api/User/{id}` - Get user by ID
- `GET /api/User/me` - Get current user

### Messages
- `GET /api/Message/with/{userId}` - Get message history
- `GET /api/Message/conversations` - Get all conversations
- `PUT /api/Message/{messageId}/read` - Mark message as read
- `GET /api/Message/unread-counts` - Get unread message counts

### SignalR Hub
- **Endpoint**: `/chathub`
- **Methods**:
  - `SendMessage(CreateMessageDto)` - Send a message
- **Events**:
  - `ReceiveMessage(MessageDto)` - Receive incoming message
  - `MessageSent(MessageDto)` - Confirmation of sent message

## 🔐 Authentication

The application uses JWT Bearer token authentication:

1. Register or login to receive a JWT token
2. Token is stored in localStorage on the client
3. Token is automatically attached to all API requests
4. SignalR connection uses the same token for authentication

## 🎨 UI Components

Built with **shadcn/ui** components:
- Avatar
- Button
- Input
- Dropdown Menu
- Sidebar
- Scroll Area
- Skeleton loaders
- Theme toggle (Dark/Light mode)

## 📱 Features in Detail

### Real-time Messaging
- Instant message delivery using SignalR
- Automatic scroll to latest message
- Message status indicators (sent/read)
- Duplicate message prevention

### User Management
- User search with debouncing
- Online/offline status
- User avatars
- Profile management

### Notifications
- Browser desktop notifications
- Unread message badges
- Visual and audio alerts

### Message History
- Paginated message loading
- Persistent chat history
- Chronological message ordering

## 🚀 Deployment

### Backend Deployment
```bash
cd server/server.api
dotnet publish -c Release -o ./publish
```

### Frontend Deployment
```bash
cd client
npm run build
```

The built files will be in `client/dist/`

## 🔄 Database Migrations

Create a new migration:
```bash
cd server/server.infrastructure
dotnet ef migrations add MigrationName --startup-project ../server.api/server.api.csproj
```

Apply migrations:
```bash
dotnet ef database update --startup-project ../server.api/server.api.csproj
```

## 🐛 Troubleshooting

### CORS Issues
Make sure backend CORS is configured for your frontend URL in `Program.cs`

### SignalR Connection Failed
- Check if backend is running on correct port
- Verify JWT token is valid
- Check browser console for errors

### Database Connection Issues
- Verify SQL Server is running
- Check connection string in `appsettings.json`
- Ensure migrations are applied

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

Your Name - [@yusufdilmec](https://github.com/yusufdilmec)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [SignalR](https://dotnet.microsoft.com/apps/aspnet/signalr) for real-time functionality
- [Zustand](https://github.com/pmndrs/zustand) for state management

---

**Note**: This is a development project. For production use, implement additional security measures, error handling, and performance optimizations.
