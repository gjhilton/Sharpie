export const DB = {
	sources: {
		hill: {
			title: 'Commonplace Book of William Hill (1574 or 1575)',
			sourceUri: 'https://search.library.yale.edu/catalog/,9970402713408651'
		}
		joscelyn: {
			title: 'Joscelyn typeface, drawn by Peter Baker (2019)',
			sourceUri: 'https://github.com/psb1558/Joscelyn-font/releases'
		}
	},
	graphSets:[
		{
			title: "minuscules",
			enabled: true,
			graphs: {
				{
					img: "a.jpg",
					character: "a",
					source: "hill"
				},
				{
					img: "b.jpg",
					character: "b",
					source: "hill"
				},
			}
		},
		{
			title: "MAJUSCULES",
			enabled: true,
			graphs: {
				{
					img: "A.jpg",
					character: "A",
					source: "hill"
				}
			}
		},
		{
			title: "Numerals",
			enabled: false,
			graphs: {}
		},
		{
			title: "Brevigraphs",
			enabled: false,
			graphs: {}
		}
	]
};
