Configuration file
==================

You can load configuration file in YAML format like that:

```yaml
foo: "bar"
server:
    host: "example.com"
    port: 8080
```

```javascript
import solfege from "solfegejs";
import MyBundle from "./MyBundle";

// Create application
let application = solfege.factory();
application.addBundle(new MyBundle);

// Load configuration
application.loadConfiguration(`${__dirname}/config/production.yml`);
```

Now the properties are available in the service container:

```yaml
services:
    my_service:
        class: "MyClass"
        arguments:
            - "%foo"
            - "%server.host"
            - "%server.port"
```
