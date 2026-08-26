import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

// Конфиг для БЭКЕНДА (Express + Mongoose). React-плагинов здесь нет намеренно:
// ни одного .jsx/.tsx файла в server/ не появится. Фронтенд получит свой конфиг
// в web/ — его сгенерирует create-next-app на eslint-config-next, где правила
// React и hooks уже включены.

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },

  js.configs.recommended,

  {
    // Правила с анализом типов — только для исходников из tsconfig.json.
    // projectService требует, чтобы КАЖДЫЙ проверяемый файл принадлежал проекту;
    // примени это ко всему подряд — и линт упадёт на самом eslint.config.js
    // с "was not found by the project service".
    //
    // Главное, что даёт анализ типов: no-floating-promises. Без него незаваленный
    // await в транзакции, обработчике вебхука или «подметальщике» (Этап 7)
    // проходит линт молча и превращается в потерянную ошибку в рантайме.
    files: ['src/**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },

  {
    // Конфиги в корне пакета: обычный JS, типового анализа для них нет и не нужно.
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  // Последним: выключает правила ESLint, которые спорят с Prettier о форматировании.
  // Prettier запускается отдельной командой (npm run format / format:check),
  // а не плагином внутри линта — так вывод линта остаётся про логику, а не про запятые.
  eslintConfigPrettier,
);
