'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')
const openModal2 = () => document.getElementById('modal12').classList.add('active');

const closeModal2 = () => {
    document.getElementById('modal12').classList.remove('active');
}

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_editora')) ?? [];
const setLocalStorage = (dbEditora) => localStorage.setItem("db_editora", JSON.stringify(dbEditora));

const deleteEditora = (index) => {
    const dbEditora = readEditora();
    dbEditora.splice(index, 1);
    setLocalStorage(dbEditora);
}

const updateEditora = (index, editora) => {
    const dbEditora = readEditora();
    dbEditora[index] = editora;
    setLocalStorage(dbEditora);
}

const readEditora = () => getLocalStorage();

const createEditora = (editora) => {
    const dbEditora = getLocalStorage();
    dbEditora.push(editora);
    setLocalStorage(dbEditora);
}

const isValidFields = () => document.getElementById('form').reportValidity();

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = "");
    document.getElementById('nome').dataset.index = 'new';
}

const saveEditora = () => {
    if(isValidFields()){
        const editora = {
            nome: document.getElementById('nome').value,
            gerente: document.getElementById('gerente').value,
            email: document.getElementById('email').value,
            endereco: document.getElementById('endereco').value,
            celular: document.getElementById('celular').value,
            telefone: document.getElementById('telefone').value
        }
        const index = document.getElementById('nome').dataset.index;
        if(index == 'new'){
            createEditora(editora);
            updateTable();
            closeModal();
        }else{
            updateEditora(index, editora);
            updateTable();
            closeModal();
        }
    }
}

const createRow = (editora, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${editora.nome}</td>
        <td>${editora.gerente}</td>
        <td>${editora.email}</td>
        <td>${editora.celular}</td>
        <td>${editora.telefone}</td>
        <td>
            <button type="button" class="button green edit-btn" data-index="${index}">Editar</button>
            <button type="button" class="button red delete-btn" data-index="${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableEditora>tbody').appendChild(newRow);
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableEditora>tbody tr');
    rows.forEach(row => row.remove());
}

const updateTable = () => {
    const dbEditora = readEditora();
    clearTable();
    dbEditora.forEach(createRow);
}

const fillFields = (editora, index) => {
    document.getElementById('nome').value = editora.nome;
    document.getElementById('gerente').value = editora.gerente;
    document.getElementById('email').value = editora.email;
    document.getElementById('endereco').value = editora.endereco;
    document.getElementById('celular').value = editora.celular;
    document.getElementById('telefone').value = editora.telefone;
    document.getElementById('nome').dataset.index = index;
}

const editEditora = (index) => {
    const editora = readEditora()[index];
    fillFields(editora, index);
    openModal();
}

let deleteIndex = null;

const handleTableClick = (event) => {
    const target = event.target;
    if (target.classList.contains('edit-btn')) {
        const index = target.getAttribute('data-index');
        editEditora(index);
    } else if (target.classList.contains('delete-btn')) {
        deleteIndex = target.getAttribute('data-index');
        const editora = readEditora()[deleteIndex];
        const avisoDelete = document.querySelector('#avisoDelete');
        avisoDelete.innerHTML = `<p>Deseja realmente excluir a editora ${editora.nome}?</p>`;
        openModal2();
    }
}

document.getElementById('apagar')?.addEventListener('click', () => {
    if (deleteIndex !== null) {
        deleteEditora(deleteIndex);
        updateTable();
        closeModal2();
        deleteIndex = null;
    }
});

updateTable();

document.getElementById('cadastrarEditora').addEventListener('click', openModal);
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modalClos2').addEventListener('click', closeModal2);
document.getElementById('salvar').addEventListener('click', saveEditora);
document.querySelector('#tableEditora>tbody').addEventListener('click', handleTableClick);
document.getElementById('cancelar').addEventListener('click', closeModal);
document.getElementById('cancelar2').addEventListener('click', closeModal2);