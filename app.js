const octokit = require('@octokit/rest')();
const async   = require('async');
const TEAMS   = [
	{ id: 234666,  name: "Owners-Original",        perm: "admin" },
	{ id: 2764634, name: "Infrastructure",         perm: "admin" },
	{ id: 675923,  name: "continuous-integration", perm: "push"  },
	{ id: 442273,  name: "Code Review Team",       perm: "push"  },
	{ id: 242867,  name: "Everyone",               perm: "pull"  }
];

/**
 * Creates a new repo in GitHub with some predefined settings if it doesn't already exist
 * 
 * @param {string} repo - repo name
 * @returns {Promise} - GitHub response
 * @throws Throws an error if GitHub fails to create the repo for any reason other than it already existing
 */
async function createRepo(repo) {
	try {
		const result = await octokit.repos.createForOrg({
			org: 'someorg',
			name: repo,
			private: true,
			has_issues: true,
			has_projects: false,
			auto_init: true
		});
		console.log(`Repo: "someorg/${repo}" has been created.`);
		return result;

	} catch (e) {
		e = JSON.parse(e.message);
		const msg = `Error: ${e.message} ${e.errors[0].message}`;
		if (!msg.includes('already exists')) {
			throw new Error(msg);
		}
	}
}

/**
 * Main application logic
 */
async function main() {
	// environment variables.
	const { GH_KEY, REPO } = process.env;

	// Set up github authentication
	// Alters octokit to include auth headers in subsequent requests
	octokit.authenticate({
		type: 'basic',
		username: GH_KEY,
		password: 'x-oauth-basic'
	});

	await createRepo(REPO);
}
/**
 * Run async and trap errors
 */
main()
	.then(() => {
		console.log('job tasks completed');
	})
	.catch((e) => {
		console.log(e);
		process.exitCode = 1;
	});
