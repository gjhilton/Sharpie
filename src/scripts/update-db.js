#!/usr/bin/env node

import { readdir, copyFile, mkdir, writeFile, readFile } from 'fs/promises';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

// =============================================================================
// Configuration
// =============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '../..');

const PATHS = {
	alphabets: join(PROJECT_ROOT, 'src/artwork/alphabets'),
	database: join(PROJECT_ROOT, 'src/data/DB.js'),
	publicData: join(PROJECT_ROOT, 'src/public/data'),
	metadata: join(PROJECT_ROOT, 'src/data/hands.json'),
};

const CATEGORIES = {
	MAJUSCULES: 'MAJUSCULES',
	MINUSCULES: 'minuscules',
	OTHERS: 'Others',
};

// =============================================================================
// Pure Functions - String Utilities
// =============================================================================

/**
 * Escape single quotes for use in single-quoted JS strings
 */
export function escapeSingleQuotes(str) {
	return str == null ? '' : str.replace(/'/g, "\\'");
}

/**
 * Escape double quotes for use in double-quoted JS strings
 */
export function escapeDoubleQuotes(str) {
	return str == null ? '' : str.replace(/"/g, '\\"');
}

/**
 * Sanitize filename by replacing special characters
 */
export function sanitizeFilename(filename) {
	return filename
		.replace(/\$/g, '-dollar')
		.replace(/&/g, '-and')
		.replace(/'/g, '')
		.replace(/"/g, '')
		.replace(/\s+/g, '-');
}

// =============================================================================
// Pure Functions - Character Extraction
// =============================================================================

/**
 * Extract character from filename (first letter, case sensitive)
 */
export function extractCharacter(filename) {
	return filename.replace('.png', '').charAt(0);
}

/**
 * Categorize character: A-Z → MAJUSCULES, a-z → minuscules, other → Others
 */
export function categorizeCharacter(char) {
	if (char >= 'A' && char <= 'Z') return CATEGORIES.MAJUSCULES;
	if (char >= 'a' && char <= 'z') return CATEGORIES.MINUSCULES;
	return CATEGORIES.OTHERS;
}

// =============================================================================
// Pure Functions - Path Utilities
// =============================================================================

/**
 * Get hand name from asset path (parent directory name)
 */
export function getHandName(assetPath) {
	return basename(dirname(assetPath));
}

/**
 * Get asset folder name from path
 */
export function getAssetFolderName(assetPath) {
	return basename(assetPath);
}

// =============================================================================
// Pure Functions - Image Entry Building
// =============================================================================

/**
 * Build a single image entry from file info
 */
export function buildImageEntry(file, handName, assetFolderName, metadata) {
	const sanitizedFile = sanitizeFilename(file);
	const character = extractCharacter(file);
	const category = categorizeCharacter(character);
	const note =
		metadata[file]?.note ||
		(category === CATEGORIES.MAJUSCULES ? 'First letter of word.' : null);

	const entry = {
		img: sanitizedFile,
		character,
		alphabet: handName,
		category,
		relativePath: `${handName}/${assetFolderName}/${sanitizedFile}`,
	};

	if (note) entry.note = note;
	return entry;
}

// =============================================================================
// Pure Functions - Source Generation
// =============================================================================

/**
 * Extract unique hand names from processed entries
 */
export function extractHandNames(allEntries) {
	const names = new Set();
	allEntries.forEach(entry => {
		entry.images.forEach(img => names.add(img.alphabet));
	});
	return names;
}

/**
 * Build source entry from metadata or generate placeholder
 */
export function buildSourceEntry(handName, metadata) {
	if (metadata[handName]) {
		const { title, sourceUri, date, difficulty } = metadata[handName];
		return { title, sourceUri, date, difficulty };
	}
	return {
		title: `${handName} source`,
		sourceUri: `https://example.com/${handName.toLowerCase()}`,
		date: 'unknown',
		difficulty: 'medium',
	};
}

/**
 * Generate sources object for DB
 */
export function generateSources(allEntries, handMetadata = {}) {
	const sources = {};
	const handNames = extractHandNames(allEntries);

	handNames.forEach(name => {
		if (!handMetadata[name]) {
			console.warn(
				`⚠️  Source "${name}" not found in hands.json, using placeholder`
			);
		}
		sources[name] = buildSourceEntry(name, handMetadata);
	});

	return sources;
}

// =============================================================================
// Pure Functions - Character Set Generation
// =============================================================================

/**
 * Convert image entry to output format (for DB)
 */
export function toOutputImage(img) {
	const output = {
		img: img.relativePath,
		character: img.character,
		source: img.alphabet,
	};
	if (img.note) output.note = img.note;
	return output;
}

/**
 * Group images by category
 */
export function groupByCategory(allEntries) {
	const grouped = {
		[CATEGORIES.MINUSCULES]: [],
		[CATEGORIES.MAJUSCULES]: [],
		[CATEGORIES.OTHERS]: [],
	};

	allEntries.forEach(entry => {
		entry.images.forEach(img => {
			grouped[img.category].push(toOutputImage(img));
		});
	});

	return grouped;
}

/**
 * Sort images alphabetically by character
 */
export function sortByCharacter(images) {
	return [...images].sort((a, b) => a.character.localeCompare(b.character));
}

/**
 * Generate character sets array for DB
 */
export function generateCharacterSets(allEntries) {
	const grouped = groupByCategory(allEntries);

	return [
		{
			title: CATEGORIES.MINUSCULES,
			enabled: true,
			images: sortByCharacter(grouped[CATEGORIES.MINUSCULES]),
		},
		{
			title: CATEGORIES.MAJUSCULES,
			enabled: true,
			images: sortByCharacter(grouped[CATEGORIES.MAJUSCULES]),
		},
		{
			title: CATEGORIES.OTHERS,
			enabled: false,
			images: sortByCharacter(grouped[CATEGORIES.OTHERS]),
		},
	];
}

// =============================================================================
// Pure Functions - DB Formatting
// =============================================================================

/**
 * Format a single source entry as JS code
 */
export function formatSourceEntry(key, value) {
	return `\t\t"${key}": {
\t\t\ttitle: '${escapeSingleQuotes(value.title)}',
\t\t\tsourceUri: '${escapeSingleQuotes(value.sourceUri)}',
\t\t\tdate: '${escapeSingleQuotes(value.date)}',
\t\t\tdifficulty: '${escapeSingleQuotes(value.difficulty)}'
\t\t}`;
}

/**
 * Format a single image entry as JS code
 */
export function formatImageEntry(image) {
	const fields = [
		`img: "${escapeDoubleQuotes(image.img)}"`,
		`character: "${escapeDoubleQuotes(image.character)}"`,
		`source: "${escapeDoubleQuotes(image.source)}"`,
	];
	if (image.note) {
		fields.push(`note: "${escapeDoubleQuotes(image.note)}"`);
	}
	return `\t\t\t\t{\n${fields.map(f => `\t\t\t\t\t${f}`).join(',\n')}\n\t\t\t\t}`;
}

/**
 * Format a single character set entry as JS code
 */
export function formatCharacterSetEntry(charSet) {
	const imagesStr = charSet.images.map(formatImageEntry).join(',\n');
	return `\t\t{
\t\t\ttitle: "${escapeDoubleQuotes(charSet.title)}",
\t\t\tenabled: ${charSet.enabled},
\t\t\tgraphs: [
${imagesStr}
\t\t\t]
\t\t}`;
}

/**
 * Format complete DB content as JS code
 */
export function formatDBContent(sources, characterSets) {
	const sourcesStr = Object.entries(sources)
		.map(([key, value]) => formatSourceEntry(key, value))
		.join(',\n');

	const setsStr = characterSets.map(formatCharacterSetEntry).join(',\n');

	return `// This is a generated file. Do not edit.
// Run \`npm run update-db\` to regenerate.

export const DB = {
\tsources: {
${sourcesStr}
\t},
\tgraphSets: [
${setsStr}
\t]
};
`;
}

// =============================================================================
// File System Operations
// =============================================================================

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
				if (entry.name.endsWith('-assets')) {
					results.push(fullPath);
				}
				results.push(...(await findAssetDirectories(fullPath)));
			}
		}
	} catch (error) {
		console.error(`Error reading directory ${dir}:`, error.message);
	}
	return results;
}

