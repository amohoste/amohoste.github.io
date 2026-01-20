const interactiveTerminalElements = document.querySelectorAll('.interactive-terminal');

function setTerminalVisibility() {
    if (!window.matchMedia('(min-width: 480px) and (pointer: fine)').matches) {
        interactiveTerminalElements.forEach(el => el.style.display = 'none');
    } else {
        interactiveTerminalElements.forEach(el => el.style.display = 'block');
    }
}

function initTerminal() {
    if (window.matchMedia('(min-width: 480px) and (pointer: fine)').matches) {
        const terminalContainer = document.querySelector('.interactive-terminal');
        if (!terminalContainer) return;

        let terminal = terminalContainer.querySelector('.terminal-typing');
        if (!terminal) return;
        const cursor = terminalContainer.querySelector('.cursor');
        if (!cursor) return;
        let commandHistory = [];
        let historyIndex = -1;
        let currentCommand = '';

        function handleCommand(command) {
            // Special handling for 'clear' command
            if (command.toLowerCase() === 'clear') {
                terminalContainer.innerHTML = ''; // Clear the terminal content

                const newTerminalLine = document.createElement('h1');
                newTerminalLine.classList.add('terminal-typing');
                newTerminalLine.innerHTML = '<span class="prompt">> </span>';
                terminalContainer.appendChild(newTerminalLine);
                terminal = newTerminalLine; // Update terminal to the new line

                terminalContainer.appendChild(cursor); // Re-append the cursor

                currentCommand = ''; // Reset the current command
                return; // Exit the function
            }

            // Default command handling
            // 1. Finalize the current line
            terminal.innerHTML = `<span class="prompt">> </span><span class="command">${command}</span>`;
            terminal.classList.remove('terminal-typing');
            terminal.classList.add('terminal-typed');

            // 2. Handle the command and create output
            if (command.length > 0) {
                const output = document.createElement('h1');
                output.classList.add('terminal-typed');
                switch (command.toLowerCase()) {
                    case 'help':
                        output.innerHTML = '<span class="output">Available commands: help, clear, resume, linkedin</span>';
                        break;
                    case 'ls':
                        output.innerHTML = '<span class="output">Available commands: help, clear, resume, linkedin</span>';
                        break;
                    case 'resume':
                        window.open('https://amoryhoste.com/files/AmoryHoste_Resume.pdf', '_blank');
                        output.innerHTML = '<span class="output">Opening resume...</span>';
                        break;
                    case 'linkedin':
                        window.open('https://www.linkedin.com/in/amoryhoste', '_blank');
                        output.innerHTML = '<span class="output">Opening LinkedIn...</span>';
                        break;
                    default:
                        output.innerHTML = `<span class="output">Command not found: ${command}</span>`;
                }
                if (output.textContent) {
                    terminalContainer.appendChild(output);
                }
            }

            // 3. Create a new input line
            const newTerminalLine = document.createElement('h1');
            newTerminalLine.classList.add('terminal-typing');
            newTerminalLine.innerHTML = '<span class="prompt">> </span>';
            terminalContainer.appendChild(newTerminalLine);
            terminal = newTerminalLine; // Update terminal to the new line

            // 4. Move cursor to the end
            terminalContainer.appendChild(cursor);

            // 5. Reset for next command
            currentCommand = '';
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (currentCommand.length > 0) {
                    if (commandHistory[0] !== currentCommand) {
                        commandHistory.unshift(currentCommand);
                    }
                }
                historyIndex = -1;
                handleCommand(currentCommand);
            } else if (e.key === 'Backspace') {
                if (currentCommand.length > 0) {
                    currentCommand = currentCommand.slice(0, -1);
                    terminal.innerHTML = `<span class="prompt">> </span><span class="command">${currentCommand}</span>`;
                }
            } else if (e.key === 'ArrowUp') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    currentCommand = commandHistory[historyIndex];
                    terminal.innerHTML = `<span class="prompt">> </span><span class="command">${currentCommand}</span>`;
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIndex > 0) {
                    historyIndex--;
                    currentCommand = commandHistory[historyIndex];
                    terminal.innerHTML = `<span class="prompt">> </span><span class="command">${currentCommand}</span>`;
                } else {
                    historyIndex = -1;
                    currentCommand = '';
                    terminal.innerHTML = '<span class="prompt">> </span>';
                }
            } else if (e.key === ' ') {
                e.preventDefault();
                currentCommand += ' ';
                terminal.innerHTML = `<span class="prompt">> </span><span class="command">${currentCommand}</span>`;
            } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                currentCommand += e.key;
                terminal.innerHTML = `<span class="prompt">> </span><span class="command">${currentCommand}</span>`;
            }
        });

        function showInitialCommand() {
            // 1. Finalize the current line with the 'help' command
            terminal.innerHTML = `<span class="prompt">> </span><span class="command">help</span>`;
            terminal.classList.remove('terminal-typing');
            terminal.classList.add('terminal-typed');

            // 2. Handle the command and create output
            const output = document.createElement('h1');
            output.classList.add('terminal-typed');
            output.innerHTML = '<span class="output">Available commands: help, clear, resume, linkedin</span>';
            terminalContainer.appendChild(output);


            // 3. Create a new input line
            const newTerminalLine = document.createElement('h1');
            newTerminalLine.classList.add('terminal-typing');
            newTerminalLine.innerHTML = '<span class="prompt">> </span>';
            terminalContainer.appendChild(newTerminalLine);
            terminal = newTerminalLine; // Update terminal to the new line

            // 4. Move cursor to the end
            terminalContainer.appendChild(cursor);
        }

        showInitialCommand();
    }
}

setTerminalVisibility();
initTerminal();

window.addEventListener('resize', setTerminalVisibility);