import { Chess } from '../../../node_modules/chess.js/dist/esm/chess.js'

class Command
{
    constructor(desc, func)
    {
        this.desc = desc;
        this.func = func;
    }
}

export let commands = 
{
    'Reset'  : new Command(
        'Reset the board position',
        () => {
            if (confirm("Reset the board position?"))
                window.chess = new Chess();
                window.dispatchEvent(new Event('boardupdate'))
        }
    ),

    'Refresh': new Command(
        'Emit a boardupdate event',
        () => {
            window.dispatchEvent(new Event('boardupdate'))
        }
    ),

    'Exit': new Command(
        'Exit the program',
        () => {
            close();
        }
    )
}