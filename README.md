# mylesshaddix.com site

Plain HTML/CSS/JS, no builder, no subscription. Rebuilt from the Wix design.

## Files
- index.html: Films
- photos.html, perspective.html, contact.html
- styles.css: all styling (colors, fonts, spacing)
- main.js: video/photo lightbox, contact form
- assets/img, assets/video: media

## Editing
- Add a film: copy one `<article class="film">` block in index.html, drop the .mp4 in assets/video and a thumbnail .jpg in assets/img, update the paths and title.
- Add a photo: drop the .jpg in assets/img, copy a `<button><img></button>` into one of the three columns in photos.html.

## Hosting free on GitHub Pages
1. Free GitHub account at github.com. The username becomes the web address (username.github.io).
2. Install GitHub Desktop (desktop.github.com) and sign in. Use the app, not the website uploader, because the website caps uploads at 25MB and the videos are bigger.
3. In GitHub Desktop: File > Add Local Repository > pick this folder. Commit everything, then Publish repository named `username.github.io`, with "Keep this code private" unchecked.
4. On github.com, open the repo > Settings > Pages > Source: Deploy from a branch, `main`, `/ (root)`.
5. Live at https://username.github.io within a couple minutes. Custom domain optional (~$10-12/year).
6. Future edits: change files, then Commit and Push in GitHub Desktop. The site updates itself.

GitHub caps single files at 100MB, so videos are compressed to stay under that.

## Contact form
Uses FormSubmit (free, no account). The first time someone submits the live form, FormSubmit emails mylesshaddix@gmail.com a one-time confirmation link. Click it and every message after that lands in the inbox.