/**
 * Read metadata.json from asset directory if it exists
 */
async function readMetadata(assetPath) {
	const metadataPath = join(assetPath, 'metadata.json');
	try {
		if (existsSync(metadataPath)) {
			return JSON.parse(await readFile(metadataPath, 'utf-8'));
		}
	} catch (error) {
		console.warn(`   ⚠️  Error reading metadata.json: ${error.message}`);
	}
	return {};
}

/**
 * Process a single asset directory - copy files and build entries
 */
async function processAssetDirectory(assetPath) {
	const handName = getHandName(assetPath);
	const assetFolderName = getAssetFolderName(assetPath);
	const destDir = join(PATHS.publicData, handName, assetFolderName);

	console.log(`\n📁 Processing ${handName}/${assetFolderName}...`);

	const metadata = await readMetadata(assetPath);
	if (Object.keys(metadata).length > 0) {
		console.log(
			`   📝 Found metadata for ${Object.keys(metadata).length} images`
		);
	}

	if (!existsSync(destDir)) {
		await mkdir(destDir, { recursive: true });
		console.log(`   Created destination: ${destDir}`);
	}

	const files = (await readdir(assetPath)).filter(f => f.endsWith('.png'));
	console.log(`   Found ${files.length} images`);

	const images = [];
	for (const file of files) {
		const entry = buildImageEntry(
			file,
			handName,
			assetFolderName,
			metadata
		);
		await copyFile(join(assetPath, file), join(destDir, entry.img));
		images.push(entry);

		const renamed = file !== entry.img ? ` → ${entry.img}` : '';
		const noteTag = entry.note ? ' [note]' : '';
		console.log(
			`     ✓ Copied ${file}${renamed} → ${entry.character} (${entry.category})${noteTag}`
		);
	}

	return { handName, assetFolderName, images };
}

