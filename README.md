![Node version](https://img.shields.io/node/v/solfegejs.svg)
![Version](https://img.shields.io/npm/v/solfegejs.svg)
[![Build status](https://travis-ci.org/neolao/solfege.svg)](https://travis-ci.org/neolao/solfege)
[![dependencies Status](https://david-dm.org/neolao/solfege/status.svg)](https://david-dm.org/neolao/solfege)
[![devDependencies Status](https://david-dm.org/neolao/solfege/dev-status.svg)](https://david-dm.org/neolao/solfege?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/neolao/solfege/badge.svg)](https://coveralls.io/github/neolao/solfege)

SolfegeJS
=========

The modular framework for NodeJS.

This is the main module that handles bundles.

Requirements
------------

- NodeJS >= 5


Installation
------------

```bash
npm install solfegejs
```

Example
-------

```javascript
import solfege from "solfegejs";
import MyBundle from "./MyBundle";

// Create application
let application = solfege.factory();
application.addBundle(new MyBundle);

// Start the application
application.start();
```

```bash
node --harmony start.js
```

Documentation
-------------

- [Create a bundle](documentation/create-bundle.md)
- [Service container](documentation/service-container.md)
- [Command line interface](documentation/command-line-interface.md)
- [Load configuration file](documentation/configuration.md)
