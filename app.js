// Get the DOM nodes
let github = document.querySelector("#github");

Promise.all([
  fetch("https://api.github.com/users/b0esium"),
  fetch("https://api.github.com/users/b0esium/repos?sort=pushed"),
])
  .then(function (responses) {
    return Promise.all(
      responses.map(function (response) {
        return response.json();
      })
    );
  })
  .then(function (data) {
    console.log(data);
    render(data);
  })
  .catch(function (error) {
    console.warn(error);
  });

/**
 * Render the UI
 * @param  {Object} data The GitHub data
 */
function render(data) {
  // Get variables from the data
  let [profile, repos] = data;

  repos.sort(function (repo1, repo2) {
    if (repo1.stargazers_count > repo2.stargazers_count) {
      return -1;
    }
    return 1;
  });

  repos = repos.slice(0, 5);

  github.innerHTML = `<div class="gh-grid">
			<div class="gh-avatar">
				<p><img alt="" src="${profile.avatar_url}"></p>
			</div>
			<div class="gh-details">
				<p>
					<strong>${profile.login}</strong><br>
					${profile.created_at}<br>
					<em><a href="${profile.repos_url}">${profile.public_repos} public repos</a></em>
				</p>
        <ul>
					${repos
            .map(function (repo) {
              return `<li><a href="${repo.html_url}">${repo.name}</a> - ${repo.stargazers_count} Stars</li>`;
            })
            .join("")}
				</ul>
			</div>
		</div>`;
}
