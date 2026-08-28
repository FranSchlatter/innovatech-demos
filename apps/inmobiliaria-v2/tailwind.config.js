import preset from '../../packages/demo-kit/tokens/tailwind-preset.js'

export default {
  presets: [preset],
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    '../../packages/demo-kit/**/*.{js,jsx}'
  ],
  theme: { extend: {} },
  plugins: []
}
