import { exec } from 'child_process';
import { mkdir, unlink, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';

const TEMP_DIR = path.join(os.tmpdir(), 'student-productivity-code');
const EXECUTION_TIMEOUT_MS = 5000;
const MAX_CODE_SIZE = 5000;
const MAX_BUFFER_SIZE = 1024 * 1024;

const executePythonFile = (filePath) =>
  new Promise((resolve, reject) => {
    exec(
      `python3 "${filePath}"`,
      {
        timeout: EXECUTION_TIMEOUT_MS,
        maxBuffer: MAX_BUFFER_SIZE,
      },
      (error, stdout, stderr) => {
        if (error) {
          error.stdout = stdout;
          error.stderr = stderr;
          reject(error);
          return;
        }

        resolve({ stdout, stderr });
      }
    );
  });

const getExecutionErrorMessage = (error) => error.stderr?.trim() || error.message;

export const runCode = async (req, res) => {
  let filePath;

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

    console.log('[EXEC] Running code for user request');

    await mkdir(TEMP_DIR, { recursive: true });

    filePath = path.join(TEMP_DIR, `code_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.py`);
    await writeFile(filePath, code, 'utf8');

    const { stdout, stderr } = await executePythonFile(filePath);

    if (stderr) {
      return res.status(400).json({
        success: false,
        error: stderr.trim(),
      });
    }

    return res.status(200).json({
      success: true,
      output: stdout.trim(),
    });
  } catch (error) {
    if (error.killed || error.signal === 'SIGTERM') {
      return res.status(408).json({
        success: false,
        error: 'Code execution timed out',
      });
    }

    return res.status(400).json({
      success: false,
      error: getExecutionErrorMessage(error),
    });
  } finally {
    if (filePath) {
      try {
        await unlink(filePath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error(`Failed to clean up temp file: ${error.message}`);
        }
      }
    }
  }
};
