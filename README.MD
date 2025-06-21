# Build

- In Godot editor, go to: `Project/Export/Web (Runnable)`
- Set export path to `build/web/index.html`
- Include resources: `*.json, *.ttf`
- Click in `Export Project...`

# Running locally
python3 -m http.server --directory build/web

# Deploy (for Windows Power Shell)

Remove-Item -Recurse -Force ../gh-pages/*
git worktree add -f ../gh-pages gh-pages
Copy-Item -Recurse build/web/* ../gh-pages/
Set-Location ../gh-pages
git add .
git commit -m "Deploy build/web"
git push -f origin gh-pages
Set-Location ../sym-balls
git worktree remove ../gh-pages  # optional
