
const editorState = {
    header: {
        elements: [],
        maxElements: 3
    },
    menu: {
        items: [],
        logo: null
    },
    gallery: {
        cards: []
    },
    form: {
        fields: []
    },
    footer: {
        text: 'Rodapé da página',
        styles: {
            color: '#000000',
            backgroundColor: '#ffffff',
            fontSize: '16px',
            textAlign: 'center'
        }
    }
};

function initializeHeaderTab() {
    const headerTab = document.querySelector('#header');
    const headerElements = headerTab.querySelector('.header-elements');

    const addButton = document.createElement('button');
    addButton.className = 'btn btn-primary mb-3';
    addButton.textContent = 'Adicionar Elemento';
    addButton.onclick = addHeaderElement;
    headerElements.appendChild(addButton);

    const elementsContainer = document.createElement('div');
    elementsContainer.id = 'headerElementsContainer';
    headerElements.appendChild(elementsContainer);
}

function addHeaderElement() {
    if (editorState.header.elements.length >= editorState.header.maxElements) {
        alert('Máximo de 3 elementos atingido!');
        return;
    }

    const element = {
        type: 'text',
        content: '',
        styles: {
            color: '#000000',
            backgroundColor: '#ffffff',
            fontSize: '16px',
            padding: '10px',
            margin: '10px',
            border: '1px solid #000000'
        }
    };

    editorState.header.elements.push(element);
    renderHeaderElements();
    updatePreview();
}

function renderHeaderElements() {
    const container = document.getElementById('headerElementsContainer');
    container.innerHTML = '';

    editorState.header.elements.forEach((element, index) => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'editor-control border p-3 mb-3';

        const typeSelect = document.createElement('select');
        typeSelect.className = 'form-select mb-3';
        typeSelect.innerHTML = `
            <option value="text" ${element.type === 'text' ? 'selected' : ''}>Texto</option>
            <option value="image" ${element.type === 'image' ? 'selected' : ''}>Imagem</option>
        `;
        typeSelect.onchange = (e) => {
            element.type = e.target.value;
            renderHeaderElements();
            updatePreview();
        };

        elementDiv.appendChild(typeSelect);

        if (element.type === 'text') {
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.className = 'form-control mb-3';
            textInput.value = element.content;
            textInput.placeholder = 'Digite o texto';
            textInput.onchange = (e) => {
                element.content = e.target.value;
                updatePreview();
            };
            elementDiv.appendChild(textInput);
        } else {
            const imageInput = document.createElement('input');
            imageInput.type = 'file';
            imageInput.className = 'form-control mb-3';
            imageInput.accept = 'image/*';
            imageInput.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    element.content = event.target.result;
                    updatePreview();
                };
                reader.readAsDataURL(file);
            };
            elementDiv.appendChild(imageInput);
        }

        const styleControls = document.createElement('div');
        styleControls.className = 'style-controls';

        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = element.styles.color;
        colorPicker.className = 'form-control form-control-color mb-2';
        colorPicker.onchange = (e) => {
            element.styles.color = e.target.value;
            updatePreview();
        };
        styleControls.appendChild(createFormGroup('Cor do texto:', colorPicker));

        const bgColorPicker = document.createElement('input');
        bgColorPicker.type = 'color';
        bgColorPicker.value = element.styles.backgroundColor;
        bgColorPicker.className = 'form-control form-control-color mb-2';
        bgColorPicker.onchange = (e) => {
            element.styles.backgroundColor = e.target.value;
            updatePreview();
        };
        styleControls.appendChild(createFormGroup('Cor de fundo:', bgColorPicker));

        elementDiv.appendChild(styleControls);

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger mt-2';
        removeButton.textContent = 'Remover';
        removeButton.onclick = () => {
            editorState.header.elements.splice(index, 1);
            renderHeaderElements();
            updatePreview();
        };
        elementDiv.appendChild(removeButton);

        container.appendChild(elementDiv);
    });
}

function initializeMenuTab() {
    const menuTab = document.querySelector('#menu');

    const logoSection = document.createElement('div');
    logoSection.className = 'mb-4';
    logoSection.innerHTML = `
        <h4>Logo do Menu</h4>
        <input type="file" class="form-control" accept="image/*">
    `;
    menuTab.appendChild(logoSection);

    logoSection.querySelector('input').onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            editorState.menu.logo = event.target.result;
            updatePreview();
        };
        reader.readAsDataURL(file);
    };

    const menuItemsSection = document.createElement('div');
    menuItemsSection.innerHTML = `
        <h4>Itens do Menu</h4>
        <button class="btn btn-primary mb-3">Adicionar Item</button>
        <div id="menuItemsContainer"></div>
    `;
    menuTab.appendChild(menuItemsSection);

    menuItemsSection.querySelector('button').onclick = () => {
        editorState.menu.items.push({
            text: 'Novo Item',
            link: '#',
            styles: {
                color: '#000000',
                backgroundColor: '#ffffff',
                fontSize: '16px',
                padding: '10px'
            }
        });
        renderMenuItems();
        updatePreview();
    };
}

