# VT Seva

A youth-friendly site for bridging the gap between students and parents. The deck asks the same question of both sides. Answers are stored for an admin, who can publish chosen ones to Perspectives. The youth survey opens an anonymous Google Form.

Sample admin login: username `admin`, password `seva-bridge`. Change the password with `ADMIN_PASSWORD` in `.env`.

```bash
npm install
npm run dev
```

To run the production build, which keeps the answer board:

```bash
npm run build
npm start
```

Set `ADMIN_PASSWORD` on the host. The sample login stays username `admin` and that password. Answers are stored in `data/board.json` on the server.

On a phone browser, open the site and use Add to Home Screen. It installs as VT Seva, with Home, Deck, Views, and Survey along the bottom. Admin stays under Admin login. The logo is the same one used on https://www.vtsworld.org/.
