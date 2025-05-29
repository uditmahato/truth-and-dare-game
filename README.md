
# Spin the Wheel - Truth & Dare Edition

Welcome to "Spin the Wheel - Truth & Dare Edition"! This interactive web application brings the classic party game to your screen, enhanced with AI-powered question generation for endless fun. Players enter their names, select question categories, and spin a virtual wheel to determine who's next. The chosen player then picks "Truth" or "Dare," receiving a question or task based on the selected categories.

## Features

*   **Dynamic Player Setup:** Enter the number of players (2-10) and their names.
*   **Category Selection:** Choose from a variety of question categories (Intense, Romantic, Career, Deception, Fun, Wild).
*   **AI-Generated Questions:** Includes a "Custom (AI Generated)" category that uses the Google Gemini API to create unique truths and dares on the fly.
*   **Visual Spinning Wheel:** An animated wheel that spins and randomly lands on a player.
*   **Fairness Logic:**
    *   Prevents the same player from being selected in immediate subsequent turns (if other players are available).
    *   Guarantees a turn for a player if they haven't been selected for 10 consecutive rounds.
*   **Truth or Dare Prompt:** Clear prompts for the selected player to choose between truth or dare.
*   **Question Display:** Shows the randomly selected or AI-generated question/dare.
*   **Responsive Design:** Works on desktop and mobile browsers.
*   **Reset Functionality:** Easily reset the game to start over.
*   **Home Page:** A welcoming screen to start the game.
*   **Footer:** Developer attribution and copyright.

## Technology Stack

