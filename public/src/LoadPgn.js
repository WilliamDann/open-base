import Chessgame from "./Chessgame.js";
import MoveTreeNode from "./MoveTree.js";

/**
 * Extract the header information from a pgn file
 * @param {string} pgn string of a pgn file
 */
function readHeaders(pgn)
{
    const btBrackets    = /(?<=\[)(.*?)(?=\])/g;
    const btQuotes      = /(?<=\")(.*?)(?=\")/g;

    let raw     = pgn.match(btBrackets);
    let headers = {};

    if (!raw)
        return headers;

    for (let string of raw)
        headers[string.split(' ')[0]] = string.match(btQuotes)[0];

    return headers;
}

/**
 * Remove the header informaiton from a pgn file
 * @param {string} pgn string of a pgn file
 */
function removeHeaders(pgn)
{
    const headers = /\[(?<=\[)(.*?)(?=\])\]\n?/g
    return pgn.replace(headers, '');
}

/**
 * Chess.js cannot parse pgns with no spaces after the move number
 * for this reason we must ensure that the pgn contains those spaces
 */
function addSpacesToMoves(pgn)
{
    const re = /(?<=\d)\.\.?\.?(?!=\D)/g;
    return pgn.replaceAll(re, '$& ');
}

/**
 * load a PGN file into a MoveTree
 * @param {string} pgn pgn file string
 * @returns {Chessgame?} a move tree of the pgn, or null if an invalid move occored
 */
export function loadPgn(pgn)
{
    // TODO there can be a StartPosition(?) header in a PGN file that allows a different starting position.
    let tree   = new MoveTreeNode(null, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', null, []);
    let cursor = tree;
    
    let headers = readHeaders(pgn);
    pgn         = removeHeaders(pgn);
    pgn         = addSpacesToMoves(pgn);
    
    // game info container to return
    let game   = new Chessgame(tree, headers);

    // tokenize moves
    let tokens = pgn
        .trim()                      // remove tailing whitespace
        .replaceAll('\n', ' ')       // remove newlines
        .replaceAll(/\d{1,}\./g, '') // remove move number lables
        .split(/\s+(?![^{]*})/g)
        .filter(x => x != '');

    if (!tokens)
        return game;

    tokens = tokens.reverse()

    // add moves to tree
    while (tokens.length > 0)
    {
        let token = tokens.pop();

        // add comment
        if (token.indexOf('{') != -1)
        {
            cursor.comment = token.match(/(?<=\{)(.*?)(?=\})/g)[0];
            continue;
        }
            
        // add move
        if (cursor.addMove(token))
            cursor = cursor.children[0];
        
        // invalid token
        else
            break;
    }

    // profit
    return game;
}