function renderMenuItems() {
    const container = document.getElementById('menuItemsContainer');
    container.innerHTML = '';

    editorState.menu.items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'editor-control border p-3 mb-3';

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.className = 'form-control mb-2';
        textInput.value = item.text;
        textInput.onchange = (e) => {
            item.text = e.target.value;
            updatePreview();
        };
        itemDiv.appendChild(createFormGroup('Texto:', textInput));

        const linkInput = document.createElement('input');
        linkInput.type = 'text';
        linkInput.className = 'form-control mb-2';
        linkInput.value = item.link;
        linkInput.onchange = (e) => {
            item.link = e.target.value;
            updatePreview();
        };
        itemDiv.appendChild(createFormGroup('Link:', linkInput));

        const styleControls = createStyleControls(item.styles, () => updatePreview());
        itemDiv.appendChild(styleControls);

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger mt-2';
        removeButton.textContent = 'Remover';
        removeButton.onclick = () => {
            editorState.menu.items.splice(index, 1);
            renderMenuItems();
            updatePreview();
        };
        itemDiv.appendChild(removeButton);

        container.appendChild(itemDiv);
    });
}

function initializeGalleryTab() {
    const galleryTab = document.querySelector('#gallery');
    
    const addButton = document.createElement('button');
    addButton.className = 'btn btn-primary mb-3';
    addButton.textContent = 'Adicionar Card';
    addButton.onclick = () => {
        editorState.gallery.cards.push({
            image: '',
            title: 'Novo Card',
            description: 'Descrição do card',
            styles: {
                backgroundColor: '#ffffff',
                borderColor: '#000000',
                borderWidth: '1px',
                borderStyle: 'solid',
                padding: '10px'
            }
        });
        renderGalleryCards();
        updatePreview();
    };
    galleryTab.appendChild(addButton);

    const cardsContainer = document.createElement('div');
    cardsContainer.id = 'galleryCardsContainer';
    galleryTab.appendChild(cardsContainer);
}

function renderGalleryCards() {
    const container = document.getElementById('galleryCardsContainer');
    container.innerHTML = '';

    editorState.gallery.cards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'editor-control border p-3 mb-3';

        const imageInput = document.createElement('input');
        imageInput.type = 'file';
        imageInput.className = 'form-control mb-2';
        imageInput.accept = 'image/*';
        imageInput.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                card.image = event.target.result;
                updatePreview();
            };
            reader.readAsDataURL(file);
        };
        cardDiv.appendChild(createFormGroup('Imagem:', imageInput));

        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.className = 'form-control mb-2';
        titleInput.value = card.title;
        titleInput.onchange = (e) => {
            card.title = e.target.value;
            updatePreview();
        };
        cardDiv.appendChild(createFormGroup('Título:', titleInput));

        const descInput = document.createElement('textarea');
        descInput.className = 'form-control mb-2';
        descInput.value = card.description;
        descInput.onchange = (e) => {
            card.description = e.target.value;
            updatePreview();
        };
        cardDiv.appendChild(createFormGroup('Descrição:', descInput));

        const styleControls = createStyleControls(card.styles, () => updatePreview());
        cardDiv.appendChild(styleControls);

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger mt-2';
        removeButton.textContent = 'Remover';
        removeButton.onclick = () => {
            editorState.gallery.cards.splice(index, 1);
            renderGalleryCards();
            updatePreview();
        };
        cardDiv.appendChild(removeButton);

        container.appendChild(cardDiv);
    });
}

function initializeFormTab() {
    const formTab = document.querySelector('#form');
    
    const addButton = document.createElement('button');
    addButton.className = 'btn btn-primary mb-3';
    addButton.textContent = 'Adicionar Campo';
    addButton.onclick = () => {
        editorState.form.fields.push({
            type: 'text',
            label: 'Novo Campo',
            placeholder: 'Digite aqui',
            required: false,
            styles: {
                labelColor: '#000000',
                backgroundColor: '#ffffff',
                borderColor: '#000000',
                borderWidth: '1px',
                borderStyle: 'solid'
            }
        });
        renderFormFields();
        updatePreview();
    };
    formTab.appendChild(addButton);

    const fieldsContainer = document.createElement('div');
    fieldsContainer.id = 'formFieldsContainer';
    formTab.appendChild(fieldsContainer);
}

