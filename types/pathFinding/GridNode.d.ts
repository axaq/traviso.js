import { ColumnRowPair } from '../utils/map';
export declare class GridNode {
    x: number;
    y: number;
    weight: number;
    staticWeight: number;
    mapPos: ColumnRowPair;
    closed: boolean;
    parent: GridNode;
    visited: boolean;
    h: number;
    g: number;
    f: number;
    constructor(c: number, r: number, weight: number);
    toString(): string;
    getCost(fromNeighbor: GridNode): number;
    isWall(): boolean;
}
