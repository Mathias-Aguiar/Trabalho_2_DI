
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('showCode').addEventListener('click', () => {
        const codeDisplay = document.getElementById('htmlCode');
        const generatedHtml = generateCompleteHtml();
        codeDisplay.textContent = generatedHtml;
    });

    document.getElementById('saveCode').addEventListener('click', () => {
        try {
            const generatedHtml = generateCompleteHtml();
            localStorage.setItem('savedHtml', generatedHtml);
            localStorage.setItem('editorState', JSON.stringify(editorState));
            alert('Código HTML salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar o código HTML. Verifique o console para mais detalhes.');
        }
    });

    document.getElementById('loadCode').addEventListener('click', () => {
        try {
            const savedHtml = localStorage.getItem('savedHtml');
            const savedState = localStorage.getItem('editorState');
            
            if (savedHtml && savedState) {
                Object.assign(editorState, JSON.parse(savedState));
                
                renderHeaderElements();
                renderMenuItems();
                renderGalleryCards();
                renderFormFields();
                
                updatePreview();
                
                alert('Código HTML carregado com sucesso!');
            } else {
                alert('Nenhum código HTML salvo encontrado.');
            }
        } catch (error) {
            console.error('Erro ao carregar:', error);
            alert('Erro ao carregar o código HTML. Verifique o console para mais detalhes.');
        }
    });

    document.getElementById('clearStorage').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar o localStorage? Esta ação não pode ser desfeita.')) {
            try {
                localStorage.removeItem('savedHtml');
                localStorage.removeItem('editorState');
                alert('LocalStorage limpo com sucesso!');

                Object.assign(editorState, {
                    header: { elements: [], maxElements: 3 },
                    menu: { items: [], logo: null },
                    gallery: { cards: [] },
                    form: { fields: [] },
                    footer: {
                        text: 'Rodapé da página',
                        styles: {
                            color: '#000000',
                            backgroundColor: '#ffffff',
                            fontSize: '16px',
                            textAlign: 'center'
                        }
                    }
                });

                renderHeaderElements();
                renderMenuItems();
                renderGalleryCards();
                renderFormFields();
                
                updatePreview();
            } catch (error) {
                console.error('Erro ao limpar localStorage:', error);
                alert('Erro ao limpar o localStorage. Verifique o console para mais detalhes.');
            }
        }
    });
}); 
