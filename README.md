# Nasa-Data-Explorer

# 🚀 NASA Data Explorer (AI Enhanced) 🚀

This is a full-stack web application that provides an interactive and AI-enhanced experience for exploring NASA's open APIs. It features a React frontend that communicates with a secure Node.js/Express backend.

 
*(Suggestion: Take a screenshot of your running application and upload it to a site like [Imgur](https://imgur.com/upload) to get a URL you can paste here.)*

## Table of Contents

- [Features](#-features)
- [How to Use the Application](#-how-to-use-the-application)
- [Prerequisites](#-prerequisites)
- [Local Setup and Installation](#-local-setup-and-installation)
- [Running the Application](#-running-the-application)
- [Running Tests](#-running-tests)
- [Tech Stack](#️-tech-stack)

## ✨ Features

*   **Astronomy Picture of the Day (APOD):** View NASA's daily featured image or video and use the **date picker** to explore past entries.
*   **AI-Powered Mars Rover Search:** Use natural language to search for photos (e.g., *"show me curiosity photos from sol 1500"*).
*   **AI-Analyzed Asteroid Chart:** An interactive chart of Near-Earth Objects, complete with an AI-generated summary of the week's most interesting data.
*   **Interactive Chatbot:** A friendly AI bot that can answer questions about the application's features.
*   **Polished User Experience:** Includes a "Back to Top" button, a high-resolution image lightbox, smooth page animations, and a fully responsive design.

## 🕹️ How to Use the Application

Once the application is running, you can explore its features:

1.  **Picture of the Day:** The homepage displays today's picture. Use the date picker at the top to select a different day.
2.  **Mars Rover:** Navigate to the "Mars Rover" page. Type a query into the AI search bar and press Enter. Click on any photo to view it in a full-screen lightbox. Use the "Sort by" dropdown to reorder the results.
3.  **Asteroids:** Go to the "Asteroids" page to see the chart. Read the AI analysis for a quick summary. Click on any dot in the chart to open a Google search for that asteroid.
4.  **Chatbot:** Click the chat icon in the bottom-right corner to open the chatbot. Ask it questions like "tell me about mars" or "what is apod?".

## ✅ Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js:** Version 16.x or newer. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm:** This is the Node Package Manager and comes bundled with Node.js.
*   **NASA API Key:** This is **required**. You can get a free key instantly from [api.nasa.gov](https://api.nasa.gov/).

## ⚙️ Local Setup and Installation

Follow these steps to set up the project on your local machine.

### 1. Clone the Repository

First, clone this repository to your local machine using Git:

```bash
git clone [URL_OF_YOUR_GIT_REPOSITORY]
cd [REPOSITORY_FOLDER_NAME]