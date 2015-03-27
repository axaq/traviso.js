/**
 * @author Hakan Karlidag - @axaq
 */

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = TRAVISO;
        }
        exports.TRAVISO = TRAVISO;
    } else if (typeof define !== 'undefined' && define.amd) {
        define(TRAVISO);
    } else {
        root.TRAVISO = TRAVISO;
    }
}).call(this);