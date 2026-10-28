// =============================================================================
// Practical 1: Introduction to React and Component Architecture
// File: src/components/Projects.jsx
// Description: Projects component displaying exactly three sample student projects
//              rendered dynamically using .map() with reusable cards and stable keys.
//              Post-laboratory requirement for Practical 1.
// =============================================================================

function Projects({ projects }) {
  // Exactly three sample projects as mandated by Practical 1 post-lab requirements
  const defaultProjects = [
    {
      id: 1,
      title: 'Task Management REST API',
      description: 'A modular backend REST API built with Node.js, Express, and MongoDB Mongoose. Implements CRUD operations, middleware validation, and schema constraints.',
      tags: ['Node.js', 'Express', 'MongoDB', 'Mongoose']
    },
    {
      id: 2,
      title: 'Daily Expense Tracker',
      description: 'A responsive single-page web application to record, organize, and monitor personal spending with dynamic category totals and budget alerts.',
      tags: ['React', 'JavaScript', 'CSS3', 'Vite']
    },
    {
      id: 3,
      title: 'Student Performance Analytics Dashboard',
      description: 'An interactive web portal visualizing student academic performance, attendance metrics, and grade trends with clean data charts.',
      tags: ['React', 'Chart.js', 'REST API', 'JavaScript']
    }
  ];

  const projectList = projects && projects.length === 3 ? projects : defaultProjects;

  return (
    <section id="projects" className="section projects-section" aria-labelledby="projects-heading">
      <div className="section-title-wrap">
        <h2 id="projects-heading" className="section-title">Sample Projects</h2>
        <div className="title-underline"></div>
      </div>

      <p className="section-intro">
        Three representative student projects dynamically rendered using <code>.map()</code> with stable keys:
      </p>

      <div className="projects-grid">
        {projectList.map((project) => (
          <article key={project.id} className="project-card">
            <div className="project-number">Project 0{project.id}</div>
            <h3 className="project-name">{project.title}</h3>
            <p className="project-desc">{project.description}</p>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projects;
