import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    borderRadius: { DEFAULT: '0', none: '0' },
    extend: {
      colors: {
        'bg-canvas':   '#050505',
        'bg-titlebar': '#080808',
        'bg-surface':  '#0a0a0a',
        'bg-chrome':   '#0c0c0c',
        'border-subtle':  '#1a1a1a',
        'border-default': '#2a2a2a',
        'border-em':      '#333333',
        'text-primary':   '#e8e8e8',
        'text-secondary': '#888888',
        'text-muted':     '#666666',
        'text-disabled':  '#555555',
        'text-ghost':     '#444444',
        'text-line-num':  '#333333',
        'accent':      '#4aeadc',
        'cat-sketch':  '#3dff9a',
        'cat-solid':   '#ff4aea',
        'cat-curve':   '#ff8a3d',
        'cat-select':  '#4aeadc',
        'cat-io':      '#ffd23d',
        'cat-nested':  '#b97dff',
        'danger':      '#ff5a5a',
        'amber':       '#ffb347',
      },
      fontFamily: {
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['"Barlow Condensed"', 'sans-serif'],
      },
      transitionDuration: {
        DEFAULT: '100ms',
        drawer:  '150ms',
      },
    },
  },
} satisfies Config
