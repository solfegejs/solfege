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
import ContainerAwareCommand from "solfegejs/lib/bundles/Console/Command/ContainerAwareCommand";

/**
 * Start command
 */
export default class StartCommand extends ContainerAwareCommand
{
    /**
     * Configure command
     */
    *configure()
    {
        this.setName("mybundle:start");
        this.setDescription("Start my bundle");
    }

    /**
     * Execute the command
     */
    *execute()
    {
        console.info("My bundle started");
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

let parameters = process.argv;
parameters.shift();
parameters.shift();
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

