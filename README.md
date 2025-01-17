This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Requirements
To run this project, you need to have the following tools installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [Git](https://git-scm.com/)
- A MongoDB Atlas account

## Installation Instructions

### 1. Cloning the Repo

Run the following command to clone the project files to your local computer:

```bash
git clone <repository-url>
```

Then change to the project directory:

```bash
cd <proje-dizini>
```

### 2. Installation of Required Packages

To install the dependencies used in the project, run the following command:

```bash
npm install
```
### 3. Defining Environment Variables
Before running the project, create a `.env` file and define the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|MONGODB_URI                           | MongoDB Atlas connection URI.               | mongodb+srv://myDatabaseUser:D1fficultP%40ssw0rd@mongodb0.example.com/?authSource=admin&replicaSet=myRepl                                            |
|NEXTAUTH_SECRET                           | The secret key used for NextAuth authentication.               | default-secret-key                                            |
|JWT_SECRET                             | The key used to create and verify a JSON Web Token (JWT).               | default-jwt-secret                                            |
|NEXTAUTH_URL                           | Base URL for NextAuth              | `http://localhost:3000`                                            |

### 4. Database Preparation

Create the necessary collections and schemas on MongoDB Atlas. If there is a seed (sample data) file in the project, you can run it with the following command:

```bash
npm run seed
```

### 5. Running the Project

To start the project in development mode, you can use the following command:

```bash
npm run dev
```

You can view the project by going to [http://localhost:3000](http://localhost:3000) in your browser.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
