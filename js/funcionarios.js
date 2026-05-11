'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')
const openModal2 = () => document.getElementById('modal2').classList.add('active')

const closeModal2 = () => {
    document.getElementById('modal2').classList.remove('active')
}

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_funcionario')) ?? []
const setLocalStorage = (dbFuncionario) => localStorage.setItem('db_funcionario', JSON.stringify(dbFuncionario))

const deleteFuncionario = (index) => {
    const dbFuncionario = readFuncionario()
    dbFuncionario.splice(index, 1)
    setLocalStorage(dbFuncionario)
}

const updateFuncionario = (index, funcionario) => {
    const dbFuncionario = readFuncionario()
    dbFuncionario[index] = funcionario
    setLocalStorage(dbFuncionario)
}

const readFuncionario = () => getLocalStorage()

const createFuncionario = (funcionario) => {
    const dbFuncionario = readFuncionario()
    dbFuncionario.push(funcionario)
    setLocalStorage(dbFuncionario)
}

const isValidFields = () => document.getElementById('form').reportValidity()

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveFuncionario = () => {
    if (isValidFields()) {
        const funcionario = {
            nome: document.getElementById('nome').value,
            matricula: document.getElementById('matricula').value,
            cargo: document.getElementById('cargo').value,
            celular: document.getElementById('celular').value,
            email: document.getElementById('email').value,
            endereco: document.getElementById('endereco').value,
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createFuncionario(funcionario)
        } else {
            updateFuncionario(index, funcionario)
        }
        updateTable()
        closeModal()
    }
}

const createRow = (funcionario, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td> ${funcionario.nome} </td>
        <td> ${funcionario.matricula} </td>
        <td> ${funcionario.cargo} </td>
        <td> ${funcionario.celular} </td>
        <td> ${funcionario.email} </td>
        <td>
            <button type="button" class="button green edit-btn" data-index="${index}">Editar</button>
            <button type="button" class="button red delete-btn" data-index="${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableFuncionario>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableFuncionario>tbody tr')
    rows.forEach(row => row.remove())
}

const updateTable = () => {
    const dbFuncionario = readFuncionario()
    clearTable()
    dbFuncionario.forEach(createRow)
    atualizarDashboard()
}

const fillFields = (funcionario, index) => {
    document.getElementById('nome').value = funcionario.nome
    document.getElementById('matricula').value = funcionario.matricula
    document.getElementById('cargo').value = funcionario.cargo
    document.getElementById('celular').value = funcionario.celular
    document.getElementById('email').value = funcionario.email
    document.getElementById('endereco').value = funcionario.endereco
    document.getElementById('nome').dataset.index = index
}

const editFuncionario = (index) => {
    const funcionario = readFuncionario()[index]
    fillFields(funcionario, index)
    openModal()
}

let deleteIndex = null

const handleTableClick = (event) => {
    const target = event.target
    if (target.classList.contains('edit-btn')) {
        const index = target.getAttribute('data-index')
        editFuncionario(index)
    } else if (target.classList.contains('delete-btn')) {
        deleteIndex = target.getAttribute('data-index')
        const funcionario = readFuncionario()[deleteIndex]
        const avisoDelete = document.querySelector('#avisoDelete')
        avisoDelete.innerHTML = `<p>Deseja realmente excluir o funcionário ${funcionario.nome}?</p>`
        openModal2()
    }
}

const atualizarDashboard = () => {
    const numeroFuncionarios = document.getElementById('number-funcionario')
    if (numeroFuncionarios) {
        numeroFuncionarios.innerText = readFuncionario().length
    }
}

document.getElementById('apagar')?.addEventListener('click', () => {
    if (deleteIndex !== null) {
        deleteFuncionario(deleteIndex)
        updateTable()
        closeModal2()
        deleteIndex = null
    }
})

document.getElementById('cadastrarFuncionario')?.addEventListener('click', openModal)
document.getElementById('modalClose')?.addEventListener('click', closeModal)
document.getElementById('modalClose2')?.addEventListener('click', closeModal2)
document.getElementById('salvar')?.addEventListener('click', saveFuncionario)
document.getElementById('cancelar')?.addEventListener('click', closeModal)
document.getElementById('cancelar2')?.addEventListener('click', closeModal2)
document.querySelector('#tableFuncionario>tbody')?.addEventListener('click', handleTableClick)

updateTable()