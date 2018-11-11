Traviso Isometric JS Engine 
=============

![traviso.js logo](http://www.travisojs.com/img/logo_small.jpg) 

#### JavaScript Isometric World Engine ####

Traviso is an open source JS engine that makes it easy to build isometric 
applications that run in a web browser. It aims maximum flexibility in 
order you to implement your own logic on top of it. Along with a set of 
optimised algorithms, Traviso is built on top of the awesomely fast 
[pixi.js](http://www.pixijs.com) rendering engine.

If you’re interested, you can follow me on twitter
([@axaq](https://twitter.com/axaq)) or visit the 
[website](<http://www.travisojs.com/>) for more info.



### Tutorials ###

- [Basic Isometric World](<http://www.travisojs.com/blog/tutorial/2015/03/15/basic-isometric-world.html>)

- [How to Customise](<http://www.travisojs.com/blog/tutorial/2015/03/15/engine-configuration.html>)

- [Data File Structure](<http://www.travisojs.com/blog/tutorial/2015/03/15/data-file-structure.html>)

- [Camera Controls](<http://www.travisojs.com/blog/demo/2015/03/20/camera-controls.html>)

- [Callbacks](<http://www.travisojs.com/blog/demo/2015/03/21/how-to-use-callbacks.html>)



### Docs ###

You can found the documentation [here](<http://www.travisojs.com/docs/>)


### What is Ahead ###

* More tutorials
* Built-in multi-controllable support
* Priority levels for moving objects
* Built-in support for block-like tiles
* Ground/terrain height
* Fog of war

### Contribute ###

Do you want to contribute? That's awesome. You can either message me through Twitter ([@axaq](https://twitter.com/axaq)) or use the Traviso.js [blog](http://www.travisojs.com/blog/).

### How to build ###

Traviso.js is build with Grunt. If you don't already have this, go install Node and NPM then install the Grunt Command Line.

```
$> npm install -g grunt-cli
```

Then, in the 'tools' folder where you have downloaded the source, install the build dependencies using npm:

```
$> cd tools
$> npm install
```

Then build:

```
$> grunt
```

This will create a minified version at bin/traviso.js and a non-minified version at bin/traviso.dev.js.



### Usage ###

```javascript

    // Here, we initialize the pixi application
    var pixiRoot = new PIXI.Application(800, 600, { backgroundColor : 0xFFFFFF });

    // add the renderer view element to the DOM
    document.body.appendChild(pixiRoot.view);
    
    // engine-instance configuration object
    var instanceConfig = {
        mapDataPath : "mapData.json", // the path to the json file that defines map data, required
        assetsToLoad : ["../assets/spritesheet.json", "../assets/house.png"], // array of paths to the assets that are desired to be loaded by traviso, no need to use if assets are already loaded to PIXI cache, default null
    };
    
    // initialize traviso instance and add it to the stage
    var engine = TRAVISO.getEngineInstance(instanceConfig);
    pixiRoot.stage.addChild(engine);

```

This content is released under the (http://opensource.org/licenses/MIT) MIT License.


