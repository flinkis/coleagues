# Coleagues
Fight your colleagues and use coleagues to keep game statistics, generate tournaments and more.

## Getting Started

```sh
$ npm install
```

Start the local dev server:

```sh
$ npm start
```

Navigate to **http://localhost:8080/** to view the app.

## Commands

### server

```sh
$ npm run start
```

**Input:** `src/main.jsx`

This leverages [React Hot Loader](https://github.com/gaearon/react-hot-loader) to automatically start a local dev server and refresh file changes on the fly without reloading the page.

It also automatically includes source maps, allowing you to browse code and set breakpoints on the original ES6 code:

### build

```sh
$ npm run build
```

**Input:** `src/main.jsx`

**Output:** `build/app.js`

Build minified app for production using the [production](http://webpack.github.io/docs/cli.html#production-shortcut-p) shortcut.


### clean

```sh
$ npm run clean
```

**Input:** `build/app.js`

Removes the compiled app file from build.