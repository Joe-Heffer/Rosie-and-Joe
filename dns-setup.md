# DNS Setup — rosieandjoe.uk

Investigation into custom domain configuration for GitHub Pages, run 2026-06-20.

## `www.rosieandjoe.uk`

```
$ dig www.rosieandjoe.uk +noall +answer
www.rosieandjoe.uk.	3600	IN	CNAME	joe-heffer.github.io.
joe-heffer.github.io.	2291	IN	A	185.199.110.153
joe-heffer.github.io.	2291	IN	A	185.199.108.153
joe-heffer.github.io.	2291	IN	A	185.199.111.153
joe-heffer.github.io.	2291	IN	A	185.199.109.153
```

`www.rosieandjoe.uk` is a `CNAME` to `joe-heffer.github.io`, which resolves to GitHub Pages' standard load-balanced IP block (`185.199.108-111.153`). This subdomain is correctly configured for GitHub Pages.

```
$ dig www.rosieandjoe.uk AAAA +noall +answer
www.rosieandjoe.uk.	2276	IN	CNAME	joe-heffer.github.io.
joe-heffer.github.io.	2277	IN	AAAA	2606:50c0:8000::153
joe-heffer.github.io.	2277	IN	AAAA	2606:50c0:8001::153
joe-heffer.github.io.	2277	IN	AAAA	2606:50c0:8002::153
joe-heffer.github.io.	2277	IN	AAAA	2606:50c0:8003::153
```

IPv6 also resolves correctly to GitHub Pages' AAAA block.

## `rosieandjoe.uk` (apex)

```
$ dig rosieandjoe.uk +noall +answer
rosieandjoe.uk.		3189	IN	A	217.160.0.17

$ dig rosieandjoe.uk AAAA +noall +answer
rosieandjoe.uk.		3189	IN	AAAA	2001:8d8:100f:f000::200
```

The apex (bare) domain does **not** point to GitHub Pages. `217.160.0.17` and `2001:8d8:100f:f000::200` look like registrar default/parking records (IONOS/1&1 range), not GitHub's IPs.

## Repo check

No `CNAME` file was found in the repository root, so GitHub Pages isn't yet configured to serve this custom domain.

## Outstanding work

1. **Add a `CNAME` file** to the repo root with the canonical domain (`www.rosieandjoe.uk` or `rosieandjoe.uk`).
2. **Fix apex DNS** at the registrar — point `rosieandjoe.uk` to GitHub Pages' IPs:
   - `A`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` (optional): `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
3. **Set the custom domain** in GitHub repo Settings → Pages.
4. Once DNS propagates and GitHub verifies the domain, **enable "Enforce HTTPS"**.
