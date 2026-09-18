/**
 * Validates that all required environment variables are present at startup.
 *
 * Required variables:
 *   - MONGO_URI   — MongoDB connection string
 *   - JWT_SECRET  — Secret key for signing/verifying JWT tokens
 *
 * Optional/recommended variables (warnings only, not fatal):
 *   - PORT        (default: 8000)
 *   - NODE_ENV    (default: 'development')
 *   - CLIENT_URL  (default: 'http://localhost:5173')
 */

const REQUIRED = ['MONGO_URI', 'JWT_SECRET'];

const OPTIONAL = [
  { key: 'PORT',       default: '8000' },
  { key: 'NODE_ENV',   default: 'development' },
  { key: 'CLIENT_URL', default: 'http://localhost:5173' },
];

const validateEnv = () => {
  // ── Required ────────────────────────────────────────────────────────────────
  const missing = REQUIRED.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      '\n\x1b[31m\x1b[1m[ENV ERROR] Missing required environment variables:\x1b[0m\n' +
      missing.map((k) => `  \x1b[31m✖ ${k}\x1b[0m`).join('\n') +
      '\n\n  Ensure a \x1b[33m.env\x1b[0m file exists in the \x1b[33mbackend/\x1b[0m directory ' +
      'or that these variables are set in your deployment environment.\n'
    );
    process.exit(1);
  }

  // ── Optional / Recommended ──────────────────────────────────────────────────
  const usingDefaults = OPTIONAL.filter(({ key }) => !process.env[key]);

  if (usingDefaults.length > 0) {
    usingDefaults.forEach(({ key, default: def }) => {
      console.warn(
        `\x1b[33m[ENV WARN]\x1b[0m ${key} not set — using default: \x1b[36m${def}\x1b[0m`
      );
    });
  }
};

export default validateEnv;
