# Build

- In Godot editor, go to: `Project/Export/Web (Runnable)`
- Set export path to `build/web/index.html`
- Include resources: `*.json, *.ttf`
- Click in `Export Project...`

# Running locally
python3 -m http.server --directory build/web

# Deploy (for Windows Power Shell)

Important: deploy gh-pages before pushing on main branch!

git worktree add ../gh-pages gh-pages
Remove-Item -Recurse -Force ../gh-pages/*
Copy-Item -Recurse build/web/* ../gh-pages/
Set-Location ../gh-pages
git add .
git commit -m "Deploy build/web"
git push origin gh-pages
Set-Location ../sym-balls
git worktree remove ../gh-pages  # optional
