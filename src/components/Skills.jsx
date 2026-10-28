// =============================================================================
// Practical 1: Introduction to React and Component Architecture
// File: src/components/Skills.jsx
// Description: Skills component accepting skillList via props and dynamically
//              rendering skills with .map() and unique keys in a responsive layout.
// =============================================================================

function Skills({ skillList = [] }) {
  const fallbackSkills = [
    'HTML5 & Modern CSS3',
    'JavaScript (ES6+)',
    'React.js & JSX',
    'Node.js & Express.js',
    'MongoDB & Mongoose',
    'RESTful API Development',
    'Git & GitHub Version Control',
    'Python Programming',
    'Relational SQL / Database Systems'
  ];

  const displayList = skillList.length > 0 ? skillList : fallbackSkills;

  return (
    <section id="skills" className="section skills-section" aria-labelledby="skills-heading">
      <div className="section-title-wrap">
        <h2 id="skills-heading" className="section-title">Technical Skills</h2>
        <div className="title-underline"></div>
      </div>

      <p className="section-intro">
        Programming languages, frameworks, and tools rendered dynamically from props using <code>.map()</code>:
      </p>

      <ul className="skills-list">
        {displayList.map((skill, index) => (
          <li key={typeof skill === 'string' ? skill : `skill-${index}`} className="skill-item">
            <span className="skill-check" aria-hidden="true">✓</span>
            <span className="skill-text">{skill}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
