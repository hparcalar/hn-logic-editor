/* eslint-disable @typescript-eslint/no-var-requires */
import colors from 'windicss/colors';
import plugin from 'windicss/plugin';
import { defineConfig } from 'vite-plugin-windicss';
import pluginForms from 'windicss/plugin/forms';
import pluginScrollSnap from 'windicss/plugin/scroll-snap';

const formSelectors = [
  '[type="text"]',
  '[type="email"]',
  '[type="url"]',
  '[type="password"]',
  '[type="number"]',
  '[type="date"]',
  '[type="datetime-local"]',
  '[type="month"]', '[type="search"]',
  '[type="tel"]',
  '[type="time"]',
  '[type="week"]',
  '[multiple]',
  'textarea',
  'select',
];

export default defineConfig({
  darkMode: 'class',
  plugins: [
    pluginForms,
    // Overriding border color of form elements
    plugin(({ addBase }) => {
      addBase(
        Object.fromEntries(
          formSelectors.map(selector =>
            [
              selector, {
                'border-color': colors.gray[300],
              },
            ],
          ),
        ),
      );
    }),
    pluginScrollSnap,
  ],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: colors.gray[300],
      },
    },
  },
});
