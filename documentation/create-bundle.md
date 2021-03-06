Create a bundle
===============

Typical file tree:

```
my-bundle
├── lib
│   ├── Bundle.js
│   ├── Command
│   │   └── StartCommand.js
│   └── services.yml
├── console.js
├── package.json
└── start.js
```

`lib/Bundle.js`
---------------

The only required method is `getPath()` that returns root path of the bundle.

```javascript
/**
 * My bundle
 * Main class
 */
export default class Bundle
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath()
    {
        return __dirname;
    }
}
```

`lib/services.yml`
------------------

This file defines services, see [Service Container documentation](./service-container.md).


```yaml
services:
    mybundle_start:
        class: "Command/StartCommand"
        tags:
            - { name: "solfege.console.command" }
```

By default, the file `services.yml` in bundle root is loaded.


`lib/Command/StartCommand`
--------------------------

This file defines a command for the console bundle, see [Command Line Interface documentation](./command-line-interface.md).


```javascript
/**
 * Start command
 */
export default class StartCommand extends ContainerAwareCommand
{
    /**
     * Get command name
     *
     * @return  {string}    Command name
     */
    getName()
    {
        return "mybundle:start";
    }

    /**
     * Get command description
     *
     * @return  {string}    Command description
     */
    getDescription()
    {
        return "Start my bundle";
    }

    /**
     * Execute the command
     *
     * @param   {Array}     parameters      Parameters
     * @param   {Array}     options         Optional parameters
     */
    *execute(parameters, options)
    {
        console.log("My bundle is started");
    }
}
```


`console.js`
------------

This file is used to interact with SolfegeJS via the console bundle.

```javascript
"use strict"

let solfege = require("solfegejs");
let MyBundle = require("./lib/Bundle");

let application = solfege.factory();
application.addBundle(new MyBundle);

let parameters = process.argv.slice(2);
application.start(parameters);
```

By calling `node ./console.js`, all commands are listed.

And you can run your custom command like that:

```bash
node ./console.js mybundle:start
```


`start.js`
----------

This file initializes the application and run a command.

```javascript
"use strict"

let solfege = require("solfegejs");
let MyBundle = require("./lib/Bundle");

let application = solfege.factory();
application.addBundle(new MyBundle);

application.start(["mybundle:start"]);
```

