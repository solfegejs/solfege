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
application.loadConfigurationFile(`${__dirname}/config/production.yml`, "yaml");
```

Now the properties are available in the service container:

```yaml
services:
    my_service:
        class: "MyClass"
        arguments:
            - "%foo%"
            - "%server.host%"
            - "%server.port%"
```


Override configuration file
---------------------------

You can override configuration file with another one (see https://github.com/neolao/config-yaml):

`default.yml`:

```yaml
foo: "hello"
server:
    host: "example.com"
    port: 80
```


`production.yml`:

```yaml
imports:
    - { resource: "default.yml" }

foo: "bar"
server:
    host: "example.com"
    port: 8080
```

Preset properties
-----------------

| Name                           | Description                                       |
| ------------------------------ | ------------------------------------------------- |
| `main_directory_path`          | Directory of the main NodeJS file                 |
| `configuration_directory_path` | Directory of the configuration file (if provided) |
