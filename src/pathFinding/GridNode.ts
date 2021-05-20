import { ColumnRowPair } from '../utils/map';

export class GridNode {
    public x: number;
    public y: number;
    public weight: number;
    public staticWeight: number;
    public mapPos: ColumnRowPair;
    // calculation params
    public closed: boolean;
    public parent: GridNode;
    public visited: boolean;
    public h: number;
    public g: number;
    public f: number;

    constructor(c: number, r: number, weight: number) {
        this.x = c;
        this.y = r;
        this.weight = weight;
        this.mapPos = { c, r };
    }

    public toString(): string {
        return '[' + String(this.x) + ' ' + String(this.y) + ']';
    }
    public getCost(fromNeighbor: GridNode): number {
        // Take diagonal weight into consideration.
        if (fromNeighbor && fromNeighbor.x !== this.x && fromNeighbor.y !== this.y) {
            return this.weight * 1.41421;
        }
        return this.weight;
    }

    public isWall(): boolean {
        return this.weight === 0;
    }
}
