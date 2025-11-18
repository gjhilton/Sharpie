import * as db from '@utilities/database.js';

/**
 * Groups graphs by graphset and character
 * Filters out graphSets with no characters
 */
export const groupGraphsByGraphSetAndCharacter = graphSets => {
	return graphSets
		.map(graphSet => {
			const graphs = db.getGraphs(graphSet);
			const title = db.getTitle(graphSet);

			// Group by character
			const characterMap = {};
			graphs.forEach(graph => {
				if (!characterMap[graph.character]) {
					characterMap[graph.character] = [];
				}
				characterMap[graph.character].push(graph);
			});

			// Sort characters alphabetically
			const sortedCharacters = Object.keys(characterMap).sort((a, b) =>
				a.localeCompare(b)
			);

			return {
				title,
				characters: sortedCharacters.map(char => ({
					character: char,
					graphs: characterMap[char],
				})),
			};
		})
		.filter(graphSet => graphSet.characters.length > 0);
};