function renderFormFields() {
    const container = document.getElementById('formFieldsContainer');
    container.innerHTML = '';

    editorState.form.fields.forEach((field, index) => {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'editor-control border p-3 mb-3';

        const typeSelect = document.createElement('select');
        typeSelect.className = 'form-select mb-2';
        typeSelect.innerHTML = `
            <option value="text" ${field.type === 'text' ? 'selected' : ''}>Texto</option>
            <option value="email" ${field.type === 'email' ? 'selected' : ''}>Email</option>
            <option value="date" ${field.type === 'date' ? 'selected' : ''}>Data</option>
            <option value="select" ${field.type === 'select' ? 'selected' : ''}>Select</option>
            <option value="radio" ${field.type === 'radio' ? 'selected' : ''}>Radio</option>
        `;
        typeSelect.onchange = (e) => {
            field.type = e.target.value;
            renderFormFields();
            updatePreview();
        };
        fieldDiv.appendChild(createFormGroup('Tipo:', typeSelect));

        const labelInput = document.createElement('input');
        labelInput.type = 'text';
        labelInput.className = 'form-control mb-2';
        labelInput.value = field.label;
        labelInput.onchange = (e) => {
            field.label = e.target.value;
            updatePreview();
        };
        fieldDiv.appendChild(createFormGroup('Label:', labelInput));

        if (['text', 'email'].includes(field.type)) {
            const placeholderInput = document.createElement('input');
            placeholderInput.type = 'text';
            placeholderInput.className = 'form-control mb-2';
            placeholderInput.value = field.placeholder;
            placeholderInput.onchange = (e) => {
                field.placeholder = e.target.value;
                updatePreview();
            };
            fieldDiv.appendChild(createFormGroup('Placeholder:', placeholderInput));
        }

        const requiredCheck = document.createElement('input');
        requiredCheck.type = 'checkbox';
        requiredCheck.className = 'form-check-input';
        requiredCheck.checked = field.required;
        requiredCheck.onchange = (e) => {
            field.required = e.target.checked;
            updatePreview();
        };
        fieldDiv.appendChild(createFormGroup('Obrigatório:', requiredCheck));

        const styleControls = createStyleControls(field.styles, () => updatePreview());
        fieldDiv.appendChild(styleControls);

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger mt-2';
        removeButton.textContent = 'Remover';
        removeButton.onclick = () => {
            editorState.form.fields.splice(index, 1);
            renderFormFields();
            updatePreview();
        };
        fieldDiv.appendChild(removeButton);

        container.appendChild(fieldDiv);
    });
}

function initializeFooterTab() {
    const footerTab = document.querySelector('#footer');
    
    const textInput = document.createElement('textarea');
    textInput.className = 'form-control mb-3';
    textInput.value = editorState.footer.text;
    textInput.onchange = (e) => {
        editorState.footer.text = e.target.value;
        updatePreview();
    };
    footerTab.appendChild(createFormGroup('Texto do Rodapé:', textInput));

    const styleControls = createStyleControls(editorState.footer.styles, () => updatePreview());
    footerTab.appendChild(styleControls);
}

function createFormGroup(label, input) {
    const group = document.createElement('div');
    group.className = 'form-group mb-3';
    
    const labelElement = document.createElement('label');
    labelElement.className = 'form-label';
    labelElement.textContent = label;
    
    group.appendChild(labelElement);
    group.appendChild(input);
    
    return group;
}

function createStyleControls(styles, onChange) {
    const container = document.createElement('div');
    container.className = 'style-controls border p-2 mb-3';

    if (styles.color !== undefined) {
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.className = 'form-control form-control-color mb-2';
        colorInput.value = styles.color;
        colorInput.onchange = (e) => {
            styles.color = e.target.value;
            onChange();
        };
        container.appendChild(createFormGroup('Cor do texto:', colorInput));
    }

    if (styles.backgroundColor !== undefined) {
        const bgColorInput = document.createElement('input');
        bgColorInput.type = 'color';
        bgColorInput.className = 'form-control form-control-color mb-2';
        bgColorInput.value = styles.backgroundColor;
        bgColorInput.onchange = (e) => {
            styles.backgroundColor = e.target.value;
            onChange();
        };
        container.appendChild(createFormGroup('Cor de fundo:', bgColorInput));
    }

    if (styles.fontSize !== undefined) {
        const fontSizeInput = document.createElement('input');
        fontSizeInput.type = 'number';
        fontSizeInput.className = 'form-control mb-2';
        fontSizeInput.value = parseInt(styles.fontSize);
        fontSizeInput.onchange = (e) => {
            styles.fontSize = `${e.target.value}px`;
            onChange();
        };
        container.appendChild(createFormGroup('Tamanho da fonte (px):', fontSizeInput));
    }

    return container;
}


document.addEventListener('DOMContentLoaded', () => {
    initializeHeaderTab();
    initializeMenuTab();
    initializeGalleryTab();
    initializeFormTab();
    initializeFooterTab();
});

window.editorState = editorState; 