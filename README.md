# Nike Trial Assessment

A Next.js-based interactive running shoe assessment application that helps users find their ideal Nike running shoe through a personalized questionnaire and real-time analytics.

## 🏃‍♂️ Project Overview

This application is designed to provide users with a personalized running shoe recommendation based on their preferences and running style. The app features an interactive questionnaire that analyzes user responses to determine the best match among three Nike shoe categories: Structure, Pegasus, and Vomero.

### Key Features

- **Hardware Controller Integration**: Complete WebSocket-based control system for physical controller with back button, next button, and 3-position knob
- **Interactive Questionnaire**: 5-question assessment covering running preferences, motivation, stride feel, music choice, and running mantra
- **Real-time Analytics**: Live progress tracking and visual charts showing shoe preference percentages
- **Keyboard Testing Support**: Development-friendly keyboard controls (Arrow keys, 1-2-3 keys) for testing without hardware
- **Animated UI**: Smooth transitions and engaging visual effects using Framer Motion
- **PDF Generation**: Ability to generate and print assessment results
- **Responsive Design**: Optimized for various screen sizes and orientations

## 🛠️ Technology Stack

- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts**: Custom D3-based components
- **WebSocket**: ws library for real-time communication
- **PDF Generation**: jsPDF and html2canvas
- **Icons**: React Icons
- **Font**: Custom Helvetica Now Display

## 📁 Project Structure

```
Nike-fa25/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── fonts/             # Custom font files
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── assets/                # Static assets
│   └── images/            # Logo and brand assets
├── components/            # React components
│   ├── atoms/            # Basic UI components
│   ├── molecules/        # Composite components
│   └── organisms/        # Complex page sections
├── providers/            # Context providers
├── public/              # Public assets
│   └── assets/          # Videos and media files
├── utils/               # Utility functions and types
└── server.js           # Custom server with WebSocket
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Nike-fa25
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with WebSocket support
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🎯 How It Works

### 1. Landing Page

- Displays Nike branding with video background
- "START" button begins the assessment
- "INSTRUCTIONS" button shows usage guidelines

### 2. Questionnaire Flow

The app presents 5 questions covering:

- **Question 1**: Ideal running companion (Coach/Friend/Music)
- **Question 2**: Motivation to run (Goals/High/Escape)
- **Question 3**: Desired stride feel (Gears/Electric/Plush)
- **Question 4**: Music preference (Rhythmic/Fast/Chill)
- **Question 5**: Running mantra (Strong/Fast/Float)

### 3. Real-time Analytics

- Progress bar shows completion percentage
- Live charts display shoe preference percentages
- Visual feedback for each selection

### 4. Results & Recommendations

- Animated text reveals the recommended shoe
- Detailed breakdown of preferences
- Option to print results as PDF

## 🎨 Shoe Categories

### Structure

- **Focus**: Stability and support
- **Best for**: Runners seeking consistent performance
- **Characteristics**: Strong, steady, secure

### Pegasus

- **Focus**: Energy and responsiveness
- **Best for**: Runners chasing performance highs
- **Characteristics**: Fast feet, free mind

### Vomero

- **Focus**: Comfort and cushioning
- **Best for**: Runners seeking effortless experience
- **Characteristics**: Float through the miles

## 🔌 WebSocket-Based Control System

The entire frontend experience is controlled via WebSocket events, designed for a physical special controller with three main inputs:

### Hardware Controller Components

- **Back Button**: Navigate to previous question/screen
- **Next Button**: Proceed to next question/screen or confirm selection
- **Knob**: Selection control with 3 positions (1, 2, 3)

### WebSocket Events

| Event         | Value   | Action                                     |
| ------------- | ------- | ------------------------------------------ |
| `BACK_BUTTON` | 1       | Navigate backward                          |
| `NEXT_BUTTON` | 1       | Navigate forward or confirm                |
| `KNOB`        | 1, 2, 3 | Select option (1=first, 2=second, 3=third) |

### WebSocket Connection

- **Port**: 3000 (same as HTTP server)
- **URL**: `ws://localhost:3000` (configurable via `NEXT_PUBLIC_SOCKET_URL`)

### WebSocket Usage Example

```javascript
const ws = new WebSocket("ws://localhost:3000");

// Navigate to next question
ws.send(
  JSON.stringify({
    event: "NEXT_BUTTON",
    value: 1,
  })
);

// Select option 2 (second option)
ws.send(
  JSON.stringify({
    event: "KNOB",
    value: 2,
  })
);

// Go back to previous question
ws.send(
  JSON.stringify({
    event: "BACK_BUTTON",
    value: 1,
  })
);
```

## 🧪 Testing the Control System

### Keyboard Testing

For development and testing purposes, the application supports keyboard controls that simulate the hardware controller:

