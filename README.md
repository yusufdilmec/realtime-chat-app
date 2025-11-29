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
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/sql-server) or SQL Server Express

### Backend Setup

1. Navigate to the server API directory:
```bash
cd server/server.api
```

2. Update the connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ChatDB;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

3. Apply database migrations:
```bash
cd ../server.infrastructure
dotnet ef database update --startup-project ../server.api/server.api.csproj
```

4. Run the backend:
```bash
cd ../server.api
dotnet run
```

Backend will run on `http://localhost:5285`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Update API URLs in `src/lib/api.ts` and `src/store/useChatStore.ts` if needed (default: `http://localhost:5285`)

4. Run the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

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

Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [SignalR](https://dotnet.microsoft.com/apps/aspnet/signalr) for real-time functionality
- [Zustand](https://github.com/pmndrs/zustand) for state management

---

**Note**: This is a development project. For production use, implement additional security measures, error handling, and performance optimizations.
