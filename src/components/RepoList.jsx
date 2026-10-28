// =============================================================================
// Practical 3: API Integration and Data Rendering in React
// File: src/components/RepoList.jsx
// Description: Renders list of GitHub repositories dynamically using .map()
//              displaying name, description, URL, stars, and language
// =============================================================================

function RepoList({ repos = [] }) {
  if (repos.length === 0) {
    return (
      <div className="empty-results-box">
        <span className="empty-icon" aria-hidden="true">🔍</span>
        <h3 className="empty-title">No Repositories Found</h3>
        <p className="empty-desc">
          No repositories matched your search query. Try typing a different keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="repo-grid">
      {repos.map((repo) => (
        <article key={repo.id} className="repo-card">
          <div className="repo-card-header">
            <h3 className="repo-title">
              <span className="repo-icon" aria-hidden="true">📁</span>
              <span className="repo-name-text">{repo.name}</span>
            </h3>
            <span className="star-badge" title={`${repo.stargazers_count} stars on GitHub`}>
              ⭐ {repo.stargazers_count}
            </span>
          </div>

          <p className="repo-description">
            {repo.description || 'No description provided for this repository.'}
          </p>

          <div className="repo-meta-footer">
            <span className="repo-lang-tag">
              <span className="lang-dot" aria-hidden="true"></span>
              {repo.language || 'General'}
            </span>

            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="repo-external-link"
              title={`View ${repo.name} on GitHub`}
            >
              View on GitHub ↗
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

export default RepoList;
