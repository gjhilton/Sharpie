export const getAllSources = db => db.sources;

export const getSource = (sources, key) => sources[key];

export const getCredit = source => source.title;

export const getLink = source => source.sourceUri;

export const getAllGraphsets = db => db.graphSets;

export const getGraphset = (allGraphsets, graphset) => allGraphsets[graphset];

export const getGraphs = graphset => graphset.graphs;

export const getTitle = graphset => graphset.title;

export const isEnabled = graphset => graphset.enabled;

export const getAllCharacters = graphset => {
	const graphs = getGraphs(graphset);
	const characters = graphs.map(graph => graph.character);
	return [...new Set(characters)];
};

export const getAllGraphsForCharacter = (graphset, character) => {
	const graphs = getGraphs(graphset);
	return graphs.filter(graph => graph.character === character);
};

export const getAllGraphs = graphset => {
	const characters = getAllCharacters(graphset);
	return characters.reduce((result, character) => {
		result[character] = getAllGraphsForCharacter(graphset, character);
		return result;
	}, {});
};

export const findGraphSetByTitle = (db, title) => {
	const graphSets = getAllGraphsets(db);
	return graphSets.find(gs => getTitle(gs) === title);
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
	const graphSets = getAllGraphsets(db);
	return graphSets.filter(gs => isEnabled(gs));
};

/**
 * Filter graphs to only include those from enabled hands
 */
export const filterGraphsByEnabledHands = (graphs, enabledHands) => {
	return graphs.filter(graph => enabledHands[graph.source] === true);
};

/**
 * Count total characters across all graph sets
 */
export const countTotalCharacters = db => {
	const graphSets = getAllGraphsets(db);
	return graphSets.reduce((total, gs) => total + getGraphs(gs).length, 0);
};

/**
 * Count characters from enabled hands only
 */
export const countEnabledCharacters = (db, enabledHands) => {
	const graphSets = getAllGraphsets(db);
	let count = 0;
	graphSets.forEach(gs => {
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

/**
 * Sort hands by date (chronological order)
 * Parses dates like "1570", "1574/5", "1579/80", "2019"
 */
export const sortHandsByDate = (handNames, handsMetadata) => {
	return [...handNames].sort((a, b) => {
		const dateA = handsMetadata[a]?.date || '9999';
		const dateB = handsMetadata[b]?.date || '9999';
		// Extract first year from date string (handles "1574/5" -> 1574)
		const yearA = parseInt(dateA.split('/')[0], 10);
		const yearB = parseInt(dateB.split('/')[0], 10);
		return yearA - yearB;
	});
};

/**
 * Count total majuscule and minuscule letters for enabled hands
 */
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
