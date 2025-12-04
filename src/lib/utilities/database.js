export const getGraphs = graphset => graphset.graphs;

export const getTitle = graphset => graphset.title;

export const isEnabled = graphset => graphset.enabled;

export const getAllCharacters = graphset => {
	const graphs = getGraphs(graphset);
	const characters = graphs.map(graph => graph.character);
	return [...new Set(characters)];
};

export const findGraphSetByTitle = (db, title) => {
	return db.graphSets.find(gs => getTitle(gs) === title);
};

export const getRandomGraph = (graphs, randomFn = Math.random) => {
	const randomIndex = Math.floor(randomFn() * graphs.length);
	return graphs[randomIndex];
};

export const getImagePath = graph => {
	// The img field now contains the full relative path
	// e.g., "Joscelyn/joscelyn-min-assets/a.png"
	// Use BASE_URL to support GitHub Pages deployment with base path
	const baseUrl = import.meta.env.BASE_URL || '/';
	return `${baseUrl}data/${graph.img}`;
};

export const flattenGraphs = graphSets => {
	return graphSets.flatMap(gs => getGraphs(gs));
};

export const getEnabledGraphSets = db => {
	return db.graphSets.filter(gs => isEnabled(gs));
};

/**
 * Filter graphs to only include those from enabled hands
 */
export const filterGraphsByEnabledHands = (graphs, enabledHands) => {
	return graphs.filter(graph => enabledHands[graph.source] === true);
};

export const countEnabledCharacters = (db, enabledHands) => {
	let count = 0;
	db.graphSets.forEach(gs => {
		const filteredGraphs = filterGraphsByEnabledHands(
			getGraphs(gs),
			enabledHands
		);
		count += filteredGraphs.length;
	});
	return count;
};

/**
 * Get list of all hand names from the database
 */
export const getAllHandNames = db => {
	return Object.keys(db.sources);
};

/**
 * Count enabled hands
 */
export const countEnabledHands = enabledHands => {
	return Object.values(enabledHands).filter(Boolean).length;
};

export const countEnabledLetters = (db, enabledHands) => {
	let majuscules = 0;
	let minuscules = 0;

	Object.entries(enabledHands).forEach(([handName, isEnabled]) => {
		if (isEnabled && db.sources[handName]) {
			majuscules += db.sources[handName].majuscules || 0;
			minuscules += db.sources[handName].minuscules || 0;
		}
	});

	return { majuscules, minuscules, total: majuscules + minuscules };
};
