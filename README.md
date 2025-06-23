# Technologies and Service Design

This chapter presents the technologies used in the development of the project, as well as the design decisions made during the implementation of the application.

### 5.1. Technologies Used

#### 5.1.1. Next.js and React

!\[Next.js Logo]\(Figure 10)

Next.js is a React framework for building full-stack web applications. It supports server-side rendering, which enhances SEO and overall performance. It also includes features like the App Router, allowing the creation of API routes without a separate backend server.

React provides modularization through reusable components, facilitating maintenance and scalability. Next.js was chosen for its streamlined deployment process and efficient routing system.

#### 5.1.2. PostgreSQL

!\[PostgreSQL Logo]\(Figure 11)

PostgreSQL is a robust, open-source relational database management system. It supports standard SQL and has a long-standing reputation for reliability and performance.

#### 5.1.3. Tailwind and Figma

!\[Tailwind and Figma Logos]\(Figure 12)

Tailwind is a utility-first CSS framework that enables fast and responsive design directly within HTML. Figma is a vector-based design and prototyping tool used to create reusable UI elements, which can be exported to HTML to speed up the design workflow.

#### 5.1.4. Leaflet

!\[Leaflet Map]\(Figure 13)

Leaflet is an open-source JavaScript library for embedding interactive maps from OpenStreetMap. It includes features like markers, routes, and custom layers, and integrates well with React. It avoids the need for proprietary map services or API keys.

#### 5.1.5. Additional Libraries

Several additional libraries were used to support specific features:

* **Quill**: for rich-text editing fields.
* **MUI**: for streamlined creation of styled UI components.
* **Swiper**: for implementing information carousels.
* **DND-kit**: for drag-and-drop functionality.

#### 5.1.6. Git and GitHub

Git is a version control system for tracking code changes. GitHub is a cloud-based platform for hosting Git repositories. Both tools are essential for collaborative development and version tracking.

### 5.2. Service Design

The service follows a client-server architecture, illustrated in the following diagram (Figure 14).

!\[Service Design Diagram]\(Figure 14)

Users access the application through their browsers, which run the front-end. The front-end communicates with the server via HTTP, exchanging data in JSON format.

The server handles both API logic and database operations on the same machine. This monolithic setup simplifies deployment, minimizes latency, and enhances availability by reducing external dependencies.

This architecture balances performance, simplicity, and cost, making it well-suited to the project's goals.

