# Romanus Ang'ina's Portfolio Website
This project is a personal portfolio website built using Next.js, showcasing projects, research, and leadership experiences.  The website features a visually appealing design with interactive elements and smooth animations.

## Features
*   **Responsive Design:** Adapts seamlessly to different screen sizes and devices.
*   **Interactive 3D Point Cloud Profile:**  A visually engaging profile element built with Three.js.
*   **Smooth Animations:** Uses GSAP for smooth and elegant animations on scroll and hover.
*   **Cursor Glow:**  Features a custom cursor glow effect for enhanced user interaction.
*   **Sections:**  Organized into distinct sections for About, Projects, Leadership, and Research (currently only About, Projects, and Leadership are implemented).
*   **Project and Leadership Details:**  Provides detailed information on past projects and leadership roles with links to repositories and websites.
*   **Resume Download:**  Offers a direct download link for a resume (PDF).
*   **Social Media Links:**  Includes links to GitHub and LinkedIn profiles.
*   **Smooth Scrolling:** Uses GSAP's ScrollToPlugin for smooth navigation between sections.

## Usage
1.  Clone the repository:
    ```bash
    git clone https://github.com/romanus-angina/portfolio.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd portfolio-website
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Installation
1.  Clone the repository using Git:
    ```bash
    git clone <repository_url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd <project_directory>
    ```
3.  Install dependencies using npm or yarn:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

## Technologies Used
*   **Next.js:** React framework for building user interfaces and server-side rendering. Used for the overall website structure and routing.
*   **React:** JavaScript library for building user interfaces. Used for creating components and managing the website's interactive elements.
*   **Three.js:** JavaScript 3D library. Used for creating the interactive 3D point cloud profile.
*   **GSAP (GreenSock Animation Platform):** JavaScript animation library. Used for creating smooth animations and transitions throughout the website.
*   **React Icons:** Provides SVG icons for social media links and other elements.
*   **Node.js:** JavaScript runtime environment. Used for running the Next.js development server and build process.
*   **npm (or yarn):** Package manager for Node.js. Used for managing project dependencies.
*   **HTML & CSS:**  Standard web technologies for structuring and styling the website's content and layout.

## Dependencies
```json
{
  "dependencies": {
    "@react-three/drei": "^9.88.17",
    "@react-three/fiber": "^8.15.11",
    "@swc/helpers": "^0.5.15",
    "gsap": "^3.12.7",
    "next": "^13.5.8",
    "react": "^18",
    "react-dom": "^18",
    "react-icons": "^4.12.0",
    "three": "^0.157.0"
  },
  "devDependencies": {
    "eslint": "^8",
    "eslint-config-next": "13.5.4",
    "gh-pages": "^6.0.0"
  }
}
```

## Contributing
Contributions are welcome! Please feel free to open issues or submit pull requests.

## Testing
No formal testing framework is currently implemented.  Testing could be added using Jest or another suitable framework.

*README.md was made with [Etchr](https://etchr.dev)*