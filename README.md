# Custom Event Calendar 

I built a full-stack calendar app where you can easily add, edit, and manage your events. It has Google login and a drag-and-drop feature so you can move events around easily.

Demo url:- https://custom-event-calendar-eight.vercel.app/

##  Features

  * **Custom Google Authentication**: Secure sign-in/sign-up flow implemented from scratch using Google's OAuth 2.0 APIs.
  * **Event Management**: Users can **create**, **update**, and **delete** events.
  * **Recurring Events**: Set events to repeat **daily**, **weekly**, **weekdays**, or **monthly**.
  * **Native Drag & Drop**: Seamlessly reschedule events by simply dragging and dropping them to a new date.
  * **Interactive UI**: A clean and responsive user interface built with React and Tailwind CSS.
  * **Upcoming Events**: A dedicated section to quickly view all your upcoming appointments.

-----
##  Challenges & Solutions

During development, a few key challenges were encountered:

1.  **Google Calendar API Integration**: The initial goal was to integrate Google Calendar directly. However, this requires a formal verification process by Google for the application, which is still pending. This feature is now a primary **future goal**.

2.  **Deployment & Session Cookies**: When deploying the application, user sessions were not persisting. The issue was traced back to the server not trusting the proxy used by the hosting service. This was resolved by adding the following line to the Express app configuration, which is crucial when running behind a reverse proxy like those used by Heroku or Render:

    ```javascript
    app.set("trust proxy", 1);
    ```

-----

##  Screenshots


### Calendar with Recurring Events

Recurring events are displayed clearly on the calendar and in the upcoming events list.
<img width="1917" height="932" alt="image" src="https://github.com/user-attachments/assets/b02e2c12-1194-4d7d-92ea-4ad2848dfd23" />

### Adding a Recurring Event

Easily create detailed events and set recurrence rules, such as "Daily".
<img width="1916" height="910" alt="image" src="https://github.com/user-attachments/assets/259b31b0-6009-4a9e-814d-2d5f7ee29a37" />




-----



##  Tech Stack

This project is built with a modern and powerful stack, emphasizing custom implementations over external libraries where practical.

### Frontend

| Technology               | Description                                                                    |
| :----------------------- | :----------------------------------------------------------------------------- |
| **React** | A JavaScript library for building user interfaces.                             |
| **Tailwind CSS** | A utility-first CSS framework for rapid UI development.                        |
| **Zustand** | A small, fast, and scalable state-management solution.                         |
| **date-fns** | A modern JavaScript date utility library for formatting and managing dates.      |
| **Native Drag & Drop API** | Used the browser's built-in APIs to create the draggable event functionality.  |
| **rrule.js** | Handles the logic for recurring events as defined in iCalendar (RFC 5545).       |

### Backend

| Technology         | Description                                                                              |
| :----------------- | :--------------------------------------------------------------------------------------- |
| **Node.js** | A JavaScript runtime environment.                                                        |
| **Express.js** | A fast, unopinionated, minimalist web framework for Node.js.                             |
| **TypeScript** | A strongly typed programming language that builds on JavaScript.                         |
| **MongoDB** | A NoSQL database for storing user and event data.                                        |
| **Mongoose** | An Object Data Modeling (ODM) library for MongoDB and Node.js.                           |
| **Zod** | A TypeScript-first schema declaration and validation library.                            |
| **Google OAuth 2.0** | Authentication was implemented manually using Google's APIs without helper libraries like Passport.js. |

-----

##  Project Structure

The project is organized into a standard `frontend` (client) and `backend` (server) structure.

### Client (`/frontend`)

The frontend uses a component-based architecture with Zustand for state management.

### Server (`/backend`)

The backend follows a standard MVC-like pattern with routes, models, and configuration clearly separated.

-----




##  Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js installed on your machine
  * A MongoDB Atlas cluster or a local MongoDB instance
  * Google OAuth credentials from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/AyushSGithub24/Custom-Event-Calendar.git
    cd Custom-Event-Calendar
    ```

2.  **Install backend dependencies:**

    ```sh
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```sh
    cd ../frontend
    npm install
    ```

4.  **Set up Backend Environment Variables:**
    In the `backend` directory, create a `.env` file and add the following variables. **Note:** Ensure there are no spaces around the `=` sign.

    ```env
    # Google OAuth Credentials
    NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID="your_google_client_id"
    NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET="your_google_client_secret"
    NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI="http://localhost:3000/auth/google/callback" # Your backend callback URL

    # Server Configuration
    PORT=3000
    frontend_url="http://localhost:5173" # The URL where your React frontend runs

    # Database
    MONGO_URI="your_mongodb_connection_string"

    # Session Management
    SESSION_SECRET="a_very_strong_and_random_secret_key"
    ```

5.  **Run the application:**

      * To start the backend server, run the following from the `backend` directory:
        ```sh
        npm run dev
        ```
      * To start the frontend development server, run the following from the `frontend` directory:
        ```sh
        npm run dev
        ```

Your application's frontend should now be running on the port specified by your Vite/React setup (e.g., `http://localhost:5173`), and the backend will be running on `http://localhost:3000`.

-----


