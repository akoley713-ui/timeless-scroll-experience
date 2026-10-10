# TIMELESS — ATELIER / 01

**An immersive luxury watch experience, built around time, motion, and precision.**

TIMELESS is a premium watch showcase website featuring scroll-driven frame-by-frame animation, elegant typography, and a minimal luxury-inspired interface. As visitors scroll, the watch transitions through a sequence of images to create an interactive product storytelling experience.

## ✨ Features

- **Scroll-Driven Animation** — Frame-by-frame watch animation controlled by scrolling.
- **Premium UI** — Minimal, luxury-inspired design with glassmorphism.
- **Interactive Storytelling** — Dynamic content transitions across four storytelling stages.
- **Responsive Design** — Adapted for desktop and mobile screens.
- **Optimized Frame Loading** — Keyframe caching and nearby-frame preloading.
- **Scroll Progress Indicator** — Visual feedback linked to the scrolling experience.
- **Reveal Animations** — Sections animate into view as visitors explore the page.
- **Private Viewing Form** — Client-side email validation for viewing requests.

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- HTML Canvas API
- Intersection Observer API

## 📁 Project Structure

```text
timeless-scroll-experience/
├── index.html
├── style.css
├── script.js
├── README.md
└── frames/
    ├── ezgif-frame-001.jpg
    ├── ezgif-frame-002.jpg
    ├── ezgif-frame-003.jpg
    └── ...
```

## 🚀 Getting Started

1. Clone this repository:

   ```bash
   git clone https://github.com/akoley713-ui/timeless-scroll-experience.git
   ```

2. Open the project folder.

3. Ensure the numbered JPG frames are placed inside the `frames/` directory.

4. Open `index.html` using VS Code with the Live Server extension, or deploy the project using GitHub Pages.

## 🎞️ Animation Setup

The animation uses numbered JPG images loaded into an HTML Canvas element.

Expected filename format:

```text
ezgif-frame-001.jpg
ezgif-frame-002.jpg
ezgif-frame-003.jpg
...
ezgif-frame-300.jpg
```

The frame count and image paths are configured in `script.js`. Update the `TOTAL` value to match the actual number of uploaded frames.

## 📱 Responsive Experience

The website adapts its canvas rendering and frame progression for smaller screens to provide a smooth product-viewing experience across devices.

## 🔮 Future Improvements

- High-resolution product photography
- Further image-loading optimizations
- Functional backend integration for private viewing requests
- Additional product references and detailed specifications
- Performance improvements for mobile devices

## 👨‍💻 Author

**Abhijit Koley**

B.Tech CSE Student | Web Development | C++ & DSA

## 📄 License

This project is intended for learning, experimentation, and portfolio development. Add a formal license if you plan to distribute or reuse the project.

---

*TIMELESS — Every second tells a story.*
