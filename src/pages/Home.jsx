// =============================================================================
// Practical 2: React State Management and Multi-Page Navigation
// File: src/pages/Home.jsx
// Description: Home page route (/) composing Header, About, and Skills components
// =============================================================================

import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';

function Home() {
  const student = {
    name: 'Max Patel',
    rollNo: '24IT070',
    title: 'B.Tech Information Technology Student',
    university: 'Charusat University',
    bio: 'Hello! I am Max Patel, a 3rd-year B.Tech Information Technology student at Charusat University (Roll No: 24IT070). I am passionate about learning modern web development frameworks, mastering React component architecture, and engineering robust, user-friendly digital applications.',
    email: '24it070@charusat.edu.in'
  };

  const skillsData = [
    'HTML5 & Modern CSS3',
    'JavaScript (ES6+)',
    'React.js & JSX',
    'React Router v6/v7',
    'Node.js & Express.js',
    'MongoDB & Mongoose',
    'RESTful API Development',
    'Git & GitHub Version Control',
    'Python Programming',
    'Relational SQL / Database Systems'
  ];

  return (
    <div className="home-page">
      <Header
        name={student.name}
        title={student.title}
        themeColor="#1e3a8a"
        showNav={false}
      />

      <main className="main-content">
        <About
          name={student.name}
          bio={student.bio}
          rollNo={student.rollNo}
          degree={student.title}
          university={student.university}
          email={student.email}
        />

        <Skills skillList={skillsData} />
      </main>
    </div>
  );
}

export default Home;
