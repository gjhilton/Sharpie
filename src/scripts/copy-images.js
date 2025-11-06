#!/usr/bin/env node

import { copyFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { DB } from '../data/DB.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

const GRAPHS_SOURCE_DIR = join(projectRoot, 'src/artwork/Graphs');
const PUBLIC_DATA_DIR = join(projectRoot, 'public/data');

/**
 * Get all image paths from the database
 */
function getAllImagePaths(db) {
	const imagePaths = [];

	for (const graphSet of db.graphSets) {
		for (const graph of graphSet.graphs) {
			imagePaths.push(graph.img);
		}
	}

	return imagePaths;
}

/**
 * Copy a single image from source to destination
 */
async function copyImage(imagePath) {
	const sourcePath = join(GRAPHS_SOURCE_DIR, imagePath);
	const destPath = join(PUBLIC_DATA_DIR, imagePath);
	const destDir = dirname(destPath);

	// Check if source exists
	if (!existsSync(sourcePath)) {
		console.error(`   ❌ Source not found: ${imagePath}`);
		return { success: false, path: imagePath, reason: 'source_missing' };
	}

	// Create destination directory if it doesn't exist
	if (!existsSync(destDir)) {
		await mkdir(destDir, { recursive: true });
	}

	// Copy file
	try {
		await copyFile(sourcePath, destPath);
		console.log(`   ✓ Copied: ${imagePath}`);
		return { success: true, path: imagePath };
	} catch (error) {
		console.error(`   ❌ Failed to copy ${imagePath}:`, error.message);
		return { success: false, path: imagePath, reason: error.message };
	}
}

/**
 * Main function
 */
async function main() {
	console.log('🚀 Starting image copy from database...\n');
	console.log('============================================================');

	// Get all image paths from database
	const imagePaths = getAllImagePaths(DB);
	console.log(`Found ${imagePaths.length} images in database\n`);

	// Create public/data directory if it doesn't exist
	if (!existsSync(PUBLIC_DATA_DIR)) {
		await mkdir(PUBLIC_DATA_DIR, { recursive: true });
		console.log(`Created ${PUBLIC_DATA_DIR}\n`);
	}

	// Copy all images
	const results = [];
	for (const imagePath of imagePaths) {
		const result = await copyImage(imagePath);
		results.push(result);
	}

	// Summary
	console.log(
		'\n============================================================'
	);
	console.log('Summary:');
	const successful = results.filter(r => r.success).length;
	const failed = results.filter(r => !r.success).length;
	console.log(`✓ Successfully copied: ${successful}`);
	if (failed > 0) {
		console.log(`❌ Failed: ${failed}`);
		const missing = results.filter(r => r.reason === 'source_missing');
		if (missing.length > 0) {
			console.log('\nMissing source files:');
			missing.forEach(m => console.log(`  - ${m.path}`));
		}
	}
	console.log(
		'============================================================\n'
	);

	// Exit with error code if any failed
	if (failed > 0) {
		process.exit(1);
	}
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch(error => {
		console.error('Fatal error:', error);
		process.exit(1);
	});
}

export { getAllImagePaths, copyImage };
