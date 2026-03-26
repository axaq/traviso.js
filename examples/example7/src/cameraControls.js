import { Sprite, Texture } from 'pixi.js';

const BUTTONS = [
    {
        texturePath: '../assets/btn_zoomIn.png',
        onPointerTap: (engine) => {
            engine.zoomIn();
        },
    },
    {
        texturePath: '../assets/btn_zoomOut.png',
        onPointerTap: (engine) => {
            engine.zoomOut();
        },
    },
    {
        texturePath: '../assets/btn_centralize.png',
        onPointerTap: (engine) => {
            engine.centralizeToCurrentExternalCenter();
        },
    },
    {
        texturePath: '../assets/btn_centralizeToObject.png',
        onPointerTap: (engine) => {
            engine.centralizeToObject(engine.getCurrentControllable());
        },
    },
    {
        texturePath: '../assets/btn_focusToObject.png',
        onPointerTap: (engine) => {
            engine.focusMapToObject(engine.getCurrentControllable());
        },
    },
];

export const addCameraControls = ({ engine, stage }) => {
    let nextX = 8;

    BUTTONS.forEach(({ texturePath, onPointerTap }) => {
        const button = new Sprite(Texture.from(texturePath));

        button.position.x = nextX;
        button.eventMode = 'static';
        button.cursor = 'pointer';
        button.on('pointertap', () => {
            onPointerTap(engine);
        });

        stage.addChild(button);
        nextX += button.width + 8;
    });
};
