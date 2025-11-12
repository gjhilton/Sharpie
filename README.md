![image](/src/artwork/Branding/sharpielogo.jpg)

Sharpie, a letterform recognition game for beginner Early Modern palaeographers

![Coverage](https://img.shields.io/badge/coverage-check%20CI-blue)

Status: 🚨 🚧 (very) under construction: expect carnage 🚧 🚨

Work in progress: https://gjhilton.github.io/Sharpie/

## Development notes

### Running the dev server

```bash
npm run dev:host
```

View at <code>http://192.168.1.198:8080/</code> (if you're gjh, and its running on FinisAfricæ)

### Asset creation workflow

To add a new set of source images

1. Make a new subfolder in /src/artwork/Graphs. The folder name will be used as a key in data so dont use spaces or fancy punctuation.
2. (recommmeded) Copy in your source image
3. (recommmeded) Make a black and white high contrast version of the source image at 100% size. Finding the right size is a bit of a trial and error process.
4. (recommended) Duplicate one of the existing master psd documents and delete all but one of the layer groups
5. IMPORTANT Use photoshop file > automate > generator plugins > image assets to automatically generate an kmage for every layer group as you work. The generated files will be in a folder [psd name]-assets. This naming convention is automatic but is relied on by the update-db script.
6. In photoshop: duplicate a layer group. The name you pick for the layer group will be the filename of the generated file. We also use the CASE SENSITIVE first character of the filenametl determine what character is represented. All files shoild be PNGs. So you layer group / file name will be `[character]+ [something unique] + .png` eg `A0001.png` or `a-withflourish.png`
7. Copy and paste an individual character from your b&w reference image into the new group
8. Adjust position, clean up any grot etc
9. Repeat steps 6-8 for each character
10. Add medatadata for the source in `/src/data/sources.json`
11. Run `npm run update-db` to regenerate DB.js
