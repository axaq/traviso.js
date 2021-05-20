import { assert } from 'chai';
import * as TRAVISO from '../src/';
// var chai2 = require('chai');
// var TRAVISO = require('../src/');

describe('enableDisableLogging', () => {
    it('defines whether function enables logging as expected', () => {
        assert.strictEqual(TRAVISO.VERSION, '$_VERSION');
        // assert.exists(TRAVISO.isReady)
    });
});
