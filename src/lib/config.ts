export function getGitHubConfig() {
  return {
    owner: process.env.GITHUB_OWNER!,
    repo: process.env.GITHUB_REPO || "loom",
    branch: process.env.GITHUB_BRANCH || "main",
    libraryPath: process.env.GITHUB_LIBRARY_PATH || "library",
  };
}
