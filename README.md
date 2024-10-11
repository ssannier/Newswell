# 📰 Newswell Project

Welcome to the Newswell Project! 🎉 This project is designed to create a fully functional web application for newspaper layout generation, incorporating Generative AI to format and generate content for both digital and physical publications. The application also allows conversion to an editable InDesign file for local saving. 💻📰

## 📜 Table of Contents
- [Introduction]()
- [Backend Deployment]()
- [Frontend Setup]()
- [Useful Links]()

## 💡 Introduction

The Newswell Project consists of two main parts:

- Backend: Built using AWS CDK, it manages the serverless functions, API endpoints, and storage for handling data, summaries, titles, and images.
- Frontend: Developed with React, this part focuses on the user interface, layout management, article editing, image uploads, and PDF creation.

## ✨ Key Features:

- Easy article editing and layout management.
- Generative AI for title and summary generation.
- Support for image uploads, edits, and PDF generation.
- Generates an editable InDesign file for final layouts.

## 🚀 Ready to deploy? Let’s go!

### ⚙️ Backend Deployment

The backend is built with AWS CDK and contains all the logic for managing data and processing requests. Follow these steps to deploy the backend:

#### Clone the repository:

```bash
git clone https://github.com/ASUCICREPO/Newswell.git
cd backend
```

Install AWS CDK and other dependencies as outlined in the [backend README](./backend/README.md).

Update the bucket name in the cdk.json file to ensure uniqueness.

#### Deploy the stack by following the instructions in the backend README:

```bash
cdk deploy
```

This will create the necessary resources like S3 buckets, Lambda functions, API Gateway, and IAM roles. For more detailed instructions, check out the [backend README](./backend/README.md).

### 🎨 Frontend Setup

Once the backend is successfully deployed, it's time to set up the frontend!

#### Navigate to the frontend folder:

```bash
cd ../frontend
```

#### Install the required dependencies by running:


```bash
npm install
```
#### Start the development server:

```bash
npm run dev
```

Open your browser and go to http://localhost:3000 to see the application in action.

The frontend offers a sleek interface for managing newspaper layouts, editing articles, and generating PDFs. Follow the detailed steps provided in the [frontend README](./frontend/README.md) for full setup and usage instructions.

### 🛠 Useful Links

- [Backend README](./backend/README.md) – Backend deployment and setup details.
- [Frontend README](./frontend/README.md) – Frontend setup and user guide.
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/cli.html)
- [React Documentation](https://react.dev/)

## 📝 Pro Tip:

Make sure to deploy the backend before working on the frontend! 🛠️ This ensures that all the API endpoints and Lambda functions are live and ready for your frontend to interact with.

## Happy coding and building with Newswell! 💻📰✨

