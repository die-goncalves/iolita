/** @type {import("@changesets/types").ChangelogFunctions} */
const functions = {
	getReleaseLine: (changeset, type, changelogOpts) => {
		const [firstLine, ...futureLines] = changeset.summary
			.split('\n')
			.map(line => line.trimEnd())

		const full = changeset.commit
		const short = full?.slice(0, 7)
		const repo = changelogOpts?.repo

		const ref = !short
			? ''
			: repo
				? `[\`${short}\`](https://github.com/${repo}/commit/${full}) - `
				: `\`${short}\` - `

		let returnVal = `- ${ref}${firstLine}`

		if (futureLines.length > 0) {
			returnVal += `\n${futureLines.map(l => `  ${l}`).join('\n')}`
		}

		return returnVal
	},
	getDependencyReleaseLine: (
		changesets,
		dependenciesUpdated,
		changelogOpts
	) => {
		if (dependenciesUpdated.length === 0) return ''

		const repo = changelogOpts?.repo

		const changesetLink = `- Updated dependencies [${changesets
			.map(changeset => {
				const full = changeset.commit
				if (!full) return null

				const short = full.slice(0, 7)

				return repo
					? `[\`${short}\`](https://github.com/${repo}/commit/${full})`
					: `\`${short}\``
			})
			.filter(Boolean)
			.join(', ')}]:`

		const updatedDependenciesList = dependenciesUpdated.map(
			dependency => `  - ${dependency.name}@${dependency.newVersion}`
		)

		return [changesetLink, ...updatedDependenciesList].join('\n')
	}
}

export default functions
