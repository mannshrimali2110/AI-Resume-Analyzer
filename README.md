# Resume Analyzer — AI-Powered Resume Tailoring & Feedback Assistant

## Stack
- MERN (React + Tailwind, Node + Express)
- Gemini AI

## Setup

### Prerequisites
- Node.js 20.x LTS
- npm

### Environment Variables
Copy `.env.example` to `.env` and fill in your Gemini API key and other config.

### Install Dependencies
```
npm install
npm install --prefix client
npm install --prefix server
```

### Run Locally
```
npm run dev
```

### Deploy
- Compatible with Render, Railway, Vercel

## Features
- Paste/upload resume (PDF/DOCX)
- Paste JD
- Analyze via Gemini
- Match score, missing keywords/skills, section-wise feedback, improvement suggestions
- Copy-to-clipboard, rate limiting

## Tests
- Backend: Jest + Supertest
- Frontend: Vitest + Testing Library

## API Collection
See `/collections/AI-Analyzer.postman_collection.json`
