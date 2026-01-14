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

        // @ts-ignore
        global.document = {
            createElement: (tagName: string): any => {
                if (tagName === 'canvas') {
                    return {
                        getContext: (contextType: string): any => {
                            if (contextType === '2d') {
                                return createMockContext();
                            }
                            return null;
                        },
                        width: 0,
                        height: 0,
                        toDataURL: () => 'data:image/png;base64,',
                    };
                }
                return {};
            },
            createElementNS: (): any => ({
                getContext: (): any => createMockContext(),
                width: 0,
                height: 0,
            }),
        };
    }
}