// =============================================================================
// Validation
// =============================================================================

/**
 * Find lines with potential quote issues
 */
function findQuoteIssues(content) {
	const issues = [];
	const lines = content.split('\n');

	lines.forEach((line, i) => {
		const singleQuoteCount = (line.match(/'/g) || []).length;
		const doubleQuoteCount = (line.match(/"/g) || []).length;

		if (
			(line.includes('title:') || line.includes('note:')) &&
			singleQuoteCount % 2 !== 0
		) {
			issues.push({
				line: i + 1,
				type: 'single quotes',
				content: line.trim(),
			});
		}
		if (
			(line.includes('img:') ||
				line.includes('character:') ||
				line.includes('source:')) &&
			doubleQuoteCount % 2 !== 0
		) {
			issues.push({
				line: i + 1,
				type: 'double quotes',
				content: line.trim(),
			});
		}
	});

	return issues;
}

/**
 * Validate generated JS by attempting to import it
 */
async function validateAndWriteDB(content, filePath) {
	console.log('  🔍 Validating generated JavaScript...');

	await writeFile(filePath, content, 'utf-8');

	try {
		await import(`file://${filePath}?cachebust=${Date.now()}`);
		console.log('  ✓ JavaScript validation passed!');
	} catch (error) {
		console.error('  ❌ JavaScript validation failed!');
		console.error(`     Error: ${error.message}`);

		findQuoteIssues(content).forEach(issue => {
			console.error(`     Line ${issue.line}: unbalanced ${issue.type}`);
			console.error(`     ${issue.content}`);
		});

		throw new Error(
			`Generated DB.js is not valid JavaScript: ${error.message}`
		);
	}
}

// =============================================================================
// Main
// =============================================================================

async function main() {
	try {
		console.log('🚀 Starting update-db...\n');
		console.log('='.repeat(60));
		console.log(`Scanning: ${PATHS.alphabets}`);

		// Load hand metadata
		let handMetadata = {};
		try {
			handMetadata = JSON.parse(await readFile(PATHS.metadata, 'utf-8'));
			console.log(`✓ Loaded metadata from ${PATHS.metadata}`);
		} catch (error) {
			console.warn(`⚠️  Could not load hands.json: ${error.message}`);
		}

		// Find and process asset directories
		const assetDirs = await findAssetDirectories(PATHS.alphabets);
		console.log(`\nFound ${assetDirs.length} asset directories:`);
		assetDirs.forEach(dir => console.log(`  - ${dir}`));

		const allEntries = [];
		for (const dir of assetDirs) {
			allEntries.push(await processAssetDirectory(dir));
		}

		// Generate and write DB
		const sources = generateSources(allEntries, handMetadata);
		const characterSets = generateCharacterSets(allEntries);
		const dbContent = formatDBContent(sources, characterSets);

		console.log('\n📝 Generating DB.js...');
		await validateAndWriteDB(dbContent, PATHS.database);
		console.log('  ✓ DB.js written successfully!');

		// Summary
		console.log('\n' + '='.repeat(60));
		console.log('✅ All done!\n');
		console.log('📊 Summary:');

		let total = 0;
		characterSets.forEach(set => {
			console.log(`\n   ${set.title.toUpperCase()}:`);
			console.log(`   - ${set.images.length} images`);
			console.log(`   - Enabled: ${set.enabled}`);
			total += set.images.length;
		});

		console.log(`\n   TOTAL: ${total} images processed`);
		console.log(`   Sources: ${Object.keys(sources).join(', ')}`);
		console.log('\n' + '='.repeat(60));
	} catch (error) {
		console.error('❌ Error:', error.message);
		console.error(error.stack);
		process.exit(1);
	}
}

main();
