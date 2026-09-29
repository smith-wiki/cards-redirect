# cards-redirect

Serves `cards.smith.wiki`, the first host of the Card site, and sends every
visitor to [andy.smith.wiki](https://andy.smith.wiki) at the same path:
`cards.smith.wiki/<id>/` → `andy.smith.wiki/<id>/`.

Published Cards and Bluesky posts link to the old host and can never be edited,
so this repository must keep serving the domain.

- `<id>/index.html` — one page per Card, served with 200. It carries the Card's
  own title, description, and image (link previews of old URLs still show the
  Card), `rel=canonical` to the new page, a `location.replace` that keeps the
  query and fragment, and `meta refresh` for clients without JavaScript.
- `index.html`, `all/index.html` — the same for the home page and `/all/`.
- `404.html` — any other path: redirects with `location.replace`, or to the
  home page without JavaScript.

`generate.mjs` wrote the pages from a checkout of `smith-wiki/cards`
(`node generate.mjs ../cards`). Cards created after the move link to
andy.smith.wiki, so the set is complete and is not regenerated.

GitHub Pages (deploy from branch `main`, `/`), custom domain `cards.smith.wiki`,
DNS `CNAME cards -> smith-wiki.github.io`.
