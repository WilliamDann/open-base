import { commands } from './commands.js'

const cmdbar      = document.querySelector('.cmdbar_type');
let   suggestions = {};

// reset the suggestions variable for new input
function resetSuggestions()
{
    suggestions = {};
    for (let cmd in commands)
    {
        suggestions[cmd] = true;
    }
}

function updateSuggestions()
{
    if (cmdbar.innerHTML.length === 0)
        return;

    let index = cmdbar.innerHTML.length-1;
    let key   = cmdbar.innerHTML[index];

    for (let suggestion in suggestions)
        suggestions[suggestion] = suggestion[index] == key;
}

function showSuggestions()
{
    let baseElem = document.querySelector('.suggestion');
    let box      = document.querySelector('.suggestBox');

    for (let suggestion in suggestions)
    {
        if (!suggestions[suggestion])
            continue;
        
        let newElem = baseElem.cloneNode(true);
        newElem.querySelector('.cmdname').innerHTML = suggestion;
        newElem.querySelector('.cmddesc').innerHTML = commands[suggestion].desc;
        newElem.style.display = 'block';
        box.appendChild(newElem);
    }
}

function clearSuggestions()
{
    let box      = document.querySelector('.suggestBox');
    let baseElem = document.querySelector('.suggestion');

    box.innerHTML = "";

    baseElem.style.display = 'none';
    box.appendChild(baseElem);
}

// add shortcut command
document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.code === 'Space')
    {
        e.preventDefault();
        cmdbar.focus()
    }

    else if (e.code === 'Enter' && document.activeElement == cmdbar)
    {
        commands[cmdbar.innerHTML].func();
        cmdbar.nodeValue = "";
    }

    else if (e.code == 'Tab')
    {

    }

    else if (!e.ctrlKey && !e.shiftKey && !e.altKey)
    {
        clearSuggestions();
        updateSuggestions();
        showSuggestions();
    }

});

cmdbar.addEventListener('focus', e => {
    cmdbar.innerHTML = "";
    
    resetSuggestions();
});

cmdbar.addEventListener('focusout', e => {
    cmdbar.innerHTML = "🔍 Command Bar";
    clearSuggestions();
});
