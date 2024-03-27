import MoveTreeNode from "./MoveTree.js";

export default class Chessgame
{
    /**
     * Container for information about a chess game
     * @param {MoveTreeNode} moveTree root MoveTreeNode for the game
     * @param {Object} headers header information (from a pgn file, for example)
     */
    constructor(moveTree, headers)
    {
        this.moveTree = moveTree;
        this.headers  = headers;
    }
}