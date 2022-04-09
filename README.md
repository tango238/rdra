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

And see the link below.

https://github.com/tango238/rdra/wiki

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

Update mermaid.js

```shell
$ cp ./node_modules/mermaid/dist/mermaid.min.js ./src/cmd/mermaid
```

### Release

```shell
$ npm run build
$ npm run test
$ npm publish
$ npm install
$ git push origin main
```
