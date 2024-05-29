const esbuild = require('esbuild')
const { nodeExternalsPlugin } = require('esbuild-node-externals')

esbuild.build({
  entryPoints: [process.env.HANDLER],
  bundle: true,
  platform: 'node',
  treeShaking: true,
  format: 'cjs',
  minify: true,
  outdir: 'dist/handlers',
  external: ['/node_modules/*'],
  plugins: [nodeExternalsPlugin()],
})
