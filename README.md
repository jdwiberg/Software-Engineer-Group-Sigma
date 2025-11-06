## Before Doing Any Work
git checkout main
git pull origin main

## When you are going to do work
Make a branch and do the work there:

git checkout -b feature/jake-UI

## After doing your work

git add .
git commit -m 'message'
git push origin <mybrachname>

## After pushing
go into github
create merge request with main
resolve conflicts if they exist
merge
THEN DELETE YOUR BRACH - YOU WILL MAKE A NEW BRANCH FOR NEXT TIME YOU DO WORK
