# Key2Glory

Key2Glory is a typing test website created using React, Java/Spring, and PostgreSQL. It allows users to take, create, share, and search for typing tests. The application tracks missed characters and provides general overall typing statistics.

## Features

- **Take Typing Tests**: Users can participate in various typing tests to improve their typing skills.
- **Create and Share Tests**: Users can create custom typing tests and share them with others.
- **Track Performance**: The app tracks missed characters and provides detailed typing statistics.
- **Search Tests**: Search test text and filter by type, your favorites, tests you created or completed.
- **Leaderboards**: A global leaderboard plus top scores for every test.
- **Stats**: WPM trend over recent runs and a keyboard heatmap of the keys you miss most.

## Development

```bash
npm install
npm run dev     # Vite dev server on :5174, API from VITE_API_SERVER_URL in .env
npm test        # Vitest unit tests (typing engine, stats)
npm run lint
npm run build
```

## Live Application

You can check out the live application here: [Key2Glory Live App](https://key2glory.jacobferrell.net)

## Backend Repository

The backend repository can be found here: [Backend Repository](https://github.com/jacob-ferrell/key2glory-backend)

## Technologies Used

- **Frontend**: React
- **Backend**: Java/Spring
- **Database**: PostgreSQL
