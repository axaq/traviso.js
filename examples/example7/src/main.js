import { Application } from 'pixi.js';
import { getEngineInstance } from 'traviso.js';

import { addCameraControls } from './cameraControls.js';

const BUTTON_TEXTURE_PATHS = [
    '../assets/btn_centralize.png',
    '../assets/btn_zoomIn.png',
    '../assets/btn_zoomOut.png',
    '../assets/btn_centralizeToObject.png',
    '../assets/btn_focusToObject.png',
];

const pixiRoot = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x6bacde,
});

document.body.appendChild(pixiRoot.view);

getEngineInstance({
    mapDataPath: './mapData.json',
    assetsToLoad: [
        '../assets/assets_map.json',
        '../assets/assets_characters.json',
        ...BUTTON_TEXTURE_PATHS,
    ],
    engineInstanceReadyCallback: (engine) => {
        pixiRoot.stage.addChild(engine);
        addCameraControls({ engine, stage: pixiRoot.stage });
    },
});
