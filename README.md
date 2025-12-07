# Stress Bubble Package (P2)

A Svelte 5 component library for tracking and visualizing stress levels through an interactive bubble interface.

## Features

- **Interactive Stress Bubbles** - Visual representation of stress levels (1-5)
- **Calendar Integration** - Track stress across different dates
- **Timeline Navigation** - Easily navigate through dates with a compact timeline
- **Cell-Based Visualization** - Each stress level is represented by removable cells
- **Persistent Storage** - Data saved automatically to localStorage

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Installation

### Install from GitHub (Recommended for Production)

```bash
npm install git+https://github.com/itcOnlineGaming/RWM_P2_2025_Edward_Norton.git#dist
```

### Using Stores

```svelte
<script>
  import { stressData, currentDate, stressActions } from 'stress-bubble';
  
  // Subscribe to stores
  $: console.log('Current date:', $currentDate);
  $: console.log('Stress data:', $stressData);
  
  // Use actions
  function addStressor() {
    stressActions.addStressor('2024-12-07', {
      id: 'custom-id',
      name: 'Work Deadline',
      level: 4,
      notes: 'Big presentation',
      date: '2024-12-07',
      createdAt: Date.now()
    });
  }
</script>
```
## API Integration (Optional)

If you provide a `userId`, the component will attempt to persist data to your API endpoint.

### Expected API Endpoints

**GET** `{apiEndpoint}?userId={userId}`
- Returns: `{ data: StressData }`

**POST** `{apiEndpoint}`
- Body: `{ userId: string, data: StressData }`
- Returns: Success response

### Example API Implementation

```javascript
// Express.js example
app.get('/api/stress-data', async (req, res) => {
  const { userId } = req.query;
  const data = await db.getStressData(userId);
  res.json({ data });
});

app.post('/api/stress-data', async (req, res) => {
  const { userId, data } = req.body;
  await db.saveStressData(userId, data);
  res.json({ success: true });
});
```

## Building from Source

### Prerequisites

- Node.js 20+ or 22+
- npm or pnpm

### Development

```bash
# Clone the repository
git clone https://github.com/itcOnlineGaming/RWM_P2_2025_Edward_Norton.git
cd RWM_P2_2025_Edward_Norton

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test        # Unit tests
npm run test:e2e    # E2E tests

# Run Storybook
npm run storybook
```

### Building the Package

```bash
# Build the package for distribution
npm run build:package

# This creates the dist/ folder with compiled components
```

### Publishing to dist Branch

After building, the dist/ folder contents need to be published to the `dist` branch:

```bash
# Switch to main branch
git checkout main

# Build the package
cd packages/stress-bubble
npm run package
cd ../..

# Switch to dist branch
git checkout dist

# Remove old files (except .git)
rm -rf *

# Copy built package from main
git checkout main -- packages/stress-bubble/dist
git checkout main -- packages/stress-bubble/package.json

# Move to root
mv packages/stress-bubble/dist/* .
mv packages/stress-bubble/package.json .
rm -rf packages

# Update package.json paths (if needed)
# Ensure exports point to ./index.js not ./dist/index.js

# Commit and push
git add .
git commit -m "Update package build"
git push origin dist
```

## Troubleshooting

### Package not resolving

If you get "Failed to resolve entry for package" errors:

1. Ensure the `dist` branch has files at root (not in a `dist/` subdirectory)
2. Check that `package.json` exports point to `./index.js` not `./dist/index.js`
3. Clear npm cache: `npm cache clean --force`
4. Reinstall: `rm -rf node_modules package-lock.json && npm install`

### TypeScript errors

If you see `.ts` extension errors in imports:

1. The source files should import without extensions: `import { x } from './file'` not `'./file.ts'`
2. Rebuild the package after fixing imports
3. Update the dist branch with the corrected build
