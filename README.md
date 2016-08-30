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
