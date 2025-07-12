rmdir /s /q ..\gh-pages
git worktree add -f ..\gh-pages gh-pages
xcopy /s /e /y build\web\* ..\gh-pages\
cd /d ..\gh-pages
git add .
git commit -m "Deploy build/web"
git push -f origin gh-pages
cd /d ..\sym-balls
git worktree remove ..\gh-pages
pause