*   **Frontend:** React, TypeScript
*   **Styling:** Tailwind CSS
*   **AI Integration:** Google Gemini API (`@google/genai`) for "Custom" question generation.
*   **Build/Module System:** Relies on modern browser ES module support and an `importmap` for dependencies (typical in environments like Google Codelab Tools).

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js and npm (or yarn):** Required for installing dependencies and running a local development server. You can download Node.js from [nodejs.org](https://nodejs.org/).
*   **A modern web browser:** Chrome, Firefox, Edge, Safari, etc.
*   **Google Gemini API Key:** To enable AI-generated questions for the "Custom" category. You can obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Environment Setup

### 1. Gemini API Key

The application expects the Google Gemini API Key to be available as an environment variable named `API_KEY`.

**For Local Development:**

The most common way to manage environment variables locally is using a `.env` file.

1.  Create a file named `.env` in the root directory of the project.
2.  Add your Gemini API key to this file:

    ```env
    # .env
    API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

    Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key.

**Important:**
*   Ensure the `.env` file is listed in your `.gitignore` file to prevent accidentally committing your API key.
*   The `geminiService.ts` file attempts to read `process.env.API_KEY`. For this to work in a local browser environment outside of a Node.js backend or a build process that specifically injects environment variables (like Vite or Create React App), you might need additional setup depending on your development server.
*   **If you are running this project within an environment like Google Codelab Tools, the platform usually provides a mechanism to set environment variables.** Please refer to the specific instructions for that environment. If no such mechanism is provided and you're serving `index.html` directly, the `process.env.API_KEY` will likely be undefined in the browser. In such a barebones setup, you would typically need a build step or a backend proxy to handle the API key securely.

## Getting Started / Running Locally

1.  **Clone the Repository (if applicable):**
    If this project is part of a Git repository, clone it to your local machine.
    ```bash
    # Example:
    # git clone https://your-repository-url.git
    # cd spin-the-wheel-truth-dare
    ```

2.  **Install Dependencies:**
    This project uses an `importmap` in `index.html` to load dependencies like React and `@google/genai` directly from a CDN (esm.sh). Therefore, a traditional `npm install` for these frontend libraries might not be strictly necessary for the browser to run the code as-is.

    However, if you intend to use linters, TypeScript compilers locally, or other development tools, you might want to initialize a `package.json` and install dev dependencies:
    ```bash
    npm init -y
    npm install typescript --save-dev
    # Add other linters/formatters like ESLint, Prettier if desired
    ```

3.  **Set up the Environment Variable:**
    Ensure you have set your `API_KEY` as described in the "Environment Setup" section.

4.  **Run the Application:**
    Since this project is structured with a simple `index.html` and ES modules, you can run it using a local HTTP server.

    *   **Using `npx serve` (requires Node.js):**
        Navigate to the project's root directory in your terminal and run:
        ```bash
        npx serve
        ```
        This will start a local server, usually at `http://localhost:3000` or a similar address. Open this address in your browser.

    *   **Using Python's HTTP Server (if Python is installed):**
        Navigate to the project's root directory in your terminal.
        For Python 3:
        ```bash
        python -m http.server
        ```
        For Python 2:
        ```bash
        python -m SimpleHTTPServer
        ```
        This will typically start a server at `http://localhost:8000`.

    *   **Using VS Code Live Server Extension:**
        If you are using Visual Studio Code, you can install the "Live Server" extension. Right-click on the `index.html` file and select "Open with Live Server".

    *   **Within Google Codelab Tools:**
        If you are using this project inside Google Codelab Tools or a similar online IDE, the environment usually provides a "Run" or "Preview" button that handles serving the application.

## Project Structure

```
.
├── README.md               # This file
├── index.html              # Main HTML entry point
├── index.tsx               # Main React application entry point (root component setup)
├── App.tsx                 # Core application component, manages state and game flow
├── components/             # Directory for React components
│   ├── PlayerSetup.tsx     # Component for setting up player names
│   ├── CategorySelection.tsx # Component for selecting question categories
│   ├── WheelDisplay.tsx    # Component for the spinning wheel
│   ├── TruthDarePrompt.tsx # Component to prompt for Truth or Dare
│   ├── QuestionDisplay.tsx # Component to display the question/dare
│   ├── HomePage.tsx        # Component for the welcome screen
│   └── Spinner.tsx         # Loading spinner component
├── services/               # Directory for service modules
│   ├── geminiService.ts    # Service for interacting with the Gemini API
│   └── questionService.ts  # Service for managing and retrieving questions
├── types.ts                # TypeScript type definitions and enums
├── constants.ts            # Global constants (predefined questions, categories, game rules)
└── metadata.json           # Metadata for the application (e.g., permissions)
```

## Key Components

*   **`App.tsx`:** The main orchestrator of the game. It manages game state (current phase, players, selected categories, current player, current question), and handles transitions between different parts of the game.
*   **`HomePage.tsx`:** The initial screen that welcomes users and allows them to start a new game.
*   **`PlayerSetup.tsx`:** Allows users to input the number of players and their names.
*   **`CategorySelection.tsx`:** Enables users to pick the categories of questions they want.
*   **`WheelDisplay.tsx`:** Renders the visual spinning wheel, animates the spin, and highlights the selected player. Incorporates fairness logic by accepting a `targetPlayer`.
*   **`TruthDarePrompt.tsx`:** Appears after a player is selected, prompting them to choose "Truth" or "Dare".
*   **`QuestionDisplay.tsx`:** Shows the chosen truth or dare to the player.

## Services

*   **`geminiService.ts`:** Contains the logic for making calls to the Google Gemini API (`gemini-2.5-flash-preview-04-17` model) to generate "Custom" truth or dare questions.
*   **`questionService.ts`:** Manages the pool of predefined questions and integrates with `geminiService.ts`. It handles fetching appropriate questions based on type and category, and tracks asked questions to avoid repetition.

## Customization

*   **Add More Predefined Questions:** You can easily expand the game by adding more `QuestionItem` objects to the `PREDEFINED_QUESTIONS` array in `constants.ts`.
*   **Adjust Game Rules:** Modify constants like `MIN_PLAYERS`, `MAX_PLAYERS`, or `MAX_CONSECUTIVE_MISSES_GUARANTEED_TURN` in `constants.ts`.
*   **Change Styling:** Update Tailwind CSS classes in the components or modify the global styles in `index.html`.

---

Developed by Udit | © 2025 Copyrights to Udit
