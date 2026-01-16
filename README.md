# Traviso Isometric JS Engine
[![npm](https://img.shields.io/npm/v/traviso.js.svg)](https://www.npmjs.com/package/traviso.js)

![traviso.js logo](https://www.travisojs.com/img/logo_small.jpg)

#### JavaScript Isometric World Engine

Traviso is an open source JS engine that makes it easy to build isometric
applications that run in a web browser. It aims maximum flexibility in
order you to implement your own logic on top of it. Along with a set of
optimised algorithms, Traviso is built on top of the awesomely fast
[pixi.js](https://www.pixijs.com) rendering engine.

If you’re interested, you can follow me on twitter
([@axaq](https://twitter.com/axaq)) or visit the
[website](http://www.travisojs.com/) for more info.

### Tutorials

-   [Basic Isometric World](http://www.travisojs.com/blog/tutorial/2015/03/15/basic-isometric-world.html)

-   [How to Customize](http://www.travisojs.com/blog/tutorial/2015/03/15/engine-configuration.html)

-   [Data File Structure](http://www.travisojs.com/blog/tutorial/2015/03/15/data-file-structure.html)

-   [Camera Controls](http://www.travisojs.com/blog/demo/2015/03/20/camera-controls.html)

-   [Callbacks](http://www.travisojs.com/blog/demo/2015/03/21/how-to-use-callbacks.html)

### Docs

You can find the documentation [here](http://www.travisojs.com/docs/)

### What is Ahead

-   More tutorials
-   Built-in multi-controllable support
-   Priority levels for moving objects
-   Built-in support for block-like tiles
-   Ground/terrain height
-   Fog of war

### Contribute

Do you want to contribute? That's awesome. You can either message me through Twitter ([@axaq](https://twitter.com/axaq)) or use the Traviso.js [blog](http://www.travisojs.com/blog/).

### How to build

After cloning the repo, install the build dependencies using npm:

```bash
$> npm install
```

Then build:

```bash
$> npm run build
```

This will create browser, CommonJS, and ES module versions of the library under `dist` folder. A minified version for browsers can be found at the same place.

### Usage

```javascript
// Here, we initialize the pixi application
var pixiRoot = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xffffff,
});

// add the renderer view element to the DOM
document.body.appendChild(pixiRoot.view);

// engine-instance configuration object
var instanceConfig = {
    mapDataPath: 'mapData.json', // the path to the json file that defines map data, required
    assetsToLoad: ['../assets/spritesheet.json', '../assets/house.png'], // array of paths to the assets that are desired to be loaded by traviso, no need to use if assets are already loaded to PIXI cache, default null
};

// initialize traviso instance and add it to the stage
var engine = TRAVISO.getEngineInstance(instanceConfig);
pixiRoot.stage.addChild(engine);
```

You can now also use traviso as a npm module:

```bash
$> npm install traviso.js
```

```javascript
import * as TRAVISO from 'traviso.js';

var engine = TRAVISO.getEngineInstance(instanceConfig);
```

This content is released under the (http://opensource.org/licenses/MIT) MIT License.
