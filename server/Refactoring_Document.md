
# **ResumetricAI - Refactoring Documentation**

## **1. Introduction**

This document provides a detailed overview of the refactoring performed on the Resume Analyzer backend system. The goal was to migrate the existing procedural and route-centric codebase into a modular, object-oriented architecture while preserving all functional behavior. Additionally, the refactoring introduced proper separation of concerns, enhanced testability, improved maintainability, and enabled future extensibility of the system.

All refactoring was done without altering the functional requirements, API responses, or application workflows.

---

# **2. Objectives of the Refactoring**

The refactoring activities aimed to achieve the following:

1. Establish a clean, modular backend architecture based on OOP principles.
2. Remove duplicated logic and centralize business rules.
3. Decouple controllers from services to improve testability.
4. Introduce domain-specific service classes (AI service, parsing service, resume service, text cleaning service).
5. Replace procedural functions with injectable, testable class-based modules.
6. Standardize file naming, method naming conventions, and error-handling patterns.
7. Ensure schema validation using Zod remains consistent and centralized.
8. Prepare the system for future features (authentication, user-specific features, job-tracking).

---

# **3. Overview of Previous Architecture (Before Refactoring)**

The earlier backend structure had:

* Logic scattered across routes, controllers, and utility files.
* Inconsistent naming styles (camelCase, PascalCase).
* Limited separation between business logic and controller logic.
* No dedicated service layer.
* Difficult-to-test functions because of hard dependencies.
* Coupled AI parsing logic directly inside controllers.
* Procedural functions without abstractions or dependency injection.

This architecture worked but lacked scalability, extensibility, and testability.

---

# **4. Refactored Architecture Summary**

The new architecture follows a **service-driven OOP design** with well-defined roles:

### **4.1 New Directory Structure**

```
src/
│
├── controllers/
│   ├── analyze_controller.ts
│   └── upload_controller.ts
│
├── services/
│   ├── ai/
│   │   └── gemini_ai_service.ts
│   ├── resume/
│   │   ├── resume_service.ts
│   │   └── resume_parser_service.ts
│   ├── texts/
│   │   └── text_cleaner_service.ts
│
├── middleware/
│   ├── rate_limit.middleware.ts
│   ├── upload.middleware.ts
│   └── errors.middleware.ts
│
├── schemas/
│   └── analyze.schema.ts
│
├── utils/
│   ├── logger.ts
│   ├── extract_resume.ts
│   ├── async_handler.ts
│   └── parse_resume.ts
│
└── routes/
    ├── analyze.ts
    ├── upload.ts
    └── health.ts
```

---

# **5. Refactoring Changes in Detail**

## **5.1 Controllers Refactored**

### **Before**

* Controllers contained validation, AI logic calls, parsing logic, and response handling.
* Hard-coded dependencies inside controllers.
* Error handling was inconsistent.

### **After**

Controllers now:

* Only process input and return output.
* Delegate work to service classes.
* Use dependency injection for services.
* Are fully clean, testable, and predictable.

Example: `AnalyzeController` now calls `GeminiAIService` and `AnalyzeSchema` for validation instead of doing everything inline.

---

## **5.2 Service Layer Introduced**

Four new service classes were implemented:

### **1. GeminiAIService**

* Handles all communication with the Gemini API.
* Validates API responses.
* Converts raw AI text to structured output.
* Isolated for mocking during tests.

### **2. ResumeParserService**

* Extracts text from PDF/DOCX files.
* Calls parser utilities.
* Normalizes raw extracted text.

### **3. ResumeService**

* Coordinates parsing + cleaning + optional transformations.
* Will support user-specific resume operations in the future.

### **4. TextCleanerService**

* Normalizes whitespace, removes special characters, formats text.

All services have:

* Meaningful class names.
* Snake-case methods.
* Fully documented docstrings.
* Error handling with custom messages.

---

## **5.3 Improved Naming Conventions**

Following rules were enforced:

* **Files:** snake_case (`resume_parser_service.ts`)
* **Classes:** PascalCase (`ResumeParserService`)
* **Variables & Methods:** snake_case (`extract_resume_text`)
* **Routes:** kebab-case (`/ai-analyze`)

This eliminates ambiguity and aligns with backend conventions.

---

## **5.4 Centralized Error Handling**

A consistent error model was introduced:

* Services throw controlled `Error` instances.
* Controllers convert them into meaningful HTTP responses.
* Logger utility prints structured logs.

The system is now predictable and maintainable.

---

## **5.5 AI Integration Standardized**

Previously:

* AI logic existed inside multiple files.
* JSON validation and auto-fixing was inconsistent.

Now:

* `GeminiAIService` encapsulates all AI operations.
* AI response schema is required to match strict Zod validation.
* Mocked at test-time for deterministic results.

This improves robustness and prevents invalid AI output from breaking the system.

---

# **6. Testing Improvements (High Level)**

Although detailed testing is covered in the Testing Strategy Document, the refactoring enabled:

* Full mocking of AI responses.
* Isolated service testing.
* Integration testing with Supertest.
* Zero reliance on external APIs during tests.
* Deterministic and reproducible test outcomes.

---

# **7. Issues Resolved Through Refactoring**

| Issue in Old Code                  | Resolution After Refactoring           |
| ---------------------------------- | -------------------------------------- |
| Controllers had business logic     | Moved logic to services                |
| AI calls hard-coded and untestable | Abstracted behind GeminiAIService      |
| Parsing logic deeply nested        | Centralized in ResumeParserService     |
| No standard naming convention      | Enforced snake_case and PascalCase     |
| Hard-to-test functions             | Dependency injection enabled           |
| Mixed validation and logic         | Zod schemas isolated in schemas/       |
| Repeated error messages            | Standardized error handling middleware |
| No modularity                      | Fully modular OOP structure            |

---

# **8. Benefits of the Refactored Architecture**

### **1. High Testability**

* All services are mockable.
* All modules are independently testable.

### **2. Scalability**

* Easy to introduce additional AI models.
* Future plugins (like ATS scoring, keyword extraction) can extend the service layer.

### **3. Maintainability**

* Each module has a single responsibility.
* Clear boundaries between system layers.

### **4. Reliability**

* Errors bubble consistently.
* AI failures are handled without breaking the user flow.

### **5. Extensibility**

Future features like:

* User authentication
* Resume storage
* History tracking
* Multi-AI backend selection
  can be added without rewriting existing code.

---

# **9. Conclusion**

The refactoring successfully transformed the Resume Analyzer backend into a modular, object-oriented system with clear separation of responsibilities. The revised architecture enhances scalability, reliability, and maintainability without altering the core functionality of the application.

The project is now production-ready and aligned with professional engineering best practices, enabling easier onboarding, testing, and feature expansion.


