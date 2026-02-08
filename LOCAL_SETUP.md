# Local Jekyll Setup

Instructions for running this Jekyll site locally on Windows and macOS.

## Prerequisites

### Windows

1. Download **RubyInstaller with DevKit** from https://rubyinstaller.org/downloads/
   - Choose the latest "Ruby+Devkit" version (e.g., Ruby+Devkit 3.3.x (x64))
2. Run the installer with default settings
3. When prompted at the end of installation, run `ridk install` and select **option 3** (MSYS2 and MINGW development toolchain)
4. Open a new Command Prompt or PowerShell and verify:
   ```
   ruby -v
   gem -v
   ```

### macOS

1. Install Homebrew if you don't have it:
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. Install Ruby (macOS ships with a system Ruby, but it's outdated and read-only):
   ```
   brew install ruby
   ```
3. Add Homebrew Ruby to your PATH. Add this to your `~/.zshrc`:
   ```
   export PATH="/opt/homebrew/bin:$PATH"
   export PATH="$(brew --prefix ruby)/bin:$PATH"
   export PATH="$(gem environment gemdir)/bin:$PATH"
   ```
4. Reload your shell:
   ```
   source ~/.zshrc
   ```
5. Verify:
   ```
   ruby -v
   gem -v
   ```

## Install Dependencies

Run these commands from the project root:

```
gem install bundler
bundle install
```

If `bundle install` fails on Windows with native extension errors, try:

```
gem install jekyll -- --use-system-libraries
bundle install
```

## Run the Development Server

```
bundle exec jekyll serve
```

The site will be available at http://localhost:4000.

Jekyll watches for file changes and rebuilds automatically. Press `Ctrl+C` to stop the server.

### Live Reload

To enable automatic browser refresh on changes:

```
bundle exec jekyll serve --livereload
```

## Build Without Serving

To generate the static site in `_site/` without starting a server:

```
bundle exec jekyll build
```

## Troubleshooting

### Windows: "certificate verify failed" errors

```
gem sources --remove https://rubygems.org/
gem sources --add http://rubygems.org/
```

Or update your certificate bundle:

```
gem update --system
```

### Windows: encoding errors

Set the console encoding before running Jekyll:

```
chcp 65001
```

### macOS: permission errors with gem install

Never use `sudo gem install`. Make sure you are using Homebrew Ruby, not system Ruby:

```
which ruby
```

This should return `/opt/homebrew/opt/ruby/bin/ruby`, not `/usr/bin/ruby`.

### Port 4000 already in use

Use a different port:

```
bundle exec jekyll serve --port 4001
```
