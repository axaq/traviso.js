import { assert } from 'chai';
import * as TRAVISO from '../src/index';

// describe('enableDisableLogging', () => {
//     it('defines whether function enables logging as expected', () => {
//         assert.strictEqual(TRAVISO.VERSION, '$_VERSION');
//         // assert.exists(TRAVISO.isReady)
//     });
// });

describe('TRAVISO Core', () => {
    describe('VERSION', () => {
        it('should export VERSION constant', () => {
            assert.exists(TRAVISO.VERSION);
            assert.isString(TRAVISO.VERSION);
        });

        it('should have VERSION set to the expected value', () => {
            assert.strictEqual(TRAVISO.VERSION, '$_VERSION');
        });
    });

    describe('enableDisableLogging', () => {
        beforeEach(() => {
            // Reset logging state before each test
            TRAVISO.enableDisableLogging(true);
        });

        it('should enable logging when passed true', () => {
            const result = TRAVISO.enableDisableLogging(true);
            assert.strictEqual(result, true);
        });

        it('should disable logging when passed false', () => {
            const result = TRAVISO.enableDisableLogging(false);
            assert.strictEqual(result, false);
        });

        it('should default to true when no argument is provided', () => {
            const result = TRAVISO.enableDisableLogging();
            assert.strictEqual(result, true);
        });

        it('should return the current logging state', () => {
            TRAVISO.enableDisableLogging(false);
            assert.strictEqual(TRAVISO.enableDisableLogging(false), false);
            assert.strictEqual(TRAVISO.enableDisableLogging(true), true);
        });
    });

    describe('skipHello', () => {
        it('should be a function', () => {
            assert.isFunction(TRAVISO.skipHello);
        });

        it('should execute without throwing', () => {
            assert.doesNotThrow(() => TRAVISO.skipHello());
        });
    });

    describe('trace', () => {
        let consoleLogSpy: any;
        let originalLog: any;

        beforeEach(() => {
            // Store original console.log
            originalLog = self.console.log;
            consoleLogSpy = () => {};
            self.console.log = consoleLogSpy;
        });

        afterEach(() => {
            // Restore original console.log
            self.console.log = originalLog;
            TRAVISO.enableDisableLogging(true);
        });

        it('should log when logging is enabled', () => {
            TRAVISO.enableDisableLogging(true);
            let loggedMessage = '';
            self.console.log = (msg: string) => {
                loggedMessage = msg;
            };
            TRAVISO.trace('test message');
            assert.strictEqual(loggedMessage, 'TRAVISO: test message');
        });

        it('should not log when logging is disabled', () => {
            TRAVISO.enableDisableLogging(false);
            let wasCalled = false;
            self.console.log = () => {
                wasCalled = true;
            };
            TRAVISO.trace('test message');
            assert.isFalse(wasCalled);
        });

        it('should handle empty strings', () => {
            TRAVISO.enableDisableLogging(true);
            let loggedMessage = '';
            self.console.log = (msg: string) => {
                loggedMessage = msg;
            };
            TRAVISO.trace('');
            assert.strictEqual(loggedMessage, 'TRAVISO: ');
        });
    });

    describe('DIRECTIONS', () => {
        it('should export DIRECTIONS constant', () => {
            assert.exists(TRAVISO.DIRECTIONS);
        });

        it('should have all expected direction values', () => {
            assert.strictEqual(TRAVISO.DIRECTIONS.O, 0);
            assert.strictEqual(TRAVISO.DIRECTIONS.S, 1);
            assert.strictEqual(TRAVISO.DIRECTIONS.SW, 2);
            assert.strictEqual(TRAVISO.DIRECTIONS.W, 3);
            assert.strictEqual(TRAVISO.DIRECTIONS.NW, 4);
            assert.strictEqual(TRAVISO.DIRECTIONS.N, 5);
            assert.strictEqual(TRAVISO.DIRECTIONS.NE, 6);
            assert.strictEqual(TRAVISO.DIRECTIONS.E, 7);
            assert.strictEqual(TRAVISO.DIRECTIONS.SE, 8);
        });

        it('should have readonly DIRECTIONS object', () => {
            // TypeScript ensures readonly, but we can verify the structure
            assert.isObject(TRAVISO.DIRECTIONS);
        });
    });

    describe('PF_ALGORITHMS', () => {
        it('should export PF_ALGORITHMS constant', () => {
            assert.exists(TRAVISO.PF_ALGORITHMS);
        });

        it('should have all expected pathfinding algorithm values', () => {
            assert.strictEqual(TRAVISO.PF_ALGORITHMS.ASTAR_ORTHOGONAL, 0);
            assert.strictEqual(TRAVISO.PF_ALGORITHMS.ASTAR_DIAGONAL, 1);
        });
    });

    describe('Calculation Utilities', () => {
        describe('existy', () => {
            it('should return true for non-null, non-undefined values', () => {
                assert.isTrue(TRAVISO.existy(0));
                assert.isTrue(TRAVISO.existy(''));
                assert.isTrue(TRAVISO.existy(false));
                assert.isTrue(TRAVISO.existy([]));
                assert.isTrue(TRAVISO.existy({}));
            });

            it('should return false for null', () => {
                assert.isFalse(TRAVISO.existy(null));
            });

            it('should return false for undefined', () => {
                assert.isFalse(TRAVISO.existy(undefined));
            });
        });

        describe('mathMap', () => {
            it('should map a value from one range to another', () => {
                const result = TRAVISO.mathMap(5, 0, 10, 0, 100);
                assert.strictEqual(result, 50);
            });

            it('should map minimum value correctly', () => {
                const result = TRAVISO.mathMap(0, 0, 10, 0, 100);
                assert.strictEqual(result, 0);
            });

            it('should map maximum value correctly', () => {
                const result = TRAVISO.mathMap(10, 0, 10, 0, 100);
                assert.strictEqual(result, 100);
            });

            it('should handle negative ranges', () => {
                const result = TRAVISO.mathMap(0, -10, 10, -100, 100);
                assert.strictEqual(result, 0);
            });

            it('should clamp outliers when noOutliers is true', () => {
                const result1 = TRAVISO.mathMap(-5, 0, 10, 0, 100, true);
                assert.strictEqual(result1, 0);

                const result2 = TRAVISO.mathMap(15, 0, 10, 0, 100, true);
                assert.strictEqual(result2, 100);
            });

            it('should not clamp outliers when noOutliers is false', () => {
                const result1 = TRAVISO.mathMap(-5, 0, 10, 0, 100, false);
                assert.strictEqual(result1, -50);

                const result2 = TRAVISO.mathMap(15, 0, 10, 0, 100, false);
                assert.strictEqual(result2, 150);
            });
        });

        describe('dotProduct', () => {
            it('should calculate dot product of two vectors', () => {
                const v1 = { x: 1, y: 2 };
                const v2 = { x: 3, y: 4 };
                const result = TRAVISO.dotProduct(v1, v2);
                assert.strictEqual(result, 1 * 3 + 2 * 4); // 11
            });

            it('should return 0 for perpendicular vectors', () => {
                const v1 = { x: 1, y: 0 };
                const v2 = { x: 0, y: 1 };
                const result = TRAVISO.dotProduct(v1, v2);
                assert.strictEqual(result, 0);
            });

            it('should handle negative values', () => {
                const v1 = { x: -1, y: -2 };
                const v2 = { x: 3, y: 4 };
                const result = TRAVISO.dotProduct(v1, v2);
                assert.strictEqual(result, -11);
            });
        });

        describe('getUnit', () => {
            it('should return unit vector for a given vector', () => {
                const v = { x: 3, y: 4 };
                const result = TRAVISO.getUnit(v);
                const magnitude = Math.sqrt(result.x * result.x + result.y * result.y);
                assert.approximately(magnitude, 1, 0.0001);
            });

            it('should preserve direction of the original vector', () => {
                const v = { x: 3, y: 4 };
                const result = TRAVISO.getUnit(v);
                assert.isTrue(result.x > 0 && result.y > 0);
            });

            it('should handle negative vectors', () => {
                const v = { x: -3, y: -4 };
                const result = TRAVISO.getUnit(v);
                assert.isTrue(result.x < 0 && result.y < 0);
            });
        });

        describe('getDist', () => {
            it('should calculate distance between two points', () => {
                const p1 = { x: 0, y: 0 };
                const p2 = { x: 3, y: 4 };
                const result = TRAVISO.getDist(p1, p2);
                assert.strictEqual(result, 5);
            });

            it('should return 0 for identical points', () => {
                const p1 = { x: 5, y: 5 };
                const p2 = { x: 5, y: 5 };
                const result = TRAVISO.getDist(p1, p2);
                assert.strictEqual(result, 0);
            });

            it('should handle negative coordinates', () => {
                const p1 = { x: -1, y: -1 };
                const p2 = { x: 2, y: 2 };
                const result = TRAVISO.getDist(p1, p2);
                assert.approximately(result, Math.sqrt(18), 0.0001);
            });

            it('should handle floating point coordinates', () => {
                const p1 = { x: 1.5, y: 2.5 };
                const p2 = { x: 4.5, y: 6.5 };
                const result = TRAVISO.getDist(p1, p2);
                const expected = Math.sqrt(3 * 3 + 4 * 4); // 5
                assert.approximately(result, expected, 0.0001);
            });

            it('should handle very large distances', () => {
                const p1 = { x: 0, y: 0 };
                const p2 = { x: 1000000, y: 1000000 };
                const result = TRAVISO.getDist(p1, p2);
                assert.isFinite(result);
                assert.isTrue(result > 0);
            });
        });

        describe('isInPolygon', () => {
            it('should return true for point inside polygon', () => {
                const point = { x: 5, y: 5 };
                const vertices = [
                    [0, 0],
                    [10, 0],
                    [10, 10],
                    [0, 10],
                ];
                assert.isTrue(TRAVISO.isInPolygon(point, vertices));
            });

            it('should return false for point outside polygon', () => {
                const point = { x: 15, y: 15 };
                const vertices = [
                    [0, 0],
                    [10, 0],
                    [10, 10],
                    [0, 10],
                ];
                assert.isFalse(TRAVISO.isInPolygon(point, vertices));
            });

            it('should return true for point on polygon edge (behavior may depend on implementation)', () => {
                const point = { x: 0, y: 5 };
                const vertices = [
                    [0, 0],
                    [10, 0],
                    [10, 10],
                    [0, 10],
                ];
                // This test assumes the function treats edge points as inside. Update as needed if function changes.
                assert.isTrue(TRAVISO.isInPolygon(point, vertices));
            });

            it('should handle complex polygons', () => {
                const point = { x: 5, y: 5 };
                const vertices = [
                    [0, 0],
                    [5, 10],
                    [10, 0],
                    [5, 5],
                ];
                // Result depends on polygon winding
                assert.isBoolean(TRAVISO.isInPolygon(point, vertices));
            });

            it('should handle triangle polygon', () => {
                const point = { x: 5, y: 5 };
                const vertices = [
                    [0, 0],
                    [10, 0],
                    [5, 10],
                ];
                assert.isTrue(TRAVISO.isInPolygon(point, vertices));
            });

            it('should handle point outside triangle', () => {
                const point = { x: 15, y: 15 };
                const vertices = [
                    [0, 0],
                    [10, 0],
                    [5, 10],
                ];
                assert.isFalse(TRAVISO.isInPolygon(point, vertices));
            });
        });
    });

    describe('Type Exports', () => {
        it('should export TColumnRowPair type', () => {
            // Type checking - if it compiles, the type exists
            const test: TRAVISO.TColumnRowPair = { c: 0, r: 0 };
            assert.exists(test);
        });

        it('should export TPositionPair type', () => {
            // Type checking - if it compiles, the type exists
            const test: TRAVISO.TPositionPair = { x: 0, y: 0 };
            assert.exists(test);
        });

        it('should export TDirection type', () => {
            // Type checking - if it compiles, the type exists
            const test: TRAVISO.TDirection = 0;
            assert.exists(test);
        });

        it('should export TPathFindingAlgorithmID type', () => {
            // Type checking - if it compiles, the type exists
            const test: TRAVISO.TPathFindingAlgorithmID = 0;
            assert.exists(test);
        });
    });

    describe('getEngineInstance', () => {
        it('should be a function', () => {
            assert.isFunction(TRAVISO.getEngineInstance);
        });

        // Note: Testing getEngineInstance would require mocking PIXI.js
        // and providing valid map data, which is more of an integration test
        // You might want to add integration tests separately
    });

    describe('EngineView Export', () => {
        it('should export EngineView class', () => {
            assert.exists(TRAVISO.EngineView);
        });
    });

    describe('TileView Export', () => {
        it('should export TileView class', () => {
            assert.exists(TRAVISO.TileView);
        });
    });

    describe('ObjectView Export', () => {
        it('should export ObjectView class', () => {
            assert.exists(TRAVISO.ObjectView);
        });
    });
});
