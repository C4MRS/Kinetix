# Kinetix

![CI Status](https://github.com/Y1lion/Kinetix/actions/workflows/ci.yml/badge.svg)
![Backend Status](https://github.com/Y1lion/Kinetix/actions/workflows/deploy-backend.yml/badge.svg)
![Frontend Status](https://github.com/Y1lion/Kinetix/actions/workflows/deploy-frontend.yml/badge.svg)

Kinetix is a full-stack web application developed for the **Database Systems II** course.

The project simulates an e-commerce platform for sports products, integrating a Next.js frontend, an Express REST API, MongoDB Atlas, Meilisearch, Azure AI-powered search and product tagging, Microsoft authentication, persistent sessions, shopping basket and checkout flows, and automated CI/CD deployment to Microsoft Azure.

The repository follows a structured workflow based on Issues, Branches, Pull Requests, code reviews, and traceability of changes.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Main Features](#main-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Azure Cloud Services](#azure-cloud-services)
- [Intelligent Search](#intelligent-search)
- [Security and Authentication](#security-and-authentication)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Services](#available-services)
- [API Documentation](#api-documentation)
- [CI Pipeline](#ci-pipeline)
- [CD Pipeline](#cd-pipeline)
- [Project Workflow](#project-workflow)
- [Useful Commands](#useful-commands)
- [Troubleshooting](#troubleshooting)
- [Benchmarks and Verification](#benchmarks-and-verification)
- [AI Usage Disclosure](#ai-usage-disclosure)
- [Authors](#authors)

---

## Project Overview

Kinetix consists of three application services, supported by managed cloud services:

1. **Frontend**
   - Built with Next.js, React, TypeScript, and Tailwind CSS.
   - Provides product browsing, Microsoft login, basket and checkout flows, order viewing, and admin interfaces.
   - Deployed to **Azure Container Apps**.

2. **Backend**
   - Built with Node.js, Express, and Mongoose.
   - Exposes REST APIs for authentication, products, baskets, users, orders, admin operations, search, and Swagger documentation.
   - Integrates Azure AI services, Blob Storage, Key Vault, and Application Insights.
   - Deployed to **Azure Container Apps**.

3. **Meilisearch**
   - Indexes products and provides full-text search as a fallback for the intelligent search flow.
   - Runs as a Docker container locally and as an **Azure Container App** in the cloud.

The main application database is hosted on **MongoDB Atlas**. Azure API Management exposes a managed API gateway, while Azure Blob Storage stores uploaded product images.

---

## Main Features

- Product catalogue and product detail browsing.
- Microsoft authentication and persistent cookie-based sessions.
- Role-based authorization for admin operations.
- Basket management for authenticated users.
- Checkout, payment flow, and persisted order history.
- Admin dashboard, product management, and user management.
- Admin product-image upload to Azure Blob Storage.
- Automatic product tagging using Azure AI Vision.
- Key phrase extraction from text using Azure AI Language.
- Search using text queries, image URLs, or both.
- MongoDB tag matching with Meilisearch fallback.
- Swagger API documentation.
- Local development using Docker Compose.
- GitHub Actions continuous integration and deployment workflows.
- Azure Key Vault secret management and Managed Identity access.
- Azure Application Insights request monitoring and diagnostics.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express
- Mongoose
- `express-session`
- `connect-mongo`
- `bcrypt` (password hashing for supported password-based flows)
- Azure SDKs and Axios

### Database

- MongoDB Atlas

### Search Engine

- Meilisearch v1.7 (version documented in the original local setup)

### AI Services

- Azure AI Language — Key Phrase Extraction
- Azure AI Vision — Image Analysis / Tags

### Azure Infrastructure

- Azure Container Apps
- Azure API Management
- Azure Blob Storage
- Azure Key Vault
- Azure User Assigned Managed Identity
- Azure Application Insights

### DevOps

- Docker
- Docker Compose
- GitHub Actions (CI/CD)

---

## Architecture

Repository structure:

```text
Kinetix
│
├── frontend
│   └── Next.js application
│
├── backend
│   ├── Express API
│   ├── Controllers
│   ├── Models
│   ├── Routes
│   ├── Middlewares
│   ├── Services
│   ├── Configuration and bootstrap
│   └── Swagger documentation
│
├── meilisearch
│   └── Search engine container
│
└── Docker Compose and GitHub Actions workflows
```

Production runtime architecture:

```text
Browser
  │
  ▼
Next.js Frontend (Azure Container Apps)
  │
  ▼
Azure API Management (API gateway)
  │
  ▼
Express Backend (Azure Container Apps)
  │
  ├── MongoDB Atlas ────────────── Products, users, sessions, orders
  ├── Meilisearch (Container App) ─ Search index / fallback
  ├── Azure AI Language ────────── Text key phrases
  ├── Azure AI Vision ──────────── Image tags
  ├── Azure Blob Storage ──────── Product images
  ├── Azure Key Vault ──────────── Application secrets
  └── Azure Application Insights ─ Telemetry and diagnostics

Backend ── User Assigned Managed Identity ──► Key Vault / Blob Storage
```

For local development, the frontend and backend are available through Docker Compose at `http://localhost:3000` and `http://localhost:3001` respectively.

---

## Azure Cloud Services

The production resources are deployed in **Switzerland North** under the `rg-kinetix` resource group.

| Service | Resource / Purpose |
| --- | --- |
| Azure Container Apps | `kinetix-frontend` — Next.js application |
| Azure Container Apps | `kinetix-backend` — Express REST API |
| Azure Container Apps | `kinetix-meilisearch` — product search index |
| Azure API Management | `kinetix-apimanagement` — managed API gateway |
| Azure Blob Storage | `kinetixstorage1` / `product-images` — uploaded product images |
| Azure Key Vault | `kinetix-keyvault` — application secrets |
| User Assigned Managed Identity | `kinetix-acr-identity` — Azure resource access |
| Azure AI Language | `kinetixLanguage` — key phrase extraction |
| Azure AI Vision | `kinetixVision` — image tag extraction |
| Azure Application Insights | `kinetix-insights` — monitoring and diagnostics |
| MongoDB Atlas | Cloud-hosted primary database (external to Azure resource group) |

### Image Upload Flow

1. An authenticated admin selects an image for a product.
2. The backend accepts a single JPEG, PNG, or WebP image, with a maximum size of **5 MB**.
3. The uploaded content is validated and sent to Azure Blob Storage using the backend Managed Identity.
4. The backend returns a public image URL, which can be associated with the product.
5. During product creation, Azure AI Vision can extract tags from the image URL.

The upload endpoint is `POST /api/admin/images/upload`, protected by admin authorization.

### Secret Management

Production secrets are loaded from Azure Key Vault during backend startup, before dependent services initialize. The configured secrets include MongoDB connection details, session secrets, Meilisearch credentials, Azure AI keys/endpoints, and the Application Insights connection string.

The backend uses its assigned Managed Identity to access Key Vault and Blob Storage. Some identity-provider configuration, including the Microsoft client secret, is managed separately through the Container App configuration.

### Monitoring

Application Insights collects backend request telemetry and enables troubleshooting through Azure Monitor Logs. The project has verified that telemetry is received; previously observed HTTP 500 responses should be investigated separately before treating production error rates as fully resolved.

---

## Intelligent Search

The search API supports text, image URLs, or a combination of both:

```http
GET /api/search?q=running%20shoes
GET /api/search?imageUrl=https%3A%2F%2Fexample.com%2Fshoe.jpg
GET /api/search?q=running%20shoes&imageUrl=https%3A%2F%2Fexample.com%2Fshoe.jpg
```

Search flow:

1. **Text analysis:** Azure AI Language extracts key phrases from the search query.
2. **Image analysis:** Azure AI Vision extracts descriptive tags from the provided image URL.
3. **Tag normalization:** The backend lowercases and deduplicates extracted terms.
4. **Primary lookup:** MongoDB searches products using the resulting tags.
5. **Fallback:** If MongoDB returns no matches, Meilisearch performs a text search (up to 12 results in the current search implementation).

The current implementation uses **MongoDB-first search with a Meilisearch fallback**, rather than simultaneous ranking or score fusion across both engines. If neither a query nor an image URL is supplied, the endpoint returns the product catalogue.

Azure AI Language is used for **Key Phrase Extraction**, not a trained intent-classification model.

---

## Security and Authentication

- Microsoft authentication is integrated into the application.
- Browser sessions use cookies and are persisted in MongoDB.
- Protected admin routes enforce authenticated sessions and the admin role.
- Azure API Management acts as the public API gateway.
- An API Management JWT-validation policy was separately tested with valid and missing tokens; its temporary test endpoints were removed after verification. The existing admin endpoints rely on the application's session-based authorization.
- Azure Key Vault stores application secrets; Managed Identity avoids embedding storage account keys in backend code.
- The image upload endpoint restricts file types, checks image signatures, and enforces a 5 MB limit.
- `.env` files and credentials must never be committed to the repository.

Security validation is ongoing: successful authentication and access-control tests do not replace a complete security assessment.

---

## Environment Variables

Local development uses a `.env` file in the project root. **Do not commit this file to GitHub.** The following values are placeholders, not working credentials:

```env
PORT=3001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kinetix?retryWrites=true&w=majority
SESSION_SECRET=replace_with_local_session_secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

MEILI_HOST=http://meilisearch:7700
MEILI_MASTER_KEY=replace_with_local_meilisearch_key

AZURE_LANGUAGE_ENDPOINT=https://your-language-resource.cognitiveservices.azure.com/
AZURE_LANGUAGE_KEY=replace_with_language_key
AZURE_VISION_ENDPOINT=https://your-vision-resource.cognitiveservices.azure.com/
AZURE_VISION_KEY=replace_with_vision_key
```

Depending on the authentication and storage flows being tested locally, additional Microsoft identity or Azure storage configuration may be required. Consult the corresponding backend configuration rather than using production credentials in local files.

For local development **outside Docker**, Meilisearch may be reachable at:

```env
MEILI_HOST=http://localhost:7700
```

Inside Docker Compose, use:

```env
MEILI_HOST=http://meilisearch:7700
```

In Azure production, the backend obtains its Key Vault secrets using Managed Identity and uses the cloud service endpoints configured for its Container App.

---

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git
- A MongoDB Atlas database
- A valid local `.env` file
- Access to Azure AI services for AI-dependent functionality

### Clone the Repository

```bash
git clone https://github.com/2026-BD/Kinetix.git
cd Kinetix
```

### Configure Environment

Create `.env` in the repository root using the placeholders above and replace them with development credentials. Never commit `.env`; only safe templates such as `.env.example` should be versioned.

### Start the Project

```bash
docker compose up --build
```

Or in detached mode:

```bash
docker compose up -d --build
```

---

## Available Services

### Local Development

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:3001` |
| Swagger UI | `http://localhost:3001/api-docs` |
| Meilisearch | `http://localhost:7700` |

### Azure Deployment

| Service | URL |
| --- | --- |
| Frontend | https://kinetix-frontend.icystone-4f68f29d.switzerlandnorth.azurecontainerapps.io |
| Backend | https://kinetix-backend.icystone-4f68f29d.switzerlandnorth.azurecontainerapps.io |
| API Management gateway | https://kinetix-apimanagement.azure-api.net/kinetix |

The Meilisearch Container App is a backend dependency; it is not documented as a public user-facing endpoint.

---

## API Documentation

The backend exposes Swagger documentation locally at:

```text
http://localhost:3001/api-docs
```

The documented API areas include authentication, products, baskets, and admin management. The application also includes search and image-upload endpoints:

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/search` | Search using `q` and/or `imageUrl` |
| POST | `/api/admin/images/upload` | Upload a product image (admin only) |

The public gateway base URL is `https://kinetix-apimanagement.azure-api.net/kinetix`. Endpoint availability through API Management depends on its configured operations and policies.

---

## CI Pipeline

The project includes a GitHub Actions CI workflow at `.github/workflows/ci.yml`, with triggers documented in the original project setup:

```text
push to master
pull request to master
manual workflow dispatch
```

The CI workflow checks the application environment by:

1. Checking out the repository.
2. Obtaining the temporary GitHub runner IP.
3. Temporarily allowing that IP in MongoDB Atlas Network Access.
4. Building and starting Docker containers.
5. Checking backend, Swagger, and frontend availability.
6. Running database verification.
7. Printing diagnostic logs when needed.
8. Stopping containers and removing the runner IP from Atlas Network Access.

### Required GitHub Secrets

The original CI configuration documents these repository secrets:

```text
MONGO_URI
SESSION_SECRET
MEILI_HOST
MEILI_MASTER_KEY
FRONTEND_URL
NODE_ENV
ATLAS_PUBLIC_KEY
ATLAS_PRIVATE_KEY
ATLAS_PROJECT_ID
AZURE_LANGUAGE_ENDPOINT
AZURE_LANGUAGE_KEY
AZURE_VISION_ENDPOINT
AZURE_VISION_KEY
```

Recommended CI environment values:

```env
MEILI_HOST=http://meilisearch:7700
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

The `ATLAS_*` secrets support temporary runner access to MongoDB Atlas and are not required for ordinary local development. Workflow secrets and triggers should be checked against the current YAML files when changing CI configuration.

---

## CD Pipeline

GitHub Actions also contains dedicated deployment workflows:

- `.github/workflows/deploy-backend.yml`
- `.github/workflows/deploy-frontend.yml`

These workflows deploy the application to **Azure Container Apps**. Their operation has been tested during the project. Exact deployment triggers, image tags, and credential requirements are defined by the workflow YAML files and should be reviewed there before making changes.

---

## Project Workflow

The project follows a structured GitHub workflow:

- Every task is documented through an Issue.
- Development is performed on dedicated branches.
- Pull Requests are used to merge changes.
- PRs are reviewed before merging.
- PRs are linked to issues using `Closes #ID`.
- CI validates the application before integration.

Recommended branch naming:

```text
issue-<ID>-<short-description>
```

Example:

```text
issue-12-admin-dashboard
```

---

## Useful Commands

### Start containers

```bash
docker compose up --build
```

### Start containers in background

```bash
docker compose up -d --build
```

### Stop containers

```bash
docker compose down
```

### Show backend logs

```bash
docker logs kinetix-app
```

### Show frontend logs

```bash
docker logs kinetix-frontend
```

### Run database verification

```bash
docker exec -it kinetix-app npm run verify-db
```

### Check Git status

```bash
git status
```

### Check production backend response

```bash
curl --ssl-revoke-best-effort -sS -o /dev/null \
  -w 'Backend HTTP: %{http_code}\n' \
  'https://kinetix-backend.icystone-4f68f29d.switzerlandnorth.azurecontainerapps.io/api/search'
```

The `--ssl-revoke-best-effort` option is useful on Windows systems where the certificate revocation service is temporarily unavailable. It does not disable all TLS certificate verification.

---

## Troubleshooting

### Backend does not start

Check backend logs:

```bash
docker logs kinetix-app
```

Common causes:

- Missing or invalid local `.env` variables.
- MongoDB Atlas connection restrictions.
- Missing `SESSION_SECRET`.
- Incorrect `MEILI_HOST` or Meilisearch credentials.
- Azure Key Vault access or Managed Identity configuration problems in production.

### Meilisearch invalid URL error

If you see `MeilisearchError: The provided host is not valid`, ensure `MEILI_HOST` includes the URL scheme. Inside Docker Compose use:

```env
MEILI_HOST=http://meilisearch:7700
```

Do not use `MEILI_HOST=meilisearch:7700`, or `http://localhost:7700` from inside a different Docker container.

### MongoDB connection timeout

Errors such as `MongoServerSelectionError`, `ReplicaSetNoPrimary`, or `products.find() buffering timed out` can indicate incorrect credentials, an unavailable cluster, or network access restrictions.

Check MongoDB Atlas Network Access and CI runner allowlisting. Avoid leaving `0.0.0.0/0` enabled: it permits connections from any IP and is not a safe default for production.

### Login does not persist session

Check backend CORS credentials, the frontend origin, cookie settings, and requests using:

```js
credentials: "include"
```

For local development, check:

```env
FRONTEND_URL=http://localhost:3000
```

### Admin link does not appear

Confirm that the user has the admin role:

```json
{
  "role": "admin"
}
```

Then log out and log in again.

### Image upload fails

- Confirm that the user is authenticated as an admin.
- Upload a JPEG, PNG, or WebP image no larger than 5 MB.
- Verify the Blob Storage container and Managed Identity role assignment.
- Check backend logs and Application Insights for the specific request.

### Key Vault secrets are not loaded

Check that the backend's User Assigned Managed Identity is attached to the Container App, has permission to read secrets, and is selected by the backend credential configuration.

### Application Insights reports failures

Use Azure Monitor Logs to inspect HTTP status codes and failed requests. Authentication tests can produce expected `401` responses, while `500` responses require investigation.

---

## Benchmarks and Verification

The repository includes a database verification script:

```bash
docker exec -it kinetix-app npm run verify-db
```

The following checks were performed during development and cloud deployment:

| Test | Objective | Result |
| --- | --- | --- |
| Docker startup | Build and run local containers | Implemented in CI |
| Backend availability | Verify Azure-hosted search endpoint | HTTP 200 observed |
| Frontend availability | Verify Azure-hosted frontend | HTTP 200 observed |
| Swagger check | Verify local API documentation | Implemented in CI |
| MongoDB connectivity | Verify primary database access | Confirmed in backend logs |
| Meilisearch initialization | Initialize and index products | 23 products indexed in observed logs |
| Microsoft login and sessions | Authenticate and retain session | User-tested successfully |
| Basket and checkout | Manage basket and complete payment flow | User-tested successfully |
| Order persistence | Save and display completed orders | User-tested successfully |
| Blob image upload | Store product images in Azure | User-tested successfully |
| Azure AI Vision | Generate tags and search from image URLs | User-tested successfully |
| Azure AI Language | Extract text search phrases | User-tested successfully |
| API Management | Gateway access and JWT policy test | Verified; temporary JWT test routes removed |
| Admin authorization | Reject anonymous admin image upload | HTTP 401 observed |
| Key Vault / Managed Identity | Load secrets and access Blob Storage | Verified in deployment |
| Application Insights | Receive backend telemetry | Verified; failures still require analysis |
| GitHub Actions deployment | Deploy frontend and backend to Azure | User-confirmed working |
| Git working tree | Confirm no pending local changes | Clean at time of check |

A previous 24-hour Application Insights query returned **75 requests**, an **85.3 ms average duration**, and **28 failed requests** (including 401, 400, 404, and eight HTTP 500 GET responses). This is a historical diagnostic snapshot, **not** a current performance benchmark or a claim that all failures are resolved.

---

## AI Usage Disclosure

Generative AI tools were used during development to support:

- Code generation and refactoring.
- Debugging and troubleshooting.
- API design.
- Documentation and README updates.
- CI/CD troubleshooting.
- Explanation of technical concepts.

All AI-generated suggestions were reviewed, adapted, and integrated by the project contributors.

---

## Authors

- **C4MRS** — Developer
- **Y1lion** — Developer
