Command line interface
======================

SolfegeJS has modular command line interface.
Any bundle can expose new commands.


Main file
---------

In order to expore commands, you need to create a `console.js` file:

```javascript
import solfege from "solfegejs";

// New application
let application = solfege.factory();

// Add external bundles
// ...

// Get command line parameters
// Remove 2 first parameters (node and the script)
let parameters = process.argv;
parameters.shift();
parameters.shift();

// Start the application
application.start(parameters);
```

Expose a command
----------------

To expose a command, you have to create a service with a specific tag (see [Service container](service-container.md)):

```yaml
services:
    my_command:
        class: "Command/MyCommand"
        tags:
            - { name: "solfege.console.command" }
```

And your class must implement 2 methods (`getName` and `execute`):

```javascript
export default class MyCommand
{
    getName()
    {
        return "my-command";
    }

    *execute()
    {
        console.log("My command executed");
    }
}
```
