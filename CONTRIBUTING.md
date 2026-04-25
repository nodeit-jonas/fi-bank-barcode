# Contributing

Thank you for your interest in contributing to `finnish-bank-barcode`!

## Getting Started

1. Fork the repository and clone your fork.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the tests to make sure everything passes before you start:
   ```bash
   npm test
   ```

## Development

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `npm run build`       | Compile TypeScript to `dist/`        |
| `npm test`            | Run the test suite                   |
| `npm run test:coverage` | Run tests with coverage report     |
| `npm run lint`        | Lint source files with ESLint        |
| `npm run typecheck`   | Type-check without emitting files    |

## Guidelines

- **Specification first** — All encoding and validation behaviour must comply with the [Finanssiala ry specification v5.3](https://www.finanssiala.fi/wp-content/uploads/2021/03/Pankkiviivakoodi-opas.pdf). Reference the spec in your PR description when changing encoding or validation logic.
- **Tests required** — New features and bug fixes must include tests. Run `npm test` before opening a PR.
- **Code style** — The project uses ESLint and Prettier. Run `npm run lint` and make sure there are no new errors.
- **Keep PRs focused** — One feature or fix per pull request.

## Submitting a Pull Request

1. Create a branch from `main`.
2. Make your changes with clear, focused commits.
3. Open a pull request against `main` and describe what you changed and why.

For security vulnerabilities, see [SECURITY.md](.github/SECURITY.md) instead.
