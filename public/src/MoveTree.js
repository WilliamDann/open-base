import { Chess } from '../../node_modules/chess.js/dist/esm/chess.js'

export default class MoveTreeNode
{
    /**
     * A single node in a move tree
     * @param {MoveTreeNode}        parent the parent node to this node
     * @param {string}      fen the current fen string of the position
     * @param {string}      move string version of the current chess move
     * @param {Array<MoveTreeNode>} children variations after this move
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
     * @returns the head element of the move tree
     */
    getHead()
    {
        let node = this;
        while (node.parent != null)
           node = node.parent;
        return node; 
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
     * Add a variation after the move
     * @param {string} move the string version of the chess move to add
     * @returns {boolean} if the node was created. false if the move was invalid for the given fen position, for example.  
    */
    addMove(move)
    {
        let n = new MoveTreeNode(this, null, move, []);
        let b = this.getBoard();
        let sanMove;

        // try and make the move
        try
        {
            let moveNum = b.moveNumber();
            let dot     = b.turn() == 'w' ? '.' : '...';

            sanMove     = `${moveNum}${dot} ${b.move(move).san}`;
        }
        catch
        {
            return false;
        }

        n.fen  = b.fen();
        n.move = sanMove;
        this.children.push(n); // TODO duplicates?

        return true;
    }

    /**
     * @param {MoveTreeNode} node 
     * @param {Array<MoveTreeNode} carry
     */
    pgnStep(node, carry)
    {
        if (node == null)
            return '';
        
        let str = node.move ? node.move+' ' : '';
        if (carry.length > 1)
        {
            str += '( '
            for (let i = 1; i < carry.length; i++)
                str += this.pgnStep(carry[i], carry[i].children);
            str += ') '
        }

        return str + this.pgnStep(node.children[0], node.children);
    }

    /**
     * @returns a pgn representation of the MoveTree
     */
    pgn()
    {
        let head  = this.getHead();
        return this.pgnStep(head, head.children) + '*';
    }

    // returns the game pgn 
    toString()
    {
        return this.pgn();
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