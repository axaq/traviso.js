/**
 * @author Hakan Karlidag - @axaq
 */
    // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return {
                TRAVISO: TRAVISO
            };
        });
    }

    // Add support for CommonJS libraries such as browserify.
    if (typeof exports !== 'undefined') {
        exports.TRAVISO = TRAVISO;
    }

    // Define globally in case AMD is not available or unused.
    if (typeof window !== 'undefined') {
        window.TRAVISO = TRAVISO;
    } else if (typeof global !== 'undefined') { // Add to global in Node.js (for testing, etc).
        global.TRAVISO = TRAVISO;
    }
}).call(this);