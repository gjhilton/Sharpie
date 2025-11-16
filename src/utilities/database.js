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
 * Filter graphs to only include those from enabled alphabets
 */
export const filterGraphsByEnabledAlphabets = (graphs, enabledAlphabets) => {
	return graphs.filter(graph => enabledAlphabets[graph.source] === true);
};

/**
 * Count total characters across all graph sets
 */
export const countTotalCharacters = db => {
	const graphSets = getAllGraphsets(db);
	return graphSets.reduce((total, gs) => total + getGraphs(gs).length, 0);
};

/**
 * Count characters from enabled alphabets only
 */
export const countEnabledCharacters = (db, enabledAlphabets) => {
	const graphSets = getAllGraphsets(db);
	let count = 0;
	graphSets.forEach(gs => {
		const filteredGraphs = filterGraphsByEnabledAlphabets(
			getGraphs(gs),
			enabledAlphabets
		);
		count += filteredGraphs.length;
	});
	return count;
};

/**
 * Get list of all alphabet names from the database
 */
export const getAllAlphabetNames = db => {
	return Object.keys(db.sources);
};

/**
 * Count enabled alphabets
 */
export const countEnabledAlphabets = enabledAlphabets => {
	return Object.values(enabledAlphabets).filter(Boolean).length;
};

/**
 * Sort alphabets by date (chronological order)
 * Parses dates like "1570", "1574/5", "1579/80", "2019"
 */
export const sortAlphabetsByDate = (alphabetNames, alphabetsMetadata) => {
	return [...alphabetNames].sort((a, b) => {
		const dateA = alphabetsMetadata[a]?.date || '9999';
		const dateB = alphabetsMetadata[b]?.date || '9999';
		// Extract first year from date string (handles "1574/5" -> 1574)
		const yearA = parseInt(dateA.split('/')[0], 10);
		const yearB = parseInt(dateB.split('/')[0], 10);
		return yearA - yearB;
	});
};
