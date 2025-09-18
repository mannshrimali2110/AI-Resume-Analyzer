**AI-Powered Resume & Job Description Analyzer Web App** (MERN + Gemini AI):

---

# **Project Requirements Document (PRD)**

## **Project Title:**

AI-Powered Resume Tailoring & Feedback Assistant

## **Objective:**

To build a web application where users can input their Resume and a Job Description (JD), and the system will analyze how well the resume aligns with the JD, providing AI-powered feedback to optimize the resume for better job fitment.

---

## **1. Features & Functional Requirements**

### **1.1 User Inputs**

* **Option 1:** Paste Resume Text in Textarea.
* **Option 2:** Upload Resume as **PDF** or **DOCX** file.
* **Paste Job Description Text** in a Textarea.
* **Optional:** Paste LinkedIn Job Post Link (initially to be ignored in MVP).

---

### **1.2 Resume Parsing & Preprocessing**

* Extract plain text from **PDF** files.
* Extract plain text from **DOCX** files.
* Remove unwanted characters, special symbols, and clean text.
* Handle common resume formats (Headings: Experience, Skills, Education, etc.)

---

### **1.3 AI Analysis & Feedback**

* Send the Resume Text and Job Description to **Gemini AI API** with custom prompts.
* Analyze:

  * **Match Percentage** (how well resume fits the JD).
  * **Skills & Keywords Missing** in the Resume.
  * **Section-wise Feedback** (Experience relevance, Skills, Certifications).
  * **Improvement Suggestions** (e.g., Add X, Emphasize Y).
* AI Response Formatting: Bullet Points, Percentages, Clear Feedback Blocks.

---

### **1.4 Output Display**

* Visually display the **Match Score (%)**.
* List Missing Keywords/Skills.
* Show AI-generated recommendations (Improvement Tips).
* Option to **copy feedback to clipboard**.

---

### **1.5 Rate Limiting & Abuse Prevention**

* Limit number of API calls per user (5 per minute).
* Add randomized delays to prevent bot-like behavior.
* ReCAPTCHA or basic bot protection on frontend (later phase).

---

### **1.6 Optional Future Features (Not MVP)**

* Integration with LinkedIn Job Post Scraping (after legal consideration).
* AI-Suggested Resume Bullet Points Generator.
* Upload multiple resumes for comparison.
* Export feedback as **PDF report**.
* Save resume analysis history (if login system is added).

---

## **2. Non-Functional Requirements**

| Attribute       | Requirement                                                       |
| --------------- | ----------------------------------------------------------------- |
| **Scalability** | Scalable backend for concurrent AI requests.                      |
| **Performance** | Feedback generated within **5-7 seconds**.                        |
| **Security**    | Handle user files safely, auto-delete after parsing.              |
| **Compliance**  | No scraping of personal/private data; user-initiated inputs only. |
| **Reliability** | 99% uptime during normal operations.                              |

---

## **3. Technology Stack**

### **Frontend (Client-side)**

| Technology       | Purpose                             |
| ---------------- | ----------------------------------- |
| **React.js**     | Building responsive, interactive UI |
| **Tailwind CSS** | Rapid UI styling                    |
| **Axios**        | HTTP requests to backend API        |

---

### **Backend (Server-side)**

| Technology            | Purpose                                 |
| --------------------- | --------------------------------------- |
| **Node.js + Express** | REST API Server                         |
| **Multer**            | File Upload Handling (PDF/DOCX parsing) |
| **pdf-parse**         | PDF resume parsing                      |
| **mammoth.js**        | DOCX resume parsing                     |
| **Axios**             | Making API calls to Gemini AI           |
| **dotenv**            | Manage API Keys & environment variables |

---

### **AI Integration**

| Technology            | Purpose                         |
| --------------------- | ------------------------------- |
| **Google Gemini API** | AI-powered resume & JD analysis |

---

### **Infrastructure (MVP Phase)**

| Component           | Choice                                |
| ------------------- | ------------------------------------- |
| Deployment Platform | **Render.com / Railway.app / Vercel** |
| Storage             | Local (temporary file storage)        |
| Database            | Not required for MVP                  |

---

## **4. API Endpoints**

| Endpoint                  | Method | Description                                      |
| ------------------------- | ------ | ------------------------------------------------ |
| `/api/upload-resume`      | POST   | Upload & parse PDF Resume                        |
| `/api/upload-resume-docx` | POST   | Upload & parse DOCX Resume                       |
| `/api/ai-analyze`         | POST   | Analyze Resume & Job Description using Gemini AI |

---

## **5. Assumptions**

* Users will voluntarily paste or upload resumes and job descriptions.
* The AI feedback is advisory and may not perfectly reflect ATS outcomes.
* No user accounts/login required in MVP.
* Data is processed temporarily; no storage of personal data in backend.

---

## **6. Constraints**

* **Gemini API usage limits & costs** (optimize prompt usage).
* Limited LinkedIn integration due to legal constraints.
* Parsing complex resume layouts (tables, graphics) is out of MVP scope.

---

## **7. Milestones & Timeline**

| Milestone                           | ETA      |
| ----------------------------------- | -------- |
| Resume & JD Paste Input MVP         | Day 1-2  |
| PDF/DOCX Upload & Parsing           | Day 3-4  |
| Gemini AI Integration (Backend API) | Day 5-6  |
| Frontend-Backend Integration        | Day 7-8  |
| UI Polish & Testing                 | Day 9-10 |

---

## **8. Deliverables**

* Fully functional MERN Web App (MVP)
* Clean UI for Resume & JD input
* AI-generated analysis with feedback
* Documentation & Deployment Guide

---

