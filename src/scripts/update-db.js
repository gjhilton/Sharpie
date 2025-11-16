#!/usr/bin/env node

import { readdir, copyFile, mkdir, writeFile, readFile } from 'fs/promises';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

const ALPHABETS_DIR = join(projectRoot, 'src/artwork/alphabets');
const DB_PATH = join(projectRoot, 'src/data/DB.js');
const PUBLIC_DATA_DIR = join(projectRoot, 'src/public/data');
const SOURCES_JSON_PATH = join(projectRoot, 'src/data/alphabets.json');

/**
 * Recursively find all *-assets directories
 */
async function findAssetDirectories(dir) {
	const results = [];

	try {
		const entries = await readdir(dir, { withFileTypes: true });

		for (const entry of entries) {
			if (entry.isDirectory()) {
				const fullPath = join(dir, entry.name);

				// Check if this directory ends with -assets
				if (entry.name.endsWith('-assets')) {
					results.push(fullPath);
				}

				// Recursively search subdirectories
				const subResults = await findAssetDirectories(fullPath);
				results.push(...subResults);
			}
		}
	} catch (error) {
		console.error(`Error reading directory ${dir}:`, error.message);
	}

	return results;
}

/**
 * Sanitize filename by replacing special characters
 * Pure function - exported for testing
 */
