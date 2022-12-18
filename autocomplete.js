// a function creates an autocomplete element
const createAutoComplete = ({
    rootElement,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
    }) => {

    // dropdown html template
    rootElement.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
    <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
    </div>
    </div>
    `;

    // get the elements to render
    const input = rootElement.querySelector(".input");
    const dropdownDiv = rootElement.querySelector('.dropdown');
    const resultsDiv = rootElement.querySelector('.results');


    const onInput = async evt => {
        // get the data to display
        const items = await fetchData(evt.target.value);
        // check if there isn't any items from fetch
        if(!items.length){
            // make the dropdown not active and exit
            dropdownDiv.classList.remove('is-active');
            return;
        }
        // clear results
        resultsDiv.innerHTML = '';
        // make the dropdown visible
        dropdownDiv.classList.add('is-active');

        for (const item of items) {
            // create an ancor tag for the item
            const itemOption = document.createElement('a');

            // make the dropdown
            itemOption.classList.add('dropdown-item');

            // form option
            itemOption.innerHTML = renderOption(item);

            // if user selects the item
            itemOption.addEventListener('click', () => {
                // make the dropdown not active
                dropdownDiv.classList.remove('is-active');
                // change the input text to the text of the item
                input.value = inputValue(item);
                // get the complete item info and display
                onOptionSelect(item);
            });
            resultsDiv.append(itemOption);
        }
    };

    // get info from the input
    input.addEventListener('input', debounce(onInput, 800));

    // hide the dropdown 
    document.addEventListener('click', evt => {
    // check if user clicks outside of the dropdown
        if(!rootElement.contains(evt.target)){
            // make the dropdown not active
            dropdownDiv.classList.remove('is-active');
        }
    });
};
