import { assert } from 'chai';
import { Assets } from 'pixi.js';
import { EngineView, TEngineConfiguration } from '../src/map/EngineView';
import { getEngineInstance } from '../src/index';
import { TMapData } from '../src/utils/map';

type TAssetLoad = typeof Assets.load;

const createMapData = (): TMapData => ({
    tiles: {
        1: {
            movable: true,
            path: '',
        },
    },
    objects: {},
    initialControllableLocation: null,
    tileHighlightImage: null,
    singleGroundImage: null,
    groundMap: [{ row: '1' }],
    objectsMap: [{ row: '0' }],
    groundMapData: [],
    objectsMapData: [],
});

const installAssetsLoadStub = (impl: TAssetLoad): (() => void) => {
    const originalLoad = Assets.load;
    Object.defineProperty(Assets, 'load', {
        configurable: true,
        writable: true,
        value: impl,
    });

    return () => {
        Object.defineProperty(Assets, 'load', {
            configurable: true,
            writable: true,
            value: originalLoad,
        });
    };
};

const waitForEngineReady = (config: Partial<TEngineConfiguration> = {}): Promise<EngineView> =>
    new Promise((resolve) => {
        getEngineInstance({
            mapDataPath: 'mapData.json',
            ...config,
            engineInstanceReadyCallback: (engine) => {
                config.engineInstanceReadyCallback?.(engine);
                resolve(engine);
            },
        } as TEngineConfiguration);
    });

describe('EngineView Pixi 7 integration', () => {
    it('loads assets through PIXI.Assets and initializes the engine', async () => {
        const calls: Array<unknown> = [];
        const restoreAssetsLoad = installAssetsLoadStub(async (assetPaths) => {
            calls.push(assetPaths);
            if (Array.isArray(assetPaths)) {
                return assetPaths;
            }
            return createMapData();
        });

        try {
            const engine = await waitForEngineReady({
                assetsToLoad: ['assets_map.json', 'assets_characters.json'],
            });

            assert.deepEqual(calls, [['assets_map.json', 'assets_characters.json'], 'mapData.json']);
            assert.instanceOf(engine, EngineView);
            assert.deepEqual(engine.mapData.groundMapData, [['1']]);
            assert.deepEqual(engine.mapData.objectsMapData, [['0']]);

            engine.destroy();
        } finally {
            restoreAssetsLoad();
        }
    });

    it('uses federated pointer events for click selection without treating drags as clicks', async () => {
        const restoreAssetsLoad = installAssetsLoadStub(async () => createMapData());
        let tileSelection: { r: number; c: number } = null;

        try {
            const engine = await waitForEngineReady({
                tileSelectCallback: (r, c) => {
                    tileSelection = { r, c };
                },
            });

            const tile = engine.getTileAtRowAndColumn(0, 0);
            const globalPoint = (engine as any)._mapContainer.toGlobal({
                x: tile.position.x,
                y: tile.position.y,
            });

            (engine as any).onMouseDown({ global: globalPoint });
            (engine as any).onMouseMove({
                global: {
                    x: globalPoint.x + 10,
                    y: globalPoint.y + 10,
                },
            });
            (engine as any).onMouseUp({
                global: {
                    x: globalPoint.x + 10,
                    y: globalPoint.y + 10,
                },
            });
            assert.isNull(tileSelection);

            (engine as any).onMouseDown({ global: globalPoint });
            (engine as any).onMouseUp({ global: globalPoint });

            assert.deepEqual(tileSelection, { r: 0, c: 0 });

            engine.destroy();
        } finally {
            restoreAssetsLoad();
        }
    });
});
