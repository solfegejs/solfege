SolfegeJS
=========

The modular framework for NodeJS.


Requirements
------------

- NodeJS >= 0.12
- Babel >= 5


Installation
------------

```bash
npm install solfegejs
```


Example
-------

Create your application file `./bundle-es6/MyBundle.js`:

```javascript
import solfege from "solfegejs";

export default class MyBundle
{
    constructor()
    {
    }

    *setApplication(application)
    {
        application.on(solfege.kernel.Application.EVENT_START, this.onApplicationStart);
    }

    *onApplicationStart()
    {
         console.log("woot");
    }
}
```

Create the startup file `./bundle-es6/console.js`:

```javascript
import solfege from "solfegejs";
import MyBundle from "./MyBundle";

// Initialize the application
let application = new solfege.kernel.Application(__dirname);

// Add the internal bundle
application.addBundle("myBundle", new MyBundle);

// Start the application
application.start();
```

Compile with Babel :

```bash
babel ./bundle-es6 --blacklist=regenerator --out-dir ./bundle-es5
```

Start the application :

```bash
node --harmony --harmony-proxies ./bundle-es5/console.js
```


