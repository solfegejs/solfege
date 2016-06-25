SolfegeJS
=========

The modular framework for NodeJS.

This is the main module that handles bundles.

Requirements
------------

- NodeJS >= 5
- Babel >= 6


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

// Add bundles
solfege.addBundle(new MyBundle);

// Start the application
solfege.start();
```

Documentation
-------------

- [Create a bundle](documentation/create-bundle.md)
- [Service container](documentation/service-container.md)
- [Command line interface](documentation/command-line-interface.md)
