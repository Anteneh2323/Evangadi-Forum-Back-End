# Developer Guide 
## Clone and Run

```
git clone https://github.com/Evangadi-Forum/Evangadi-Forum-Back-End.github
cd Evangadi-Forum-Back-End
npm install
node app.js
```

## API Routes

Here are the available API routes organized by hierarchy:

### `/api`
- `/users`
  - `/register`
  - `/login`
  - `/check`
  - `/forgot-password`
- `/question`
  - `/ask-question`
  - `/all-questions`
  - `/single-question/<question:id>`
- `/answers`
  - `/single-answer`
  - `/all-answers`
  - `/edit-answer/<answer:id>`
