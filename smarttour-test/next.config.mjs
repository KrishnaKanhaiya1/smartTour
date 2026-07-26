import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDirectory = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep Turbopack scoped to this repository. Without an explicit root it can
  // select a parent lockfile and fail to watch the project on Windows.
  turbopack: { root: projectDirectory },
};

export default nextConfig;
