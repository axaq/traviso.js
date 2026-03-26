// Polyfill browser globals for Node.js test environment
if (typeof global !== 'undefined') {
    // @ts-ignore
    global.self = global;
    // @ts-ignore
    global.window = global;

    // Define navigator if it doesn't exist or override it
    if (!global.navigator) {
        // @ts-ignore
        global.navigator = {
            userAgent: 'node.js',
        };
    } else {
        // Override the getter if it exists
        try {
            Object.defineProperty(global, 'navigator', {
                value: {
                    userAgent: 'node.js',
                },
                writable: true,
                configurable: true,
            });
        } catch (e) {
            // If we can't override, try to set userAgent directly
            if (global.navigator && typeof global.navigator === 'object') {
                // @ts-ignore
                global.navigator.userAgent = 'node.js';
            }
        }
    }

    if (!global.requestAnimationFrame) {
        // @ts-ignore
        global.requestAnimationFrame = (callback: FrameRequestCallback): number =>
            setTimeout(() => callback(Date.now()), 16) as unknown as number;
    }

    if (!global.cancelAnimationFrame) {
        // @ts-ignore
        global.cancelAnimationFrame = (id: number): void => {
            clearTimeout(id);
        };
    }

    // Create a minimal document for PIXI.js
    if (!global.document) {
        // Create a mock 2D canvas context
        const createMockContext = () => ({
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 1,
            fillRect: () => {},
            strokeRect: () => {},
            clearRect: () => {},
            getImageData: () => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 }),
            putImageData: () => {},
            createImageData: () => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 }),
            drawImage: () => {},
            save: () => {},
            restore: () => {},
            translate: () => {},
            rotate: () => {},
            scale: () => {},
            beginPath: () => {},
            closePath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            arc: () => {},
            fill: () => {},
            stroke: () => {},
            clip: () => {},
            measureText: () => ({ width: 0 }),
            transform: () => {},
            setTransform: () => {},
        });

        class MockCanvas {
            public width = 0;
            public height = 0;
            public style = {};

            public getContext(contextType: string): any {
                if (contextType === '2d') {
                    return createMockContext();
                }
                return null;
            }

            public addEventListener(): void {}
            public removeEventListener(): void {}
            public getBoundingClientRect() {
                return {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                };
            }

            public toDataURL(): string {
                return 'data:image/png;base64,';
            }
        }

        // @ts-ignore
        global.HTMLCanvasElement = MockCanvas;

        // @ts-ignore
        global.document = {
            createElement: (tagName: string): any => {
                if (tagName === 'canvas') {
                    return new MockCanvas();
                }
                return {};
            },
            createElementNS: (): any => new MockCanvas(),
            addEventListener: () => {},
            removeEventListener: () => {},
            body: {
                appendChild: <T>(node: T): T => node,
                removeChild: <T>(node: T): T => node,
            } as any,
        };
    }
}
