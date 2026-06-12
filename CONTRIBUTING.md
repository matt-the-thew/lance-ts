# Contributing

Thanks for considering contributing to Lance!

## Getting Started

1. Fork the repository
2. Clone your fork locally: `git clone https://github.com/your-username/repo-name.git`
3. Create a branch: `git switch -c feature/your-feature-name`
4. Install dependencies: `pnpm install`

## Development Workflow

1. Make your changes to `./src`
2. Add or update tests as needed in `./tests`
3. Ensure tests pass: `pnpm test` / `pnpm test:ui`
4. Ensure type-checking passes: `pnpm type-check`
5. Commit using (conventional commits)[https://www.conventionalcommits.org/en/v1.0.0/#summary]
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a pull request against `main`

## Pull Request Guidelines

Please...
- Keep PRs focused on a single change
- Describe what the change does and why
- Reference related issues (e.g. `Closes #123`)
- Ensure CI checks pass before requesting review

## Reporting Issues

- Search existing issues before opening a new one
- Include steps to reproduce, expected behavior, and actual behavior
- Include relevant logs, screenshots, or environment details

## Code Style

- Follow the existing code style and conventions
- Write clear, self-documenting code with JSDOC-style comments where needed. Docs are generated with (typedoc)[https://typedoc.org/], check out their reference if you need it.

## Code of Conduct

By participating, you agree to uphold a respectful and inclusive environment for all contributors. This project is about increasing access to a public tool. Keep it cool, let's write great code.

## Questions?

Open a discussion or issue if you have questions! I'm happy to help.
