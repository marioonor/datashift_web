# GRC Gap Analysis Automation Tool - Frontend

This is the Angular-based frontend application for the GRC Gap Analysis Automation Tool. It provides a user interface for clients and administrators to interact with the backend Java Spring Boot application for document submission, keyword management, and viewing analysis results.

## Overview

This Angular application allows users to:

* **Securely Upload Documents:** Clients can easily upload PDF documents for compliance scanning.
* **Manage Keywords:** Administrators can define, view, and modify the keywords used by the backend for gap analysis.
* **View Scan Results:** Users can review the extracted evidence and potential compliance gaps identified by the backend.
* **Generate Reports:** Initiate the generation and download reports summarizing the analysis.
* **User Authentication and Authorization:** Secure access control for different user roles.

## Technologies Used

* **Angular:** A TypeScript-based web application framework.
* **TypeScript:** A typed superset of JavaScript.
* **Angular CLI:** Command-line interface for Angular development.
* **HTML:** For structuring the web pages.
* **CSS:** For styling the user interface.
* **Angular Material:** (If used) A UI component library implementing Material Design.
* **RxJS:** For handling asynchronous operations.
* **RESTful API Communication:** Interacts with the backend Java Spring Boot API.

## Getting Started

### Prerequisites

* **Node.js and npm (or yarn):** Ensure you have Node.js and npm (Node Package Manager) or yarn installed on your system. Angular CLI requires Node.js. You can download it from [https://nodejs.org/](https://nodejs.org/).
* **Angular CLI:** Install the Angular CLI globally using npm or yarn:
    ```bash
    npm install -g @angular/cli
    # or
    yarn global add @angular/cli
    ```

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone <frontend_repository_url>
    cd <frontend_directory>
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Development Server

Run the development server to preview the application locally:

```bash
ng serve -o
# or
yarn start
