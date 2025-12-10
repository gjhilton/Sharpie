#!/usr/bin/env node

/**
 * Prepare /public directory for build
 * Copies necessary assets from /artwork/assets to /public
 * Runs at build time alongside update-db
 */

import { existsSync, mkdirSync, cpSync, rmSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SRC_DIR = resolve(__dirname, '..');
const ARTWORK_ASSETS = resolve(SRC_DIR, 'artwork/assets');
const PUBLIC_DIR = resolve(SRC_DIR, 'public');

console.log('🚀 Preparing /public directory...\n');

// Clean and recreate public directory
if (existsSync(PUBLIC_DIR)) {
	console.log('🗑️  Removing old /public directory...');
	rmSync(PUBLIC_DIR, { recursive: true, force: true });
}

console.log('📁 Creating /public directory...');
mkdirSync(PUBLIC_DIR, { recursive: true });

// Copy files from artwork/assets to public
const filesToCopy = [
	'sharpieicon.svg',
	'logo.png',
	'secretary_hand.gif',
	'hand.png',
	'data', // directory
	'fonts', // directory
];

filesToCopy.forEach(file => {
	const src = resolve(ARTWORK_ASSETS, file);
	const dest = resolve(PUBLIC_DIR, file);

	if (!existsSync(src)) {
		console.warn(`⚠️  Warning: ${file} not found in ${ARTWORK_ASSETS}`);
		return;
	}

	const isDirectory = !file.includes('.');
	console.log(`📋 Copying ${file}...`);
	cpSync(src, dest, { recursive: isDirectory });
});

console.log('\n✅ /public directory prepared successfully!');
