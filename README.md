### What is RDRA?

### About this CLI

### Install
```shell
$ npm install -g rdra
```

### Getting started

```shell
$ rdra init
$ cat rdra.yml
$ rdra -f rdra.yml list
```

### JSON Schema

See `src/schema.json`

### Editor Setting
**VS Code**

https://code.visualstudio.com/docs/languages/json

**IntelliJ**

https://pleiades.io/help/idea/json.html

### Available Commands
```shell
$ rdra -f [file] actor
$ rdra -f [file] usecase
$ rdra -f [file] usecase -b [BUC]
$ rdra -f [file] state
$ rdra -f [file] view
$ rdra -f [file] list
```




### Development

```shell
$ git clone https://github.com/tango238/rdra.git
$ cd rdra
$ tsc
$ npm link
```
