// =============================================================================
// Practical 3: API Integration and Data Rendering in React
// File: src/pages/Projects.jsx
// Description: Projects page fetching live GitHub repositories using useEffect
//              and managing repos, loading, error, and search state with useState.
// =============================================================================

import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import RepoList from '../components/RepoList';

// GitHub username matching student's account
const GITHUB_USERNAME = 'max7199';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`;

function Projects() {
  // Required State Variables (Practical 3)
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search Filter State
  const [search, setSearch] = useState('');

  // Reusable API Fetch Function
  const fetchRepos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GITHUB_API_URL);
      if (!response.ok) {
        throw new Error(
          `Failed to load repositories from GitHub (HTTP Status: ${response.status} ${response.statusText})`
        );
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Unexpected data format received from GitHub API.');
      }
      setRepos(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while fetching repositories.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect Hook: Triggers API request once when component mounts
  useEffect(() => {
    fetchRepos();
  }, []);

  // Filter repositories dynamically by name (case-insensitive)
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container projects-page">
      <div className="page-header">
        <div className="page-badge">Practical 3 &bull; REST API Integration</div>
        <h1 className="page-title">GitHub Projects &amp; Repositories</h1>
        <p className="page-subtitle">
          Dynamically fetched from the public GitHub REST API for{' '}
          <strong>@{GITHUB_USERNAME}</strong> using React <code>useState</code> and{' '}
          <code>useEffect</code>.
        </p>
      </div>

      {/* 1. Loading State */}
      {loading && <Spinner />}

      {/* 2. Error State with Retry Button */}
      {!loading && error && (
        <ErrorMessage message={error} onRetry={fetchRepos} />
      )}

      {/* 3. Success State: Search Box & Dynamic Repositories List */}
      {!loading && !error && (
        <>
          {/* Search Controls */}
          <div className="search-bar-container">
            <div className="search-input-wrapper">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                id="search-input"
                type="text"
                className="search-input"
                placeholder="Search repositories by name (e.g. project, sem, fault)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search repositories by name"
              />
              {search && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearch('')}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="search-stats">
              <span>
                Showing <strong>{filteredRepos.length}</strong> of <strong>{repos.length}</strong> repositories
              </span>
            </div>
          </div>

          {/* Dynamic Repository List */}
          <RepoList repos={filteredRepos} />
        </>
      )}
    </div>
  );
}

export default Projects;
