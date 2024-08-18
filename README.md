## Dev Dependencies

The following development dependencies are used in this project:

- `@babel/core`: ^7.12.16 - Babel compiler core.
- `@babel/eslint-parser`: ^7.12.16 - ESLint parser for modern JavaScript features.
- `@vue/cli-plugin-babel`: ~5.0.0 - Vue CLI Babel plugin.
- `@vue/cli-plugin-eslint`: ~5.0.0 - Vue CLI ESLint plugin.
- `@vue/cli-service`: ~5.0.0 - CLI service for Vue.js projects.
- `babel-plugin-component`: ^1.1.1 - Babel plugin to import components on demand.
- `eslint`: ^7.32.0 - Linting utility for JavaScript and Vue.js.
- `eslint-plugin-vue`: ^8.0.3 - Official ESLint plugin for Vue.js.
- `less`: ^4.2.0 - CSS pre-processor.
- `less-loader`: ^12.2.0 - Loader for Less files in webpack.
- `vue-template-compiler`: ^2.6.14 - Vue.js compiler for templates.
- `jquery`: ^3.7.1 - Vue.js compiler for templates.

## Project Structure

A brief overview of the project's structure:

```
vue_test/
│
├── public/              # Public assets
├── src/                 # Source code
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── components/      # Vue.js components
│   ├── icons/           # Vue's icons
│   ├── router/          # Vue Router configuration
│   ├── styles/          # CSS and font styles
│   ├── utils/           # Axios links to backend
│   ├── views/           # Vue components
│       ├── Dashboard/           # Students dashboard
│       ├── Login/               # Students login
│   ├── App.vue          # Main Vue component
│   └── main.js          # Application entry point
├── vue.config.js         # modify the default settings of a Vue CLI project
├── babel.config.js      # Babel configuration
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```


## Installation

To install the required dependencies for this project, run the following command:

```bash
npm install

## Development

To start development, use the following command to run the development server:

```bash
npm run serve
```

This will start the server, and any changes you make in the source files will be automatically reloaded.

## Build

To build the project for production, use the following command:

```bash
npm run build
```

This will create an optimized, production-ready build of the project in the `dist/` directory.
