# PromptWars Coding Challenge - Evaluation Framework & Guidelines

This document outlines the **Evaluation Framework** for the PromptWars Coding Challenge. Refer to these guidelines during implementation to ensure maximum scoring potential on the platform's automated assessment.

---

## 📋 Evaluation Core Signals

Each phase is evaluated automatically by the platform based on the following six key dimensions:

### 1. 💎 Code Quality
*   **Readability & Maintainability:** Write clean, self-documenting code. Use meaningful variable and function names.
*   **Standards & Best Practices:** Follow language-specific style guides (e.g., PEP 8 for Python, ESLint/Prettier for JavaScript/TypeScript).
*   **Modularity:** Structure the code using modular, reusable components/functions. Avoid monolithic files and duplicate logic.
*   **Documentation:** Maintain docstrings, comments, and readme instructions where appropriate.

### 2. 🔒 Security
*   **Input Validation:** Sanitize and validate all user inputs to prevent injection attacks (SQL injection, Command injection, XSS).
*   **Secrets Management:** Never hardcode API keys, passwords, or credentials. Use environment variables or configuration files.
*   **Secure API Design:** Implement proper authorization, authentication, and error-handling that does not leak sensitive stack traces.
*   **Safe Dependency Usage:** Ensure all packages are scanned and verified.

### 3. ⚡ Efficiency
*   **Algorithm & Complexity:** Choose optimal data structures and algorithms (minimize time and space complexity).
*   **Resource Management:** Ensure database connections, file streams, and network sockets are properly closed and handled.
*   **Performance Optimization:** Implement caching, pagination, or lazy-loading where appropriate to improve system response times.

### 4. 🧪 Testing
*   **Unit Tests:** Implement robust unit tests for core logical blocks and utility functions.
*   **Integration Tests:** Ensure end-to-end user flows and API integrations are thoroughly covered.
*   **Test Coverage:** Maintain a high test coverage percentage (aim for >80% coverage where feasible).

### 5. ♿ Accessibility (for Frontends)
*   **Semantic HTML:** Use proper tags (e.g., `<main>`, `<nav>`, `<button>`, `<header>`) rather than generic `<div>` wrappers.
*   **ARIA attributes:** Use `aria-*` tags and descriptions where interactive elements require extra context.
*   **Keyboard Nav & Contrast:** Ensure all pages are fully navigable via keyboard and have sufficient color contrast ratios.

### 6. 🎯 Problem Statement Alignment
*   **Feature Completeness:** Build every feature precisely as described in the requirements. Do not skip edge cases.
*   **Input/Output Specifications:** Ensure input formats, API payloads, database schemas, and output formats match the specifications exactly.

---

## 🏆 Submission Rules & Strategy

*   **Warm-up Scoring:** Warm-up phase scores are separate and **do not count** towards the main leaderboard. However, they should be used to test the environment and ensure the submission pipeline is fully functional.
*   **Final Submission Counts:** Only the **final submission score** for a phase is considered. The platform does *not* keep your historical best attempt. 
    > [!IMPORTANT]
    > **Do not submit a regression.** Always verify that the current version of the code is passing all local and automated checks before making a final submission.