| Key           | Action          | Hardware Equivalent |
| ------------- | --------------- | ------------------- |
| `Arrow Right` | Next Button     | Next Button         |
| `Arrow Left`  | Back Button     | Back Button         |
| `1`           | Knob Position 1 | Knob Value 1        |
| `2`           | Knob Position 2 | Knob Value 2        |
| `3`           | Knob Position 3 | Knob Value 3        |

### Testing Workflow

1. **Start the application**: `npm run dev`
2. **Open browser**: Navigate to `http://localhost:3000`
3. **Use keyboard controls**:
   - Press `1`, `2`, or `3` to select options
   - Press `Arrow Right` to proceed
   - Press `Arrow Left` to go back
4. **Complete the questionnaire** using only keyboard controls

### Control Flow Examples

#### Landing Page Navigation

```
1 → Select "START" option
2 → Select "INSTRUCTIONS" option
Arrow Right → Confirm selection
```

#### Questionnaire Navigation

```
1, 2, or 3 → Select answer option
Arrow Right → Confirm answer and proceed to next question
Arrow Left → Go back to previous question
```

#### Results and Printing

```
1, 2, or 3 → Navigate through result options
Arrow Right → Confirm print action
```

## 🎮 Hardware Controller Setup

### Physical Controller Requirements

The application is designed to work with a custom physical controller that includes:

- **Back Button**: Physical button for backward navigation
- **Next Button**: Physical button for forward navigation/confirmation
- **3-Position Knob**: Rotary control with positions 1, 2, and 3

### Controller Integration

The hardware controller should send WebSocket messages to the application:

```javascript
// Example controller implementation
const controller = {
  backButton: () => {
    ws.send(JSON.stringify({ event: "BACK_BUTTON", value: 1 }));
  },
  nextButton: () => {
    ws.send(JSON.stringify({ event: "NEXT_BUTTON", value: 1 }));
  },
  knobPosition: (position) => {
    ws.send(JSON.stringify({ event: "KNOB", value: position }));
  },
};
```

### Controller State Management

The application maintains controller state through:

- **Highlighted Index**: Current selection (0, 1, 2)
- **Current Screen**: Active screen (0=landing, 1=questionnaire, 2=instructions)
- **Question State**: Current question and selected answers

## 🎬 Media Assets

The application includes various video assets for different shoe categories:

- **Structure Videos**: 5 motion videos for Structure shoe
- **Pegasus Videos**: 5 motion videos for Pegasus shoe
- **Vomero Videos**: 5 motion videos for Vomero shoe

## 🎯 Key Components

### Atoms (Basic Components)

- `Button.tsx` - Interactive buttons with focus states
- `Text.tsx` - Typography component
- `AnimatedText.tsx` - Text with typing animations
- `ProgressChart.tsx` - Progress visualization
- `RadarChart.tsx` - Radar chart for analytics

### Molecules (Composite Components)

- `AppLayout.tsx` - Main application layout wrapper

### Organisms (Complex Sections)

- `HomePage.tsx` - Main questionnaire interface
- `LandingPage.tsx` - Welcome screen
- `ChartSection.tsx` - Analytics and charts
- `QuestionareSection.tsx` - Question display and interaction

## 🎨 Styling & Theming

The application uses a custom color scheme:

- **Primary Pink**: `#FF0c47` / `#bd2342`
- **Background**: Dark theme with white text
- **Custom Font**: Helvetica Now Display

### CSS Features

- Custom progress bar with animated stripes
- Focus animations for accessibility
- Responsive design with Tailwind CSS
- Custom keyframe animations

## 📊 Analytics & Tracking

- **Google Analytics**: Integrated for usage tracking
- **Progress Tracking**: Real-time completion percentage
- **Shoe Analytics**: Live preference calculations
- **User Interaction**: Button focus and selection tracking

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

- `NODE_ENV`: Set to 'production' for production mode
- `PORT`: Server port (default: 3000)
- `NEXT_PUBLIC_SOCKET_URL`: WebSocket server URL (default: `ws://localhost:3000`)

## 🔧 Development

### Code Structure

- **TypeScript**: Full type safety throughout the application
- **Context API**: Global state management with MainContext
- **Custom Hooks**: Reusable logic for components
- **Component Architecture**: Atomic design pattern

### Key Utilities

- `utils/data.ts` - Question data and video assets
- `utils/types.ts` - TypeScript type definitions
- `utils/helper.ts` - Helper functions
- `utils/socket.ts` - WebSocket utilities

## 📝 License

This project is proprietary and confidential. All rights reserved.

---

**Note**: This application is designed for Nike's trial assessment program and includes proprietary content and branding. Ensure proper licensing and permissions before use in other contexts.
