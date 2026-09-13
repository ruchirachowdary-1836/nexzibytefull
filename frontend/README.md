# TechTalk — NexziByte

React + Vite frontend prototype built from the provided internship assignment.

## Run
1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Run `npm install`
4. Copy `.env.example` to `.env` and set the Neon Auth/Data API URLs.
5. Run `npm run dev`
6. Open the localhost URL shown by Vite.

## Included
Home, Explore/feed with search and filters, post details, Create Post, Profile, TechTalk Summits, Summit Details, Founder Meets, Founder Meet Details, Speakers, Login, Register, responsive navigation, realistic mock data, and API-ready separation.

Neon Auth is supported through `@neondatabase/neon-js`. Set `VITE_AUTH_PROVIDER=neon` to use Neon email/password authentication. If that variable is omitted, the existing FastAPI JWT authentication remains the fallback. The FastAPI API continues to handle application and registration workflows until its token validation is configured for the Neon Auth JWKS.
