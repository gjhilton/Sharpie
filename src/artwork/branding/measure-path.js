import { readFile } from 'fs/promises';
import { svgPathProperties } from 'svg-path-properties';

async function measurePath() {
	// Read the SVG file
	const svgContent = await readFile(
		'./src/artwork/Branding/sharpielogo-line.svg',
		'utf-8'
	);

	// Extract the path with class="red"
	const pathMatch = svgContent.match(/<path[^>]*class="red"[^>]*d="([^"]+)"/);

	if (!pathMatch) {
		console.error('Could not find path with class="red"');
		process.exit(1);
	}

	const pathData = pathMatch[1];
	console.log('Path data found');

	// Calculate the length
	const properties = new svgPathProperties(pathData);
	const length = properties.getTotalLength();

	console.log('\n=================================');
	console.log('RED PATH LENGTH:', length);
	console.log('=================================\n');
	console.log('Use this value in the animation:');
	console.log(`strokeDasharray: ${length}`);
	console.log(`strokeDashoffset: ${length}`);

	return length;
}

measurePath().catch(console.error);
