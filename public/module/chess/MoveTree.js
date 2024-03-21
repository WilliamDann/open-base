import { Chess } from '../../../node_modules/chess.js/dist/esm/chess.js'

export default class MoveTreeNode
{
    /**
     * A single node in a move tree
     * @param {Node}        parent the parent node to this node
     * @param {string}      fen the current fen string of the position
     * @param {string}      move string version of the current chess move
     * @param {Array<Node>} children variations after this move
     */
    constructor(parent, fen, move, children)
    {
        this.parent   = parent;
        this.fen      = fen;
        this.move     = move;
        this.comment  = null;

        if (!children)
            children = [];
        this.children = children;
    }

    /**
     * @returns The chess.js object for the given position & move
     */
    getBoard()
    {
        let b = new Chess(this.fen);
        return b;
    }

    /**
     * @returns the chess.js object for the entire game up to this node
     */
    getGame()
    {
        let nodes = [];
        let node  = this;

        // seek to last node of line
        while(node.children.length > 0)
            node = node.children[0];

        // reverse order
        while(node.parent != null)
        {
            nodes.push(node);
            node = node.parent;
        }

        // create Chess object
        let chess = new Chess(node.fen);
        while (nodes.length > 0)
        {
            let node = nodes.pop();
            chess.move(node.move);
            if (node.comment)
                chess.setComment(node.comment);
        }

        return chess;
    }

    /**
     * Add a variation after the move
     * @param {string} move the string version of the chess move to add
     * @returns {boolean} if the node was created. false if the move was invalid for the given fen position, for example.  
    */
    addMove(move)
    {
        let n = new MoveTreeNode(this, null, move, []);
        let b = this.getBoard();

        // try and make the move
        try
        {
            b.move(move);
        }
        catch
        {
            return false;
        }

        n.fen  = b.fen();
        this.children.push(n); // TODO duplicates?

        return true;
    }
}

/**
 * load a PGN file into a MoveTree
 * @param {string} pgn pgn file string
 * @returns {MoveTreeNode?} a move tree of the pgn, or null if an invalid move occored
 */
export function loadPgn(pgn)
{
    let ch   = new Chess();
    ch.loadPgn(pgn);

    let tree = new MoveTreeNode(null, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', null, []);
    let root = tree;

    // TODO variations
    for (let move of ch.history({verbose: true}))
        if (tree.addMove(move.lan))
            tree = tree.children[0];
        else
            return null;

    for (let comment of ch.getComments())
    {
        let board = new Chess()
        board.load(comment.fen);

        let commentPly = board.moveNumber() * 2 - 1;
        if (board.turn() == 'w')
            commentPly--;

        // place coment on correct ply
        let temp   = root;
        for (let i = 0; i < commentPly; i++)
            temp = temp.children[0];

        temp.comment = comment.comment;
    }

    return tree;
}