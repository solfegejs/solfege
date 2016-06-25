Service container
=================

The service container is an implementation of Dependency Injection pattern.
It manages the instantiation of objects (services).

Create a service
----------------

By default, the service container looks into bundles a YAML file `services.yml`.
It is used to define services.

For example:

```yaml
services:
    # My service named "my_service"
    my_service:
        class: "Path/To/MyService"

    # Foo
    foo:
        class: "Path/To/Foo"
        arguments:
            - "a"
            - "b"

```

The class paths are relative to bundle path.

Now in your code, you can retrieve the service like this:

```javascript
let foo = container.get("foo");
let sameFoo = container.get("foo");
```

A service is instantiate once.

Arguments
---------

You can define constructor arguments with the keyword `arguments`.
Each argument is treated as a primitive like `string`, `number` or `array`.

Example:

```yaml
services:
    my_service:
        class: "Path/To/MyService"
        arguments:
            - "foo"
            - 42
            - ["a", "b"]
```

You can also inject another service as an argument by prefixing the name with `@`:

```yaml
services:
    my_service:
        class: "Path/To/MyService"
        arguments:
            - "@foo"

    foo:
        class: "Path/To/MyService"
```

