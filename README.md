# Speaking Test Application

A web application for practicing and scoring speaking tests, similar to TOEFL speaking sections.

## Features

- Audio recording with customizable duration
- Real-time speaking score analysis
- Detailed feedback on:
  - Fluency
  - Pronunciation
  - Vocabulary
  - Grammar
  - Coherence
- IELTS and CEFR level mapping
- Export results as PDF or PNG
- Download recorded audio files

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
```

## Usage

1. Select a speaking prompt from the available options
2. Get preparation time (15 seconds) to organize your thoughts
3. Record your response (45 seconds)
4. Receive instant feedback and scoring
5. Export or download your results

## API Integration

The application integrates with the Speaking Score API for analysis. Ensure you have a valid API key in your `.env` file.

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- html2canvas (for image export)
- jsPDF (for PDF export)
- Web Audio API (for audio recording)

## Environment Variables

- `VITE_API_KEY`: Your Speaking Score API key

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request