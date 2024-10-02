
# Real-Time Polling Application with Chat Feature

This project provides a real-time polling and chat application developed using **React** with **TypeScript** and powered by **Vite**. It features a voting system, a chat feature, and real-time updates through **WebSockets** using **Socket.IO**.

## Features
- **Real-time Polling System**: Users can vote on different poll options, and the results update instantly for all connected users.
- **Real-time Chat Feature**: Users can chat with one another in real-time while interacting with the poll.
- **Typing Indicator**: Shows a typing animation when someone is typing a message.
- **Basic User Authentication**: Identifies users by their names and associates them with their messages.
- **CSS Styling**: Clean and user-friendly interface designed with Poppins font and modern design principles.

## Technologies Used
- **Frontend**: React (with TypeScript) + Vite
- **Backend**: Node.js + Express
- **WebSockets**: Socket.IO for real-time communication
- **Styling**: CSS (with modern practices)
- **Package Management**: npm
- **Development Tools**: ESLint, Vite

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/polling-app.git
cd polling-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all the required dependencies, including React, Vite, and Socket.IO.

### 3. Development Server

To start the development server:

```bash
npm run dev
```

This command will run the app on a development server with **Hot Module Replacement (HMR)**, enabling you to see real-time changes in the application during development.

### 4. Build for Production

To create an optimized production build:

```bash
npm run build
```

## ESLint Configuration

For production applications, we use a type-aware ESLint configuration for React and TypeScript. Here’s a brief setup guide to expand on it.

### Expanding ESLint Configuration

To ensure code quality and consistency, we use **tseslint** in the project. Here's how to set it up with type checking enabled:

1. Install the required ESLint and React plugins:

```bash
npm install eslint-plugin-react @typescript-eslint/parser eslint-config-airbnb-typescript
```

2. Update the `eslint.config.js` file:

```js
import react from 'eslint-plugin-react'
import tseslint from '@typescript-eslint/eslint-plugin'

export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: {
    react,
  },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

### Linting Commands

You can run linting to check for code errors and style issues:

```bash
npm run lint
```

## File Structure

```
polling-app/
├── public/              # Static assets
├── src/
│   ├── components/      # React components (Navbar, Poll, Chat, etc.)
│   ├── pages/           # Pages of the app (Home, Poll, etc.)
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Entry point for React
│   └── styles/          # CSS styling
├── .env                 # Environment variables
├── .gitignore           # Files ignored by Git
├── package.json         # Project dependencies and scripts
├── vite.config.ts       # Vite configuration
└── README.md            # Project documentation
```

## Environment Variables

For configuring your backend and WebSocket URLs, you may create a `.env` file. Here's an example of what your `.env` might look like:

```
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

Make sure to add `.env` to your `.gitignore` to prevent sensitive information from being committed to your version control.

```plaintext
# Environment variables
.env
```

## Development Workflow

### Polling Feature

- Polls can be created with multiple options, and users can vote in real-time.
- The votes are broadcasted to all connected users via WebSockets using **Socket.IO**.
- Poll data is stored on the server side using a basic data structure and updated live.

### Chat Feature

- Users can send chat messages that are instantly received by everyone connected.
- The chat also includes a typing indicator to show when a user is typing a message.
- Messages are stored on the server temporarily and displayed in real-time.

## Running the Backend

To run the backend server for handling WebSocket connections and poll data management:

1. Navigate to the `server/` folder:

```bash
cd server
```

2. Install backend dependencies:

```bash
npm install
```

3. Start the backend server:

```bash
npm start
```

The backend runs on `http://localhost:4000` by default and communicates with the frontend via WebSocket connections.

## Contribution

Feel free to fork this repository and submit pull requests if you'd like to contribute.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
