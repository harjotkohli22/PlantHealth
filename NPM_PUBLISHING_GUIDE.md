# NPM Publishing Guide for plant-health-lib

This guide walks you through publishing `plant-health-lib` to the npm registry and using it in other projects.

## Pre-Publishing Checklist

### 1. Update Package Metadata

Edit `package.json` and update:
- `author` – Your name or organization
- `repository.url` – Your GitHub repository
- `homepage` – GitHub repository URL
- `bugs.url` – GitHub issues URL

```json
{
  "author": "Your Name <you@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/plant-health-lib.git"
  },
  "homepage": "https://github.com/yourusername/plant-health-lib#readme",
  "bugs": {
    "url": "https://github.com/yourusername/plant-health-lib/issues"
  }
}
```

### 2. Ensure Model File is Included

Make sure `src/assets/plant_disease_model.tflite` exists:

```bash
ls -la src/assets/plant_disease_model.tflite
```

**Note:** TFLite model files are binary and will be included in the npm package.

### 3. Test the Package Locally

Test the compiled library locally before publishing:

```bash
# Build the library
npm run build

# Create a tarball to test locally
npm pack

# Install in a test project
npm install ./plant-health-lib-1.0.0.tgz
```

### 4. Create a GitHub Release (Optional)

Push your code to GitHub first:

```bash
git add .
git commit -m "chore: prepare npm package"
git push origin main
```

Then create a GitHub release with version tag.

## Publishing to npm

### Step 1: Create an npm Account

If you don't have one:
1. Go to https://www.npmjs.com/signup
2. Create your account
3. Verify your email

### Step 2: Login to npm

```bash
npm login
```

You'll be prompted for:
- Username
- Password
- Email

### Step 3: Publish the Package

```bash
npm publish
```

**First time publishing?** The package name must be unique. If `plant-health-lib` is taken, update the name in `package.json` and try another name.

### Step 4: Verify Publication

Visit: https://www.npmjs.com/package/plant-health-lib

## Using the Package in Your Projects

### Installation

```bash
npm install plant-health-lib
# or
yarn add plant-health-lib
# or
pnpm add plant-health-lib
```

### Basic Usage

#### Option 1: Import Everything

```typescript
import * as PlantHealth from 'plant-health-lib';

const { useFrameClassifier, useHistory } = PlantHealth;
```

#### Option 2: Import Specific Modules

```typescript
// Hooks
import { useFrameClassifier, useHistory } from 'plant-health-lib/hooks';

// Services
import { classifier, getDiseaseInfo } from 'plant-health-lib/services';

// Components
import { Card, Button, SeverityBadge } from 'plant-health-lib/components';

// Utils
import { classifyImage } from 'plant-health-lib/utils';

// Theme
import { colors, spacing } from 'plant-health-lib/theme';
```

#### Option 3: Named Imports

```typescript
import { useFrameClassifier } from 'plant-health-lib';
import { classifier } from 'plant-health-lib';
```

### Example: Create a Detection Component

```typescript
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFrameClassifier } from 'plant-health-lib';
import { getDiseaseInfo } from 'plant-health-lib/services';

export function PlantDetectionScreen() {
  const { classify, isLoading, lastResult } = useFrameClassifier();
  const [disease, setDisease] = useState(null);

  useEffect(() => {
    if (lastResult) {
      const info = getDiseaseInfo(lastResult.label);
      setDisease({
        name: info.name,
        confidence: lastResult.confidence,
        remedy: info.remedy
      });
    }
  }, [lastResult]);

  return (
    <View>
      {disease && (
        <View>
          <Text>{disease.name}</Text>
          <Text>Confidence: {disease.confidence}%</Text>
          <Text>{disease.remedy}</Text>
        </View>
      )}
    </View>
  );
}
```

## Updating the Package

### Versioning

Use semantic versioning (MAJOR.MINOR.PATCH):

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features, backward compatible)
npm version minor

# Major release (breaking changes)
npm version major
```

### Publishing an Update

```bash
# Make your changes
npm run build

# Update version
npm version patch

# Publish
npm publish

# Or combine:
npm version patch && npm publish
```

## Troubleshooting

### "Package name is already taken"

Choose a different name in `package.json`:
```json
{
  "name": "@yourusername/plant-health-lib"
}
```

### "You do not have permission to publish"

Make sure you're:
1. Logged in (`npm whoami`)
2. Using the correct npm account
3. The package name is unique to your account

### Model file is too large

If `src/assets/plant_disease_model.tflite` exceeds npm's size limits:
- Use npm's optional dependency handling
- Document in README that users must download model separately
- Or host model on a CDN and load at runtime

### Installation size too large

Check what's included:

```bash
npm pack
tar -tzf plant-health-lib-1.0.0.tgz | head -20
```

Update `.npmignore` to exclude unnecessary files (already configured).

## Scoped Packages (Advanced)

If you want to publish under your organization:

```json
{
  "name": "@yourorg/plant-health-lib"
}
```

Then:

```bash
npm publish --access public
```

Users install with:
```bash
npm install @yourorg/plant-health-lib
```

## TypeScript Support

The package includes full TypeScript definitions. Users can import types:

```typescript
import type { ClassificationResult } from 'plant-health-lib';
```

## Next Steps

1. ✅ Package configured for npm
2. 🔄 Update `package.json` metadata
3. 📦 Run `npm run build`
4. 🧪 Test locally with `npm pack`
5. 🚀 Publish with `npm publish`
6. 📝 Share on GitHub, blogs, and social media

## Resources

- npm Documentation: https://docs.npmjs.com/
- Semantic Versioning: https://semver.org/
- TypeScript Package Guide: https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html

## Support

For issues or questions:
- GitHub Issues: https://github.com/yourusername/plant-health-lib/issues
- npm Package Page: https://www.npmjs.com/package/plant-health-lib
