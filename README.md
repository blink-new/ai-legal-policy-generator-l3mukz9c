
# AI Legal Policy Generator

A web application that generates legal policies (privacy policy, terms of service, cookie policy) using AI based on a business description provided by the user.

![AI Legal Policy Generator](https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80)

## Features

- Generate multiple types of legal policies:
  - Privacy Policy
  - Terms of Service
  - Cookie Policy
- AI-powered policy generation based on business description
- Copy generated policies to clipboard
- Download policies in markdown format
- Responsive design for all devices
- Beautiful UI with gradient backgrounds and animations

## Tech Stack

- React with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- ShadCN UI components
- OpenAI API for AI-powered policy generation
- Supabase Edge Functions for secure API key handling

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Set up your Supabase project with the OpenAI API key:
   - Add the `OPENAI_API_KEY` to your Supabase project secrets

### Development

Run the development server:

```bash
npm run dev
```

### Building for Production

Build the application:

```bash
npm run build
```

## Project Structure

- `/src` - Source code
  - `/components` - UI components
  - `/lib` - Utility functions and API clients
  - `/hooks` - Custom React hooks
- `/supabase` - Supabase Edge Functions
  - `/functions` - Edge Function code

## How It Works

1. User enters a description of their business
2. User selects the type of policy they want to generate
3. The application sends the request to a Supabase Edge Function
4. The Edge Function uses the OpenAI API to generate the policy
5. The generated policy is returned to the frontend and displayed to the user
6. User can copy or download the generated policy

## Security

This application uses Supabase Edge Functions to securely handle API requests to OpenAI. The OpenAI API key is stored securely in Supabase and is never exposed to the client.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

The generated policies are meant to serve as a starting point. We recommend having them reviewed by a legal professional before implementation to ensure they meet your specific legal needs and jurisdiction requirements.