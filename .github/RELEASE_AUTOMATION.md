# Automated Release System

This repository uses GitHub Actions to automatically create releases when JavaScript files are updated.

## How It Works

The automated release system consists of two workflows:

### 1. Auto Release Workflow (`auto-release.yml`)

**Trigger:** When `youtube-speed-control.user.js` is pushed to the `main` branch

**Process:**
1. Extracts version number from the `@version` tag in the userscript
2. Validates semantic versioning format (e.g., `1.0`, `1.0.1`)
3. Checks if a tag for this version already exists
4. If no tag exists, creates and pushes a new tag
5. Triggers the release workflow

### 2. Release Workflow (`release.yml`)

**Trigger:** When a tag matching pattern `v*` is pushed

**Process:**
1. Extracts version from the tag
2. Pulls changelog from README.md for the specific version
3. Creates a GitHub release with:
   - Version-specific changelog
   - Installation instructions
   - Userscript file and LICENSE as assets

## Version Management

Versions are managed through the `@version` tag in the userscript header:

```javascript
// @version      0.12
```

The system:
- ✅ Supports semantic versioning (e.g., `1.0`, `1.0.1`, `2.1.3`)
- ✅ Prevents duplicate releases for the same version
- ✅ Automatically creates tags and releases
- ✅ Includes comprehensive error handling

## Changelog Format

The system extracts changelogs from README.md using this format:

```markdown
- **v0.12**
  - Added automated workflow for releasing when JS file is updated
  - Fixed workflow to automatically detect version changes and create releases
```

## Manual Release Process

If you need to create a release manually:

1. Update the version in `youtube-speed-control.user.js`
2. Add changelog entry to README.md
3. Commit and push to main branch
4. The automated system will handle the rest

## Permissions Required

The workflows require `contents: write` permission to:
- Create and push tags
- Create releases
- Upload release assets