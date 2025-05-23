# Estimate Poker Bolt

Estimate Poker Bolt is a web application for agile teams to effectively plan and estimate tasks using the planning poker technique. It allows team members to collaboratively estimate the effort required for tasks in a structured and efficient manner.

## Features

- **User Authentication**: Secure login using Supabase authentication
- **Project Management**: Create, view, and manage projects
- **Task Tracking**: Create and organize tasks within projects
- **Planning Poker**: Estimate tasks collaboratively with team members
- **Real-time Updates**: See estimation progress in real-time
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Backend & Authentication**: Supabase
- **State Management**: Zustand
- **Routing**: React Router
- **Icons**: Lucide React
- **Styling Utilities**: class-variance-authority, clsx, tailwind-merge

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- A Supabase account for setting up the backend

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kouphasi/estimate_poker_bolt.git
   cd estimate_poker_bolt/project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Database Setup

This application uses Supabase for the backend. You'll need to set up the following tables:

1. `projects` - For storing project information
2. `tasks` - For storing task information associated with projects
3. `estimations` - For storing individual estimations for tasks

Refer to the schema in the `supabase` directory for detailed table structures.

## Usage

1. **Login/Register**: Access the application and authenticate with your credentials
2. **Create a Project**: Click on "New Project" to create a new project with a name and description
3. **Add Tasks**: Navigate to a project and add tasks that need to be estimated
4. **Estimate Tasks**: Select a task to start the estimation process
5. **View Results**: See the final estimation results and track progress

## Project Structure

```
project/
├── src/                  # Source files
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Layout components
│   ├── lib/              # Libraries and utilities
│   ├── pages/            # Page components
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── .env                  # Environment variables (create this)
├── index.html            # HTML entry point
├── package.json          # Project dependencies
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.ts        # Vite configuration
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License.