export function sanitizeFilename(filename) {
	// Replace $ with -dollar, & with -and, etc.
	return filename
		.replace(/\$/g, '-dollar')
		.replace(/&/g, '-and')
		.replace(/'/g, '')
		.replace(/"/g, '')
		.replace(/\s+/g, '-');
}

/**
 * Extract character from filename (first letter, case sensitive)
 * Pure function - exported for testing
 */
export function extractCharacter(filename) {
	const nameWithoutExt = filename.replace('.png', '');
	return nameWithoutExt.charAt(0);
}

/**
 * Determine graphSet category based on character
 * A-Z → MAJUSCULES, a-z → minuscules, other → Others
 * Pure function - exported for testing
 */
export function categorizeCharacter(char) {
	if (char >= 'A' && char <= 'Z') {
		return 'MAJUSCULES';
	} else if (char >= 'a' && char <= 'z') {
		return 'minuscules';
	} else {
		return 'Others';
	}
}

/**
 * Get parent directory name (source name)
 * Pure function - exported for testing
 */
export function getSourceName(assetPath) {
	const parentDir = dirname(assetPath);
	return basename(parentDir);
}

/**
 * Get asset folder name
 * Pure function - exported for testing
 */
export function getAssetFolderName(assetPath) {
	return basename(assetPath);
}

/**
 * Read metadata.json from asset directory if it exists
 */
async function readMetadata(assetPath) {
	const metadataPath = join(assetPath, 'metadata.json');
	try {
		if (existsSync(metadataPath)) {
			const content = await readFile(metadataPath, 'utf-8');
			return JSON.parse(content);
		}
	} catch (error) {
		console.warn(`   ⚠️  Error reading metadata.json: ${error.message}`);
	}
	return {};
}

/**
 * Process a single asset directory
 */
async function processAssetDirectory(assetPath) {
	const sourceName = getSourceName(assetPath);
	const assetFolderName = getAssetFolderName(assetPath);
	const destDir = join(PUBLIC_DATA_DIR, sourceName, assetFolderName);

	console.log(`\n📁 Processing ${sourceName}/${assetFolderName}...`);

	// Read metadata if available
	const metadata = await readMetadata(assetPath);
	const hasMetadata = Object.keys(metadata).length > 0;
	if (hasMetadata) {
		console.log(
			`   📝 Found metadata for ${Object.keys(metadata).length} images`
		);
	}

	// Create destination directory
	if (!existsSync(destDir)) {
		await mkdir(destDir, { recursive: true });
		console.log(`   Created destination: ${destDir}`);
	}

	// Read PNG files
	const files = await readdir(assetPath);
	const imageFiles = files.filter(f => f.endsWith('.png'));

	console.log(`   Found ${imageFiles.length} images`);

	// Process each image
	const graphEntries = [];

	for (const file of imageFiles) {
		const sanitizedFile = sanitizeFilename(file);
		const sourcePath = join(assetPath, file);
		const destPath = join(destDir, sanitizedFile);

		// Copy file with sanitized name
		await copyFile(sourcePath, destPath);

		// Extract character and categorize
		const character = extractCharacter(file);
		const category = categorizeCharacter(character);

		// Get note from metadata or auto-generate for majuscules
		let note = metadata[file]?.note;
		if (!note && category === 'MAJUSCULES') {
			note = 'First letter of word.';
		}

		const graphEntry = {
			img: sanitizedFile,
			character: character,
			source: sourceName,
			category: category,
			relativePath: `${sourceName}/${assetFolderName}/${sanitizedFile}`,
		};

		// Only add note field if it exists
		if (note) {
			graphEntry.note = note;
		}

		graphEntries.push(graphEntry);

		if (file !== sanitizedFile) {
			console.log(
				`     ✓ Copied ${file} → ${sanitizedFile} → ${character} (${category})${note ? ' [note]' : ''}`
			);
		} else {
			console.log(
				`     ✓ Copied ${file} → ${character} (${category})${note ? ' [note]' : ''}`
			);
		}
	}

	return {
		sourceName,
		assetFolderName,
		graphEntries,
	};
}

/**
 * Generate sources object for DB
 * Pure function - exported for testing
 */
export function generateSourcesObject(allEntries, sourceMetadata = {}) {
	const sources = {};
	const sourceNames = new Set();

	// Collect unique source names
	allEntries.forEach(entry => {
		entry.graphEntries.forEach(graph => {
			sourceNames.add(graph.source);
		});
	});

	// Generate source entries
	sourceNames.forEach(sourceName => {
		// Use metadata from JSON if available, otherwise generate placeholder
		if (sourceMetadata[sourceName]) {
			sources[sourceName] = {
				title: sourceMetadata[sourceName].title,
				sourceUri: sourceMetadata[sourceName].sourceUri,
				date: sourceMetadata[sourceName].date,
			};
		} else {
			// Fallback for sources not defined in JSON
			console.warn(
				`⚠️  Source "${sourceName}" not found in alphabets.json, using placeholder`
			);
			sources[sourceName] = {
				title: `${sourceName} source`,
				sourceUri: `https://example.com/${sourceName.toLowerCase()}`,
				date: 'unknown',
			};
		}
	});

	return sources;
}

/**
 * Generate graphSets array for DB
 * Pure function - exported for testing
 */
export function generateGraphSets(allEntries) {
	const categorizedGraphs = {
		minuscules: [],
		MAJUSCULES: [],
		Others: [],
	};

	// Group all graphs by category
	allEntries.forEach(entry => {
		entry.graphEntries.forEach(graph => {
			const graphObj = {
				img: graph.relativePath,
				character: graph.character,
				source: graph.source,
			};
			// Only add note field if it exists
			if (graph.note) {
				graphObj.note = graph.note;
			}
			categorizedGraphs[graph.category].push(graphObj);
		});
	});

	// Sort graphs within each category
	Object.keys(categorizedGraphs).forEach(category => {
		categorizedGraphs[category].sort((a, b) =>
			a.character.localeCompare(b.character)
		);
	});

	// Build graphSets array
	return [
		{
			title: 'minuscules',
			enabled: true,
			graphs: categorizedGraphs['minuscules'],
		},
		{
			title: 'MAJUSCULES',
			enabled: true,
			graphs: categorizedGraphs['MAJUSCULES'],
		},
		{
			title: 'Others',
			enabled: false,
			graphs: categorizedGraphs['Others'],
		},
	];
}

/**
 * Format a single source entry (pure function)
 */
export function formatSourceEntry(key, value) {
	return `\t\t"${key}": {
\t\t\ttitle: '${value.title}',
\t\t\tsourceUri: '${value.sourceUri}',
\t\t\tdate: '${value.date}'
\t\t}`;
}

/**
 * Format a single graph entry (pure function)
 */
export function formatGraphEntry(graph) {
	const fields = [
		`img: "${graph.img}"`,
		`character: "${graph.character}"`,
		`source: "${graph.source}"`,
	];

	if (graph.note) {
		fields.push(`note: "${graph.note}"`);
	}

	const fieldsStr = fields.map(f => `\t\t\t\t\t${f}`).join(',\n');

	return `\t\t\t\t{
${fieldsStr}
\t\t\t\t}`;
}

/**
 * Format a single graphSet entry (pure function)
 */
export function formatGraphSetEntry(graphSet) {
	const graphsStr = graphSet.graphs
		.map(graph => formatGraphEntry(graph))
		.join(',\n');

	return `\t\t{
\t\t\ttitle: "${graphSet.title}",
\t\t\tenabled: ${graphSet.enabled},
\t\t\tgraphs: [
${graphsStr}
\t\t\t]
\t\t}`;
}

/**
 * Format complete DB content (pure function)
 */
export function formatDBContent(sources, graphSets) {
	const sourcesStr = Object.entries(sources)
		.map(([key, value]) => formatSourceEntry(key, value))
		.join(',\n');

	const graphSetsStr = graphSets
		.map(graphSet => formatGraphSetEntry(graphSet))
		.join(',\n');

	return `// This is a generated file. Do not edit.
// Run \`npm run update-db\` to regenerate.

export const DB = {
\tsources: {
${sourcesStr}
\t},
\tgraphSets: [
${graphSetsStr}
\t]
};
`;
}

/**
 * Generate and write DB.js file
 */
async function writeDB(sources, graphSets) {
	console.log('\n📝 Generating DB.js...');
	const dbContent = formatDBContent(sources, graphSets);
	await writeFile(DB_PATH, dbContent, 'utf-8');
	console.log('  ✓ DB.js written successfully!');
}

/**
 * Main execution
 */
async function main() {
	try {
		console.log('🚀 Starting dynamic update-db...\n');
		console.log('='.repeat(60));
		console.log(`Scanning: ${ALPHABETS_DIR}`);

		// Load source metadata from JSON
		let sourceMetadata = {};
		try {
			const sourcesJsonContent = await readFile(
				SOURCES_JSON_PATH,
				'utf-8'
			);
			sourceMetadata = JSON.parse(sourcesJsonContent);
			console.log(`✓ Loaded source metadata from ${SOURCES_JSON_PATH}`);
		} catch (error) {
			console.warn(`⚠️  Could not load alphabets.json: ${error.message}`);
			console.warn('   Will use placeholder metadata for all sources');
		}

		// Find all asset directories
		const assetDirs = await findAssetDirectories(ALPHABETS_DIR);
		console.log(`\nFound ${assetDirs.length} asset directories:`);
		assetDirs.forEach(dir => console.log(`  - ${dir}`));

		// Process each directory
		const allEntries = [];
		for (const assetDir of assetDirs) {
			const result = await processAssetDirectory(assetDir);
			allEntries.push(result);
		}

		// Generate DB structure
		const sources = generateSourcesObject(allEntries, sourceMetadata);
		const graphSets = generateGraphSets(allEntries);

		// Write DB.js
		await writeDB(sources, graphSets);

		// Print summary
		console.log('\n' + '='.repeat(60));
		console.log('✅ All done!\n');
		console.log('📊 Summary:');

		let totalImages = 0;
		graphSets.forEach(graphSet => {
			console.log(`\n   ${graphSet.title.toUpperCase()}:`);
			console.log(`   - ${graphSet.graphs.length} images`);
			console.log(`   - Enabled: ${graphSet.enabled}`);
			totalImages += graphSet.graphs.length;
		});

		console.log(`\n   TOTAL: ${totalImages} images processed`);
		console.log(`   Sources: ${Object.keys(sources).join(', ')}`);
		console.log('\n' + '='.repeat(60));
	} catch (error) {
		console.error('❌ Error:', error.message);
		console.error(error.stack);
		process.exit(1);
	}
}

main();
