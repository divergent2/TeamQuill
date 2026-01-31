# GitHub Copilot Instructions for TeamQuill

## Project Overview
TeamQuill is an interactive platform for copywriters to manage tasks, share ideas, receive updates, and improve submissions with AI. The platform focuses on collaboration and AI-assisted content creation.

## Development Guidelines

### Code Style and Standards
- Write clean, maintainable, and well-documented code
- Follow industry best practices for the technologies used
- Ensure code is accessible and follows WCAG guidelines where applicable
- Use meaningful variable and function names that clearly indicate purpose

### Testing
- Write comprehensive tests for new features
- Ensure all tests pass before submitting changes
- Include both unit tests and integration tests where appropriate
- Test edge cases and error conditions

### Documentation
- Update README.md when adding new features or changing setup instructions
- Include inline comments for complex logic
- Document API endpoints and their expected inputs/outputs
- Keep documentation in sync with code changes

### Security
- Never commit sensitive data (API keys, passwords, tokens)
- Validate and sanitize all user inputs
- Follow OWASP security best practices
- Review dependencies for known vulnerabilities

### AI Integration
- When working with AI features, ensure proper error handling
- Implement rate limiting for AI API calls
- Provide clear user feedback during AI operations
- Cache AI responses when appropriate to reduce costs

### Git Workflow
- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Reference issue numbers in commit messages when applicable
- Ensure the codebase builds and tests pass before committing

## Project-Specific Notes
- This is a copywriting collaboration platform with AI assistance
- Focus on user experience and ease of use for content creators
- Performance is important for real-time collaboration features
- Maintain consistency in UI/UX patterns throughout the application
