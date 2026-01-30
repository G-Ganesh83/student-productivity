## Requirements

Ensure the following are installed on your system:

- Node.js (v18 or above recommended)
- npm (comes with Node.js)
- Git

Verify installation by running the following commands in terminal:

node -v
npm -v
git --version

## Steps to Run Locally

1. Clone the repository

git clone https://github.com/<your-username>/<your-repository-name>.git

2. Navigate into the project directory

cd <your-repository-name>

3. Install project dependencies

npm install

4. Start the development server

npm run dev

5. Open the application in your browser

http://localhost:5173


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
