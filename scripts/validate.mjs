import { execSync } from 'child_process';

const steps = [
  { name: 'Gitleaks', cmd: 'gitleaks detect' },
  { name: 'NPM Audit', cmd: 'npm audit --audit-level=moderate' },
  { name: 'NPM Signatures', cmd: 'npm audit signatures' },
  { name: 'Semgrep Security', cmd: 'semgrep scan --error --config p/security-audit --config p/typescript --config p/react --config p/owasp-top-ten' },
  { name: 'Lint', cmd: 'npm run lint' },
  { name: 'Typecheck', cmd: 'npm run typecheck' },
  { name: 'Unit Tests', cmd: 'vitest run --coverage' },
  { name: 'E2E Tests', cmd: 'npm run test:e2e' },
  { name: 'Build', cmd: 'npm run build' },
];

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const symbols = { pass: '✓', fail: '✗', arrow: '→', box: '▸' };

function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

console.log(`\n${colors.bright}${colors.blue}┌──────────────────────────────────────┐${colors.reset}`);
console.log(`${colors.bright}${colors.blue}│       VALIDATION PIPELINE            │${colors.reset}`);
console.log(`${colors.bright}${colors.blue}└──────────────────────────────────────┘${colors.reset}\n`);

const results = [];
const totalStart = Date.now();

for (let i = 0; i < steps.length; i++) {
  const { name, cmd } = steps[i];
  const stepNum = `[${i + 1}/${steps.length}]`;
  
  process.stdout.write(`${colors.cyan}${stepNum}${colors.reset} ${colors.dim}${symbols.box}${colors.reset} ${name}... `);
  
  const start = Date.now();
  try {
    execSync(cmd, { stdio: 'pipe' });
    const duration = Date.now() - start;
    console.log(`${colors.green}${symbols.pass} passed${colors.reset} ${colors.dim}(${formatTime(duration)})${colors.reset}`);
    results.push({ name, success: true, duration });
  } catch (error) {
    const duration = Date.now() - start;
    console.log(`${colors.red}${symbols.fail} failed${colors.reset} ${colors.dim}(${formatTime(duration)})${colors.reset}`);
    results.push({ name, success: false, duration });
    
    console.log(`\n${colors.red}${colors.bright}Error in: ${name}${colors.reset}`);
    console.log(`${colors.dim}Command: ${cmd}${colors.reset}\n`);
    if (error.stdout) console.log(error.stdout.toString());
    if (error.stderr) console.log(error.stderr.toString());
    
    process.exit(1);
  }
}

const totalTime = Date.now() - totalStart;

console.log(`\n${colors.bright}${colors.green}┌──────────────────────────────────────┐${colors.reset}`);
console.log(`${colors.bright}${colors.green}│  ${symbols.pass} ALL CHECKS PASSED                 │${colors.reset}`);
console.log(`${colors.bright}${colors.green}└──────────────────────────────────────┘${colors.reset}`);
console.log(`${colors.dim}Total time: ${formatTime(totalTime)}${colors.reset}\n`);