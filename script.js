document.addEventListener('DOMContentLoaded', () => {

    const screens = document.querySelectorAll('.screen');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const startGameBtn = document.getElementById('start-game-btn');
    const adminQuestionsBtn = document.getElementById('admin-questions-btn');
    const finishGameBtn = document.getElementById('finish-game-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    const adminBackToMenuBtn = document.getElementById('admin-back-to-menu-btn');
    const addAnswerBtn = document.getElementById('add-answer-btn');
    const exportBtn = document.getElementById('export-btn');
    const importFile = document.getElementById('import-file');
    const timerSpan = document.querySelector('#timer span');
    const allQuestionsContainer = document.getElementById('all-questions-container');
    const resultsDetails = document.getElementById('results-details');
    const finalSummary = document.getElementById('final-summary');
    const questionForm = document.getElementById('question-form');
    const questionIdInput = document.getElementById('question-id');
    const questionInput = document.getElementById('question-input');
    const answersContainer = document.getElementById('answers-container');
    const questionsList = document.getElementById('questions-list');
    const imageSourceRadios = document.querySelectorAll('input[name="imageSource"]');
    const imageUrlContainer = document.getElementById('image-url-container');
    const imageFileContainer = document.getElementById('image-file-container');
    const imageUrlInput = document.getElementById('image-url-input');
    const imageFileInput = document.getElementById('image-file-input');
    const currentImagePreview = document.getElementById('current-image-preview');
    const confirmModal = document.getElementById('confirm-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const examSettingsModal = document.getElementById('exam-settings-modal');
    const examDurationInput = document.getElementById('exam-duration');
    const examQuestionsCountInput = document.getElementById('exam-questions-count');
    const settingsCancelBtn = document.getElementById('settings-cancel-btn');
    const settingsStartBtn = document.getElementById('settings-start-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const formTitle = document.getElementById('form-title');
    const imageViewerModal = document.getElementById('image-viewer-modal');
    const imageViewerImg = document.getElementById('image-viewer-img');
    const imageViewerClose = document.getElementById('image-viewer-close');

    // NUEVOS ELEMENTOS PARA SELECCIÓN MÚLTIPLE
    const deleteSelectedBtn = document.getElementById('delete-selected-btn');
    const selectAllCheckbox = document.getElementById('select-all-checkbox');

    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
    const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
    const xIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    let allQuestions = [], currentQuizQuestions = [], userAnswers = [], timer, timeLeft;

    const applyTheme = (theme) => {
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(`${theme}-mode`);
        themeToggleBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
        localStorage.setItem('theme', theme);
    };

    themeToggleBtn.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    const loadQuestions = async () => {
        try {
            const response = await fetch('default-questions.json');
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const defaultQuestions = await response.json();
            allQuestions = defaultQuestions;
            saveQuestions(); 
        } catch (error) {
            console.error("No se pudieron cargar las preguntas predeterminadas.", error);
            allQuestions = [];
        }
    };

    const saveQuestions = () => localStorage.setItem('quizQuestions', JSON.stringify(allQuestions, null, 2));

    const showScreen = (screenId) => {
        screens.forEach(screen => screen.classList.remove('active'));
        const activeScreen = document.getElementById(screenId);
        if (activeScreen) activeScreen.classList.add('active');
    };

    const resetForm = () => {
        if(!questionForm) return;
        questionForm.reset();
        questionIdInput.value = '';
        currentImagePreview.innerHTML = '';
        document.querySelector('input[name="imageSource"][value="url"]').checked = true;
        imageUrlContainer.classList.remove('hidden');
        imageFileContainer.classList.add('hidden');
        answersContainer.innerHTML = '';
        addAnswerInput('', true);
        addAnswerInput();
        formTitle.textContent = 'Añadir Nueva Pregunta';
        cancelEditBtn.classList.add('hidden');
    };
    
    if(cancelEditBtn) cancelEditBtn.addEventListener('click', resetForm);
    
    if(imageSourceRadios) imageSourceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const isUrl = radio.value === 'url';
            imageUrlContainer.classList.toggle('hidden', !isUrl);
            imageFileContainer.classList.toggle('hidden', isUrl);
        });
    });

    const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });

    const addAnswerInput = (answerText = '', isCorrect = false) => {
        const answerId = Date.now() + Math.random();
        const answerDiv = document.createElement('div');
        answerDiv.classList.add('answer-input-container');
        answerDiv.innerHTML = `
            <input type="radio" id="radio-${answerId}" name="correct-answer" required ${isCorrect ? 'checked' : ''}>
            <label for="radio-${answerId}" class="custom-admin-radio"></label>
            <input type="text" value="${answerText}" placeholder="Texto de la respuesta" required>
            <button type="button" class="remove-answer-btn">${xIcon}</button>
        `;
        answersContainer.appendChild(answerDiv);
        answerDiv.querySelector('.remove-answer-btn').addEventListener('click', () => {
            if (answersContainer.children.length > 2) answerDiv.remove();
            else alert('Una pregunta debe tener al menos 2 respuestas.');
        });
    };
    
    // FUNCIÓN AUXILIAR PARA ACTUALIZAR EL ESTADO DEL BOTÓN DE ELIMINAR Y EL CHECKBOX "SELECCIONAR TODO"
    const updateDeleteSelectedButtonState = () => {
        if (!questionsList || !deleteSelectedBtn || !selectAllCheckbox) return;
        const checkboxes = questionsList.querySelectorAll('.question-checkbox');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        const total = checkboxes.length;

        deleteSelectedBtn.classList.toggle('hidden', checkedCount === 0);
        
        if (total === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedCount === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedCount === total) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    };

    const renderAdminList = () => {
        if(!questionsList) return;
        questionsList.innerHTML = '';
        
        // Reiniciar el estado del checkbox "Seleccionar Todo"
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        }

        allQuestions.forEach((q, index) => {
            const li = document.createElement('li');
            // MODIFICACIÓN: Agregar un checkbox con el ID de la pregunta
            li.innerHTML = `<input type="checkbox" data-question-id="${q.id}" class="question-checkbox"><span>${q.question.substring(0, 40)}...</span><div class="action-buttons"><button data-index="${index}" class="edit-btn">${editIcon}</button><button data-index="${index}" class="delete-btn">${deleteIcon}</button></div>`;
            questionsList.appendChild(li);
        });
        
        // Agregar listener para actualizar el estado del botón cuando un checkbox cambia
        questionsList.querySelectorAll('.question-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateDeleteSelectedButtonState);
        });
        
        updateDeleteSelectedButtonState(); // Actualizar el estado inicial
    };

    if(selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', () => {
            const checkboxes = questionsList.querySelectorAll('.question-checkbox');
            checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
            updateDeleteSelectedButtonState();
        });
    }

    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', () => {
            const selectedCheckboxes = questionsList.querySelectorAll('.question-checkbox:checked');
            if (selectedCheckboxes.length === 0) {
                alert('No hay preguntas seleccionadas para eliminar.');
                return;
            }
            
            if (confirm(`¿Estás seguro de que quieres eliminar las ${selectedCheckboxes.length} pregunta(s) seleccionada(s)?`)) {
                // Obtener los IDs de las preguntas a eliminar
                const idsToDelete = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.questionId));
                
                // Filtrar el array de preguntas, manteniendo solo las que NO están en la lista de eliminación
                allQuestions = allQuestions.filter(q => !idsToDelete.includes(q.id));
                
                saveQuestions();
                renderAdminList();
                resetForm(); // Limpiar el formulario en caso de que la pregunta que se estaba editando haya sido eliminada
            }
        });
    }

    if(questionForm) questionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let imageData = '';
        const imageSource = document.querySelector('input[name="imageSource"]:checked').value;
        if (imageSource === 'url') { imageData = imageUrlInput.value.trim(); }
        else if (imageSource === 'file' && imageFileInput.files[0]) {
            try { imageData = await readFileAsBase64(imageFileInput.files[0]); }
            catch (error) { console.error("Error al leer el archivo:", error); alert("Hubo un error al cargar la imagen."); return; }
        } else if (imageSource === 'file') {
            const existingQuestion = allQuestions.find(q => q.id === parseInt(questionIdInput.value));
            if (existingQuestion?.imageUrl?.startsWith('data:image')) imageData = existingQuestion.imageUrl;
        }
        const answerNodes = answersContainer.querySelectorAll('.answer-input-container');
        const answers = Array.from(answerNodes).map(node => node.querySelector('input[type="text"]').value);
        const correctRadio = answersContainer.querySelector('input[type="radio"]:checked');
        if (!correctRadio) { alert('Por favor, marca una respuesta como correcta.'); return; }
        const correctIndex = Array.from(answerNodes).indexOf(correctRadio.closest('.answer-input-container'));
        const questionData = { id: questionIdInput.value ? parseInt(questionIdInput.value) : Date.now(), question: questionInput.value, imageUrl: imageData, answers: answers, correct: correctIndex };
        if (questionIdInput.value) {
            const index = allQuestions.findIndex(q => q.id === questionData.id);
            if(index !== -1) allQuestions[index] = questionData;
        } else { allQuestions.push(questionData); }
        saveQuestions();
        renderAdminList();
        resetForm();
    });

    if(questionsList) questionsList.addEventListener('click', (e) => {
        // Ignorar clics en el checkbox para que no interfieran con la edición/eliminación individual
        if (e.target.closest('.question-checkbox')) return;

        const button = e.target.closest('button');
        if (!button) return;
        const index = button.dataset.index;
        if (index === undefined) return;

        // Lógica de eliminación individual (manteniendo la compatibilidad)
        if (button.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
                allQuestions.splice(index, 1);
                saveQuestions();
                renderAdminList();
                resetForm(); // Limpiar el formulario en caso de que la pregunta que se estaba editando haya sido eliminada
            }
        } 
        // Lógica de edición individual
        else if (button.classList.contains('edit-btn')) {
            const questionToEdit = allQuestions[index];
            resetForm();
            formTitle.textContent = 'Editar Pregunta';
            cancelEditBtn.classList.remove('hidden');
            questionIdInput.value = questionToEdit.id;
            questionInput.value = questionToEdit.question;
            currentImagePreview.innerHTML = '';
            if (questionToEdit.imageUrl?.startsWith('data:image')) {
                document.querySelector('input[name="imageSource"][value="file"]').checked = true;
                imageUrlContainer.classList.add('hidden');
                imageFileContainer.classList.remove('hidden');
                imageUrlInput.value = '';
                currentImagePreview.innerHTML = `<p>Imagen actual:</p><img src="${questionToEdit.imageUrl}" alt="Previsualización">`;
            } else {
                document.querySelector('input[name="imageSource"][value="url"]').checked = true;
                imageUrlContainer.classList.remove('hidden');
                imageFileContainer.classList.add('hidden');
                imageUrlInput.value = questionToEdit.imageUrl || '';
            }
            answersContainer.innerHTML = '';
            questionToEdit.answers.forEach((ans, i) => addAnswerInput(ans, i === questionToEdit.correct));
        }
    });
    
    if(exportBtn) exportBtn.addEventListener('click', () => {
        if(allQuestions.length === 0) { alert("No hay preguntas para exportar."); return; }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allQuestions, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "preguntas_quiz.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    if(importFile) importFile.addEventListener('change', (event) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            try {
                const importedQuestions = JSON.parse(e.target.result);
                if (Array.isArray(importedQuestions) && confirm('¿Quieres reemplazar las preguntas actuales con las del archivo? (Se restablecerán al recargar la página)')) {
                    allQuestions = importedQuestions;
                    saveQuestions(); renderAdminList(); resetForm();
                    alert(`Se importaron ${importedQuestions.length} preguntas.`);
                } else { alert('El archivo JSON no parece tener un formato válido.'); }
            } catch (error) { alert('Error al leer o procesar el archivo JSON.'); }
        };
        if(event.target.files[0]) fileReader.readAsText(event.target.files[0]);
    });
    
    const showExamSettings = () => {
        if (allQuestions.length === 0) { alert('No hay preguntas para iniciar el examen.'); return; }
        examQuestionsCountInput.value = Math.min(allQuestions.length, 10); 
        examQuestionsCountInput.max = allQuestions.length;
        examSettingsModal.classList.add('active');
    };
    
    if(settingsStartBtn) settingsStartBtn.addEventListener('click', () => {
        const duration = parseInt(examDurationInput.value);
        const count = parseInt(examQuestionsCountInput.value);
        if (isNaN(duration) || isNaN(count) || duration < 1 || count < 1) { alert('Por favor, introduce valores válidos.'); return; }
        if (count > allQuestions.length) { alert(`La cantidad máxima de preguntas es: ${allQuestions.length}`); return; }
        examSettingsModal.classList.remove('active');
        startGame(duration, count);
    });
    if(settingsCancelBtn) settingsCancelBtn.addEventListener('click', () => examSettingsModal.classList.remove('active'));

    const startGame = (durationInMinutes, questionCount) => {
        currentQuizQuestions = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, questionCount);
        userAnswers = new Array(currentQuizQuestions.length).fill(null);
        renderAllQuestions(allQuestionsContainer, currentQuizQuestions, false);
        startTimer(durationInMinutes);
        showScreen('game-screen');
    };

    const renderAllQuestions = (container, questions, isResults) => {
        if (!container) return;
        container.innerHTML = '';
        questions.forEach((question, qIndex) => {
            const questionItemDiv = document.createElement('div');
            questionItemDiv.classList.add('question-item');
            let imageHtml = question.imageUrl ? `<img src="${question.imageUrl}" alt="Imagen de la pregunta" class="zoomable-image">` : '';
            let answersHtml = '';
            const questionName = `question-${qIndex}`;
            question.answers.forEach((answer, aIndex) => {
                answersHtml += `<li><label><input type="radio" name="${questionName}" value="${aIndex}" ${isResults ? 'disabled' : ''}><span class="custom-radio"><span class="dot"></span></span><span>${answer}</span><span class="result-marker"></span></label></li>`;
            });
            questionItemDiv.innerHTML = `<h3>${qIndex + 1}) ${question.question}</h3>${imageHtml}<ul class="answers-list">${answersHtml}</ul>`;
            container.appendChild(questionItemDiv);
            if (!isResults) {
                questionItemDiv.querySelectorAll(`input[name="${questionName}"]`).forEach(radio => {
                    radio.addEventListener('change', (e) => { userAnswers[qIndex] = parseInt(e.target.value); });
                });
            }
        });
        container.querySelectorAll('.zoomable-image').forEach(img => {
            img.addEventListener('click', () => openImageViewer(img.src));
        });
    };
    
    const startTimer = (durationInMinutes) => {
        timeLeft = durationInMinutes * 60;
        clearInterval(timer);
        const updateTimerDisplay = () => {
            if (timerSpan) timerSpan.textContent = `${Math.floor(timeLeft / 60)}:${('0' + timeLeft % 60).slice(-2)}`;
        };
        updateTimerDisplay();
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                showModal('Confirmación', '¡Tiempo agotado! Se mostrarán tus resultados.', true);
            }
        }, 1000);
    };
    
    const showModal = (title, message, forceEnd = false) => {
        const modalTitle = document.getElementById('modal-title');
        if (!confirmModal || !modalMessage || !modalTitle) return;
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        confirmModal.classList.add('active');
        const confirmAction = () => { confirmModal.classList.remove('active'); endGame(); };
        const cancelAction = () => { confirmModal.classList.remove('active'); if (forceEnd) endGame(); };
        modalConfirmBtn.onclick = confirmAction;
        modalCancelBtn.onclick = cancelAction;
    };

    const endGame = () => {
        clearInterval(timer);
        displayResults();
        showScreen('results-screen');
    };

    const displayResults = () => {
        if (!resultsDetails || !finalSummary) return;
        resultsDetails.innerHTML = '';
        finalSummary.innerHTML = '';
        let score = 0;
        currentQuizQuestions.forEach((question, index) => {
            const userAnswerIndex = userAnswers[index];
            const isCorrect = userAnswerIndex === question.correct;
            if (isCorrect) score++;
            const questionItemDiv = document.createElement('div');
            questionItemDiv.classList.add('question-item', 'answered');
            let imageHtml = question.imageUrl ? `<img src="${question.imageUrl}" alt="Imagen de la pregunta" class="zoomable-image">` : '';
            let answersHtml = '';
            question.answers.forEach((answer, aIndex) => {
                const isSelected = userAnswerIndex === aIndex;
                const isThisCorrectAnswer = question.correct === aIndex;
                let markerClass = '', markerText = '';
                if (isSelected) {
                    markerClass = isCorrect ? 'correct' : 'incorrect';
                    markerText = isCorrect ? 'CORRECTA' : 'INCORRECTA';
                } else if (isThisCorrectAnswer) {
                     markerClass = 'correct';
                     markerText = 'CORRECTA';
                }
                answersHtml += `<li><label><input type="radio" name="result-question-${index}" value="${aIndex}" ${isSelected ? 'checked' : ''} disabled><span class="custom-radio"><span class="dot"></span></span><span>${answer}</span><span class="result-marker ${markerClass}" style="display:${(isSelected || isThisCorrectAnswer) ? 'inline-block' : 'none'};">${markerText}</span></label></li>`;
            });
            questionItemDiv.innerHTML = `<h3>${index + 1}) ${question.question}</h3>${imageHtml}<ul class="answers-list">${answersHtml}</ul>`;
            resultsDetails.appendChild(questionItemDiv);
        });
        const totalQuestions = currentQuizQuestions.length;
        const percentageCorrect = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
        const isApproved = percentageCorrect >= 70;
        finalSummary.innerHTML = `<p class="summary-score">CORRECTAS: ${score} de ${totalQuestions}</p><p class="summary-status ${isApproved ? 'approved' : 'failed'}">${isApproved ? 'APROBADO' : 'DESAPROBADO'}</p>`;
    };
    
    function openImageViewer(src) { imageViewerImg.setAttribute('src', src); imageViewerModal.classList.add('active'); }
    function closeImageViewer() { imageViewerModal.classList.remove('active'); }
    imageViewerClose.addEventListener('click', closeImageViewer);
    imageViewerModal.addEventListener('click', (e) => { if (e.target === imageViewerModal) closeImageViewer(); });
    document.addEventListener('keydown', (e) => { if (e.key === "Escape" && imageViewerModal.classList.contains('active')) closeImageViewer(); });


    if(addAnswerBtn) addAnswerBtn.addEventListener('click', () => addAnswerInput());
    if(startGameBtn) startGameBtn.addEventListener('click', showExamSettings);
    if(adminQuestionsBtn) adminQuestionsBtn.addEventListener('click', () => { renderAdminList(); resetForm(); showScreen('admin-screen'); });
    if(finishGameBtn) finishGameBtn.addEventListener('click', () => {
        const unansweredCount = userAnswers.filter(answer => answer === null).length;
        if (unansweredCount > 0) showModal('Finalizar Examen',`Aún tienes ${unansweredCount} pregunta(s) sin responder. ¿Quieres finalizar?`);
        else showModal('Finalizar Examen','¿Estás seguro de que quieres finalizar el examen?');
    });
    if(backToMenuBtn) backToMenuBtn.addEventListener('click', () => showScreen('menu-screen'));
    if(adminBackToMenuBtn) adminBackToMenuBtn.addEventListener('click', () => showScreen('menu-screen'));

    const initializeApp = async () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
        await loadQuestions();
        showScreen('menu-screen');
    };

    initializeApp();
});