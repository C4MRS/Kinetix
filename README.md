# Kinetix

![CI Status](https://github.com/Y1lion/Kinetix/actions/workflows/ci.yml/badge.svg)

Kinetix is a high-performance project developed for the **Database Systems II** course. This repository follows a rigorous workflow based on traceability through Issues, Branching, and Pull Requests, focusing on the integration of Generative AI tools and performance monitoring.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run the environment, you must have the following installed:

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Y1lion/Kinetix.git
   cd Kinetix
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory. You must provide your MongoDB Atlas connection string and Meilisearch keys:
   - `MONGODB_ATLAS_URI`: Your MongoDB Atlas connection string (ensure your IP is whitelisted in Atlas).
   - `MEILI_MASTER_KEY`: Master key for the local Meilisearch instance.

3. **Start the Containers:**
   This command starts the Next.js app and the local Meilisearch engine:

   ```bash
   docker-compose up --build
   ```

4. **Access the Services:**
   - **Frontend/API (Next.js):** `http://localhost:3001`
   - **Meilisearch:** `http://localhost:7700`
   - **Database:** Managed via **MongoDB Atlas Cloud Console**

---

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (Node.js 20+)
- **Primary Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Managed Cloud Document Store)
- **Search Engine:** [Meilisearch](https://www.meilisearch.com/) (Fast, relevant search - Local Container)
- **Orchestration:** Docker & Docker Compose (for local development and search engine)

---

## 📈 Benchmarks & Verification

> This section tracks performance results and query logs, specifically focusing on the latency between the local environment and MongoDB Atlas.

| Test               | Objective                | Result (Avg Time) | Notes                         |
| :----------------- | :----------------------- | :---------------- | :---------------------------- |
| Environment Setup  | Container initialization | Success           | App + Search engine connected |
| Atlas Connectivity | DB Ping from Container   | -- ms             | _Pending implementation_      |
| Meilisearch Sync   | Cloud-to-Local Indexing  | -- ms             | _Pending implementation_      |

To run verification scripts:

```bash
docker exec -it kinetix-app npm run verify-db
```

---

## 📋 Project Workflow

Kinetix strictly adheres to the operational guidelines provided during the course:

- **Issue Tracking:** Every task is documented via an Issue with defined "Done-when" criteria.
- **Branching Strategy:** Development occurs on dedicated branches: `issue-<ID>-<description>`.
- **Peer Review:** All changes are merged into `main` via Pull Requests (PR) requiring at least one approval.
- **Traceability:** PRs must be linked to their respective issues using the `Closes #ID` syntax.

---

## 🤖 AI Usage Disclosure

Generative AI tools (e.g., ChatGPT, Gemini, Claude, Cursor) are authorized and encouraged for this project. Effort, iterations, and rework resulting from AI usage are systematically tracked via periodic surveys.

---

## 👥 Authors

- **C4MRS** - _Developer_
- **Y1lion** - _Developer_
