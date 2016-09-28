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
let parameters = process.argv.slice(2);

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

| Method         | Description                 | Mandatory |
| -------------- | --------------------------- | --------- |
| getName        | Returns command name        | Yes       |
| execute        | Execute the command         | Yes       |
| getDescription | Returns command description | No        |

```javascript
/**
 * My command
 */
export default class MyCommand
{
    /**
     * Get command name
     *
     * @return  {string}    Command name
     */
    getName()
    {
        return "my-command";
    }

    /**
     * Get command description
     *
     * @return  {string}    Command description
     */
    getDescription()
    {
        return "My useful command";
    }

    /**
     * Execute the command
     *
     * @param   {Array}     parameters      Parameters
     * @param   {Array}     options         Optional parameters
     */
    *execute(parameters, options)
    {
        console.log("My command executed");
    }
}
```


Now you can call your command like that:

```bash
node console.js my-command
```

