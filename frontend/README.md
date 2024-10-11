# 📰 Newswell Frontend 🎨 

The NEWSWELL project aims to develop a working website with Generative AI (GenAI) incorporated to format and generate content within a single front-page template for a newspaper, intended for both digital and physical publication. The project also enables the conversion of the website into an editable InDesign file, which is saved within the user’s local files.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Frontend Flow](#frontend-flow)
- [Approaches for Frontend Development](#approaches-for-frontend-development)
- [Packages Used](#packages-used)
- [Best Practices](#best-practices)

## Overview

Newswell is built with React, utilizing a component-based architecture that allows for modular and reusable code. The application provides features such as layout management, article editing, image handling, and PDF generation.

### Consolidated Front-End Flow

![Consolidated Front-End Flow](./src/assets/Newswell-%20consolidated%20front%20end%20flow.png)

[Link to image for better clarity](https://drive.google.com/file/d/1pas_DBpZcXJ0s_frwl3vjFDkrtO9IxE8/view?usp=sharing)

### Initialize Layout

![Initialize Layout](./src/assets/Initialise%20Layout.png)

[Link to image for better clarity](https://drive.google.com/file/d/1UhwUrCZtWdlA9OgfivtWk1aJQ-BbTOlh/view?usp=drive_link)


### Edit Article

![Edit Article](./src/assets/Newswell-%20Edit%20Article.png)
[Link to image for better clarity](https://drive.google.com/file/d/17hVvp4k9KZAKTawKyun3N8X1sL-wqbAy/view?usp=drive_link)

### Update Layout

![Update Layout](./src/assets/Newswell-%20Update%20layout.png)
[Link to image for better clarity](https://drive.google.com/file/d/1IPHBl-rprrw7q3wq7_OwdsbIPb3E-yJU/view?usp=drive_link)


### Edit Image

![Edit Image](./src/assets/Newswell-%20Edit%20Image.png)
[Link to image for better clarity](https://drive.google.com/file/d/1djnx8X6Y1rfaODcaKjyEFX4kvOH37TNU/view?usp=drive_link)


### Create PDF

![Create PDF](./src/assets/Newswell-%20Create%20PDF.png)

[Link to image for better clarity](https://drive.google.com/file/d/1iWs4Kn0dGJeBriuE7tjdTYNO2JMAieJL/view?usp=drive_link)


## Installation

To run this project locally, follow these steps:

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/ASUCICREPO/Newswell
    cd frontend
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Start the development server**:

    ```bash
    npm run dev
    ```

4.  **Open your browser** and navigate to `http://localhost:3000` or `http://127.0.0.1:5173/` to see the application in action.

## Usage

The application allows users to create and manage newspaper layouts, edit articles, upload images, and generate PDFs. Users can interact with the interface to customize their content and save their work.

## Frontend Flow

1. **Initialized Layout**: The app initializes the layout upon startup.
2. **Edit Layout**: Users can update the layout as needed.
3. **Edit Articles**: Drill down into specific articles for editing.
4. **Edit Images**: Modify images associated with articles.
5. **Create PDF**: Generate a PDF of the current layout.

## Approaches for Frontend Development

1. **React and Component-based Architecture**: Utilized React's component-based architecture for modularity and reusability.
2. **Context API and State Management**: Managed state using React Context API for efficient data sharing across components.
3. **Reusable Components**: Developed components like `EditableField`, `HoverText`, and `ImageUploader` for consistent functionality across the application.
4. **Modular Structure**: Organized code into modules for clarity and maintainability.
5. **Functional Components and Hooks**: Employed functional components with hooks like `useState` and `useEffect` for state management.

## Packages Used

- `@emotion/react` & `@emotion/styled`: For writing styled components.
- `@mui/icons-material` & `@mui/material`: For prebuilt icons and UI components.
- `@uidotdev/usehooks`: For undo/redo functionality.
- `axios`: For API calls.
- `dotenv`: For managing environment variables.
- `file-saver`: To save files locally.
- `html2pdf.js`: To convert HTML to PDF.
- `jszip`: To zip files.
- `react-draggable` & `react-easy-crop`: For image manipulation.
- `react-toastify`: For displaying notifications.

## Best Practices

1. **Separation of Concerns**: Clear division of responsibilities among components.
2. **Error Handling and Feedback**: Robust error handling with user feedback via toast notifications.
3. **Performance Optimization**: Memoization of components to prevent unnecessary re-renders.
4. **Consistent Styling with Material-UI**: Used Material-UI for a cohesive design language throughout the application.

### With these instructions, your Newswell backend should be up and running in no time! 🎉🚀
