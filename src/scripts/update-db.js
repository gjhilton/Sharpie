#!/usr/bin/env node

import { readdir, copyFile, mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const DB_PATH = join(projectRoot, 'src/data/DB.js');

// Configuration for both asset types
const ASSET_CONFIGS = [
	{
		name: 'minuscules',
		sourceDir: join(projectRoot, 'src/artwork/Joscelyn/joscelyn-min-assets'),
		destDir: join(projectRoot, 'public/data/joscelyn-min'),
		transformCharacter: (filename) => filename.replace('.png', ''), // a.png -> "a"
		graphSetTitle: 'minuscules'
	},
	{
		name: 'majuscules',
		sourceDir: join(projectRoot, 'src/artwork/Joscelyn/joscelyn-maj-assets'),
		destDir: join(projectRoot, 'public/data/joscelyn-maj'),
		transformCharacter: (filename) => filename.replace('.png', '').toUpperCase(), // a.png -> "A"
		graphSetTitle: 'MAJUSCULES'
	}
];

/**
 * Copy images from source to destination directory
 */
async function copyImages(config) {
	console.log(`\n📁 Processing ${config.name}...`);
	console.log(`   Creating destination directory: ${config.destDir}`);

	// Create destination directory if it doesn't exist
	if (!existsSync(config.destDir)) {
		await mkdir(config.destDir, { recursive: true });
	}

	console.log(`   Reading source files from: ${config.sourceDir}`);
	const files = await readdir(config.sourceDir);
	const imageFiles = files.filter(f => f.endsWith('.png'));

	console.log(`   Found ${imageFiles.length} images to copy`);

	// Copy each file
	for (const file of imageFiles) {
		const sourcePath = join(config.sourceDir, file);
		const destPath = join(config.destDir, file);
		await copyFile(sourcePath, destPath);
		console.log(`     ✓ Copied ${file}`);
	}

	return imageFiles;
}

/**
 * Generate graph entries for DB.js
 */
function generateGraphEntries(imageFiles, config) {
	return imageFiles
		.map(filename => {
			const character = config.transformCharacter(filename);
			return {
				img: filename,
				character: character,
				source: 'joscelyn'
			};
		})
		.sort((a, b) => a.character.localeCompare(b.character));
}

/**
 * Update DB.js with new entries
 */
async function updateDB(minusculeEntries, majusculeEntries) {
	console.log('\n📝 Updating DB.js...');

	// Generate DB structure with both sets
	const newDB = `export const DB = {
	sources: {
		hill: {
			title: 'Commonplace Book of William Hill (1574 or 1575)',
			sourceUri: 'https://search.library.yale.edu/catalog/9970402713408651'
		},
		joscelyn: {
			title: 'Joscelyn typeface, drawn by Peter Baker (2019)',
			sourceUri: 'https://github.com/psb1558/Joscelyn-font/releases'
		}
	},
	graphSets: [
		{
			title: "minuscules",
			enabled: true,
			graphs: [
${minusculeEntries.map(entry => `				{
					img: "${entry.img}",
					character: "${entry.character}",
					source: "${entry.source}"
				}`).join(',\n')}
			]
		},
		{
			title: "MAJUSCULES",
			enabled: true,
			graphs: [
${majusculeEntries.map(entry => `				{
					img: "${entry.img}",
					character: "${entry.character}",
					source: "${entry.source}"
				}`).join(',\n')}
			]
		},
		{
			title: "Numerals",
			enabled: false,
			graphs: []
		},
		{
			title: "Brevigraphs",
			enabled: false,
			graphs: []
		}
	]
};
`;

	await writeFile(DB_PATH, newDB, 'utf-8');
	console.log('  ✓ DB.js updated successfully!');
}

/**
 * Main execution
 */
async function main() {
	try {
		console.log('🚀 Starting update-db...\n');
		console.log('=' .repeat(60));

		const results = [];

		// Process both minuscules and majuscules
		for (const config of ASSET_CONFIGS) {
			const imageFiles = await copyImages(config);
			const graphEntries = generateGraphEntries(imageFiles, config);
			results.push({
				config,
				imageFiles,
				graphEntries
			});
		}

		// Update DB.js with both sets
		const minusculeEntries = results[0].graphEntries;
		const majusculeEntries = results[1].graphEntries;
		await updateDB(minusculeEntries, majusculeEntries);

		console.log('\n' + '='.repeat(60));
		console.log('✅ All done!\n');
		console.log('📊 Summary:');

		for (const result of results) {
			console.log(`\n   ${result.config.name.toUpperCase()}:`);
			console.log(`   - ${result.imageFiles.length} images copied to ${result.config.destDir}`);
			console.log(`   - ${result.graphEntries.length} entries added to DB.js`);
			console.log(`   - Characters: ${result.graphEntries.map(e => e.character).join(', ')}`);
		}

		console.log('\n' + '='.repeat(60));

	} catch (error) {
		console.error('❌ Error:', error.message);
		console.error(error.stack);
		process.exit(1);
	}
}

main();
