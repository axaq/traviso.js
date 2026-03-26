# Example 7

This fixture tests the package through an `npm pack` tarball, which is closer to
real npm consumption than importing directly from `dist/`.

## Usage

```bash
npm run pack:traviso
npm install --legacy-peer-deps
npm run build
```

After that, serve this folder with any static file server and open `index.html`.
