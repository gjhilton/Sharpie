#!/usr/bin/env node

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DB } from './src/data/DB.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const allImages = [];
DB.graphSets.forEach(graphSet => {
	graphSet.graphs.forEach(graph => {
		allImages.push(graph.img);
	});
});

console.log(`\n=== Checking ${allImages.length} images ===\n`);

const missingSource = [];
const missingDest = [];
const foundBoth = [];

allImages.forEach(img => {
	const sourcePath = join(__dirname, 'src/artwork/Graphs', img);
	const destPath = join(__dirname, 'public/data', img);

	const sourceExists = existsSync(sourcePath);
	const destExists = existsSync(destPath);

	if (!sourceExists) {
		missingSource.push(img);
	}
	if (!destExists) {
		missingDest.push(img);
	}
	if (sourceExists && destExists) {
		foundBoth.push(img);
	}
});

console.log(`✓ Found (both source and dest): ${foundBoth.length}`);
console.log(`✗ Missing from source: ${missingSource.length}`);
console.log(`✗ Missing from public/data: ${missingDest.length}`);

if (missingSource.length > 0) {
	console.log('\n=== Missing from source (src/artwork/Graphs) ===');
	missingSource.forEach(img => console.log(`  ${img}`));
}

if (missingDest.length > 0) {
	console.log('\n=== Missing from public/data ===');
	missingDest.forEach(img => console.log(`  ${img}`));
}

console.log('\n');
