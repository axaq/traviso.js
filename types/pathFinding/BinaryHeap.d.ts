export declare class BinaryHeap {
    private content;
    private scoreFunction;
    constructor(scoreFunction: (element: unknown) => number);
    push(element: unknown): void;
    pop(): unknown;
    size(): number;
    rescoreElement(node: unknown): void;
    private sinkDown;
    private bubbleUp;
}
