// ---------------------------------------------------------------------------
// Sandboxed Code Execution Controller
//
// Delegates code execution to an external Piston-compatible sandbox API
// instead of running user code on the host OS.
//
// Configure the runner URL via the CODE_RUNNER_URL environment variable.
// Default: https://emkc.org/api/v2/piston/execute (public Piston API)
//
// Piston execute request shape:
//   POST { language, version, files: [{ content }] }
//
// Piston execute response shape:
//   { run: { stdout, stderr, code, signal, output }, language, version }
// ---------------------------------------------------------------------------

const DEFAULT_RUNNER_URL = 'https://emkc.org/api/v2/piston/execute';
const DEFAULT_PYTHON_VERSION = '3.10.0';
const DEFAULT_TIMEOUT_MS = 10000;
const MAX_CODE_SIZE = 5000;

/**
 * Sends code to the Piston-compatible sandbox API and returns the result.
 * Throws on network or non-200 responses.
 */
const executeInSandbox = async (language, code) => {
  const runnerUrl = process.env.CODE_RUNNER_URL || DEFAULT_RUNNER_URL;
  const pythonVersion = process.env.PYTHON_SANDBOX_VERSION || DEFAULT_PYTHON_VERSION;
  const timeoutMs = Number(process.env.CODE_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(runnerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        language,
        version: pythonVersion,
        files: [{ content: code }],
      }),
    });

    const data = await response.json();

    // Piston returns 200 even for runtime errors; non-200 means the API
    // itself rejected the request (rate-limit, bad payload, etc.).
    if (!response.ok) {
      const apiMessage =
        data?.message || data?.error || `Sandbox API responded with ${response.status}`;
      throw new Error(apiMessage);
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Extracts a user-friendly error string from a Piston run result or a
 * caught exception.
 */
const getExecutionErrorMessage = (error) =>
  error?.message || 'Code execution failed';

export const runCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language) {
      return res.status(400).json({
        success: false,
        error: 'Language is required',
      });
    }

    if (!code?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Code is required',
      });
    }

    if (code.length > MAX_CODE_SIZE) {
      return res.status(400).json({
        success: false,
        error: 'Code exceeds the 5000 character limit',
      });
    }

    if (language !== 'python') {
      return res.status(400).json({
        success: false,
        error: 'Only python is supported',
      });
    }

    console.log('[EXEC] Sending code to sandbox runner');

    const result = await executeInSandbox(language, code);

    const run = result?.run;

    if (!run) {
      return res.status(502).json({
        success: false,
        error: 'Sandbox returned an unexpected response',
      });
    }

    // Piston returns a non-zero exit code on runtime errors and places the
    // traceback in stderr. Mirror the original controller's behavior:
    // stderr → 400 with error; stdout → 200 with output.
    const stderr = run.stderr?.trim();
    const stdout = run.stdout?.trim();

    if (stderr) {
      return res.status(400).json({
        success: false,
        error: stderr,
      });
    }

    return res.status(200).json({
      success: true,
      output: stdout || 'Code ran successfully with no output.',
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(408).json({
        success: false,
        error: 'Code execution timed out',
      });
    }

    console.error('[EXEC] Sandbox execution error:', error.message);

    return res.status(400).json({
      success: false,
      error: getExecutionErrorMessage(error),
    });
  }
};

