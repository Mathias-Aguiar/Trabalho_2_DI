function updatePreview() {
    const previewArea = document.getElementById('previewArea');
    
    previewArea.innerHTML = '';
    
    const header = createHeader();
    previewArea.appendChild(header);
    
    const menu = createMenu();
    previewArea.appendChild(menu);
    
    const gallery = createGallery();
    previewArea.appendChild(gallery);
    
    const form = createForm();
    previewArea.appendChild(form);
    
    const footer = createFooter();
    previewArea.appendChild(footer);

    updateHtmlCode();
}

function createHeader() {
    const header = document.createElement('header');
    header.className = 'preview-header';
    
    editorState.header.elements.forEach(element => {
        const div = document.createElement('div');
        Object.assign(div.style, element.styles);
        
        if (element.type === 'text') {
            div.textContent = element.content;
        } else if (element.type === 'image' && element.content) {
            const img = document.createElement('img');
            img.src = element.content;
            img.style.maxWidth = '100%';
            div.appendChild(img);
        }
        
        header.appendChild(div);
    });
    
    return header;
}

function createMenu() {
    const menuContainer = document.createElement('nav');
    menuContainer.className = 'preview-menu';
    
    if (editorState.menu.logo) {
        const logo = document.createElement('img');
        logo.src = editorState.menu.logo;
        logo.style.maxHeight = '50px';
        logo.style.marginRight = '1rem';
        menuContainer.appendChild(logo);
    }
    
    const menuList = document.createElement('ul');
    menuList.style.listStyle = 'none';
    menuList.style.padding = '0';
    menuList.style.margin = '0';
    menuList.style.display = 'flex';
    menuList.style.gap = '1rem';
    
    editorState.menu.items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.link;
        a.textContent = item.text;
        Object.assign(a.style, item.styles);
        li.appendChild(a);
        menuList.appendChild(li);
    });
    
    menuContainer.appendChild(menuList);
    return menuContainer;
}

function createGallery() {
    const gallery = document.createElement('div');
    gallery.className = 'preview-gallery';
    gallery.style.display = 'grid';
    gallery.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
    gallery.style.gap = '1rem';
    
    editorState.gallery.cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'gallery-card';
        Object.assign(cardDiv.style, card.styles);
        
        if (card.image) {
            const img = document.createElement('img');
            img.src = card.image;
            img.style.width = '100%';
            img.style.height = 'auto';
            cardDiv.appendChild(img);
        }
        
        const title = document.createElement('h3');
        title.textContent = card.title;
        title.style.margin = '0.5rem 0';
        
        const desc = document.createElement('p');
        desc.textContent = card.description;
        
        cardDiv.appendChild(title);
        cardDiv.appendChild(desc);
        gallery.appendChild(cardDiv);
    });
    
    return gallery;
}

function createForm() {
    const formContainer = document.createElement('div');
    formContainer.className = 'preview-form';
    
    const form = document.createElement('form');
    form.onsubmit = (e) => e.preventDefault();
    
    editorState.form.fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-field';
        Object.assign(formGroup.style, field.styles);
        
        const label = document.createElement('label');
        label.textContent = field.label;
        label.style.color = field.styles.labelColor;
        formGroup.appendChild(label);
        
        let input;
        switch (field.type) {
            case 'text':
            case 'email':
            case 'date':
                input = document.createElement('input');
                input.type = field.type;
                input.placeholder = field.placeholder;
                break;
            case 'select':
                input = document.createElement('select');
                input.innerHTML = '<option>Opção 1</option><option>Opção 2</option>';
                break;
            case 'radio':
                input = document.createElement('div');
                input.innerHTML = `
                    <div>
                        <input type="radio" name="radio_${field.label}" id="radio1_${field.label}">
                        <label for="radio1_${field.label}">Opção 1</label>
                    </div>
                    <div>
                        <input type="radio" name="radio_${field.label}" id="radio2_${field.label}">
                        <label for="radio2_${field.label}">Opção 2</label>
                    </div>
                `;
                break;
        }
        
        if (input) {
            input.className = 'form-control';
            input.required = field.required;
            formGroup.appendChild(input);
        }
        
        form.appendChild(formGroup);
    });
    
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn-primary mt-3';
    submitBtn.textContent = 'Enviar';
    form.appendChild(submitBtn);
    
    formContainer.appendChild(form);
    return formContainer;
}

function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'preview-footer';
    footer.textContent = editorState.footer.text;
    Object.assign(footer.style, editorState.footer.styles);
    return footer;
}

function updateHtmlCode() {
    const codeDisplay = document.getElementById('htmlCode');
    const generatedHtml = generateCompleteHtml();
    codeDisplay.textContent = generatedHtml;
}

function generateCompleteHtml() {
    const previewArea = document.getElementById('previewArea');
    const content = previewArea.innerHTML;
    
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Gerada</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        ${generateStyles()}
    </style>
</head>
<body>
    <div class="container">
        ${content}
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}

function generateStyles() {
    return `
        .preview-header { margin-bottom: 2rem; }
        .preview-menu { margin-bottom: 2rem; }
        .preview-gallery { margin-bottom: 2rem; }
        .preview-form { margin-bottom: 2rem; }
        .preview-footer { margin-top: 2rem; }
        
        .gallery-card img { max-width: 100%; height: auto; }
        .form-field { margin-bottom: 1rem; }
    `;
}

window.updatePreview = updatePreview;
window.generateCompleteHtml = generateCompleteHtml; 