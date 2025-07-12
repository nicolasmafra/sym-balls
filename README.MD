# Build

- In Godot editor, go to: `Project/Export/Web (Runnable)`
- Set export path to `build/web/index.html`
- Include resources: `*.json, *.ttf`
- Click in `Export Project...`

# Running locally
python3 -m http.server --directory build/web

# Deploy
execute `./deploy.bat` (for Windows only)
