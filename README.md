# ShipPaws

ShipPaws is a pet transportation platform that connects pet owners with verified transporters. This Next.js application provides a comprehensive onboarding system for transporters and a landing page for the service.

## Features

- **Transporter Onboarding**: Multi-step application process for pet transporters
- **Document Management**: Upload and verification system for licenses and certifications
- **Responsive Design**: Mobile-optimized interface
- **Form Validation**: Real-time validation and error handling
- **Progress Tracking**: Visual step indicator for application progress

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

- `/transporters` - Transporter landing page
- `/transporters/onboard` - Multi-step onboarding form
- `/transporters/onboard/components/` - Individual form step components

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
