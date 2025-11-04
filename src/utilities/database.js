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

export const getRandomGraph = graphs => {
	const randomIndex = Math.floor(Math.random() * graphs.length);
	return graphs[randomIndex];
};

export const getImagePath = graph => {
	// The img field now contains the full relative path
	// e.g., "Joscelyn/joscelyn-min-assets/a.png"
	return `/data/${graph.img}`;
};

export const flattenGraphs = graphSets => {
	return graphSets.flatMap(gs => getGraphs(gs));
};

export const getEnabledGraphSets = db => {
	const graphSets = getAllGraphsets(db);
	return graphSets.filter(gs => isEnabled(gs));
};
