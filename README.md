# cards.smith.wiki

Redirects `cards.smith.wiki`, the first host of the Card site, to
[andy.smith.wiki](https://andy.smith.wiki), keeping the path, query, and
fragment: `cards.smith.wiki/<id>/` → `andy.smith.wiki/<id>/`.

Published Cards and Bluesky posts link to the old host and can never be edited,
so this repository must keep serving the domain.

GitHub Pages (deploy from branch `main`, `/`), custom domain `cards.smith.wiki`,
DNS `CNAME cards -> smith-wiki.github.io`. Pages has no server-side redirects:
every path is served `404.html`, which redirects with `location.replace`
(without JavaScript, it falls back to the home page).
