# GitHub Pages Setup

Instructions for hosting this Jekyll site on GitHub Pages.

## 1. Create the Repository

- Go to https://github.com/new
- Name it `<your-org>.github.io` for an organization/user site, or any name for a project site
- The repository must be **public** (unless you have GitHub Pro, Team, or Enterprise)

## 2. Enable GitHub Pages

1. Go to your repository's **Settings > Pages**
2. Under **Source**, select the branch to deploy from (usually `main`)
3. Select the folder (`/ (root)` for most Jekyll sites)
4. Click **Save**

GitHub will automatically detect `_config.yml` and build the site with Jekyll.

## 3. Access Your Site

Your site will be live at:

- `https://<your-org>.github.io` for organization/user sites
- `https://<your-org>.github.io/<repo-name>` for project sites

## Gemfile Compatibility

GitHub Pages uses a specific set of Jekyll plugins and versions. Your `Gemfile` should use the `github-pages` gem to stay compatible:

```ruby
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
```

## Custom Domain

To use your own domain (e.g., `yourcompany.com`) instead of `github.io`:

1. Add a `CNAME` file to the repo root containing your domain:
   ```
   yourcompany.com
   ```
2. Configure DNS with your domain registrar:
   - For an apex domain (`yourcompany.com`), add A records pointing to GitHub's IP addresses:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - For a subdomain (`www.yourcompany.com`), add a CNAME record pointing to `<your-org>.github.io`
3. In your repo, go to **Settings > Pages > Custom domain**, enter your domain, and save

## HTTPS

GitHub provides free HTTPS for GitHub Pages sites. After your domain has propagated, check **Enforce HTTPS** in **Settings > Pages**.

## Troubleshooting

### Site not updating after a push

Check the **Actions** tab in your repository for build errors. GitHub also sends email notifications on failed builds.

### Bypassing Jekyll

If you want to deploy plain HTML without Jekyll processing, add an empty `.nojekyll` file to the repo root.
