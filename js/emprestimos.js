'use strict'

let ultimoCodigo = 0

const openModal = () => document.getElementById('modal').classList.add('active')
const closeModal = () => {
    document.getElementById('modal').classList.remove('active')
    document.getElementById('form').reset()
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_emprestimo')) ?? []
const setLocalStorage = (dbEmprestimo) => localStorage.setItem("db_emprestimo", JSON.stringify(dbEmprestimo))

const getLivros = () => JSON.parse(localStorage.getItem('db_livro')) ?? []
const getAlunos = () => JSON.parse(localStorage.getItem('db_aluno')) ?? []
const getFuncionarios = () => JSON.parse(localStorage.getItem('db_funcionario')) ?? []

const getAllUsuarios = () => {
    const alunos = getAlunos().map(a => ({ nome: a.nome, matricula: a.matricula, tipo: 'Aluno' }))
    const funcionarios = getFuncionarios().map(f => ({ nome: f.nome, matricula: f.matricula, tipo: 'Funcionário' }))
    return [...alunos, ...funcionarios]
}

const createEmprestimo = (emprestimo) => {
    const dbEmprestimo = getLocalStorage()
    dbEmprestimo.push(emprestimo)
    setLocalStorage(dbEmprestimo)
}

const deleteEmprestimo = (index) => {
    const dbEmprestimo = getLocalStorage()
    dbEmprestimo.splice(index, 1)
    setLocalStorage(dbEmprestimo)
    updateTable()
}

const carregarSelects = () => {
    const livroSelect = document.getElementById('m-livro-alug')
    const usuarioSelect = document.getElementById('m-usuario')
    
    if (livroSelect) {
        livroSelect.innerHTML = '<option value="">Selecione o Livro</option>'
        const livros = getLivros()
        livros.forEach(livro => {
            const option = document.createElement('option')
            option.value = livro.nome
            option.textContent = `${livro.nome} - ${livro.autor}`
            livroSelect.appendChild(option)
        })
    }
    
    if (usuarioSelect) {
        usuarioSelect.innerHTML = '<option value="">Selecione o Usuário</option>'
        const usuarios = getAllUsuarios()
        usuarios.forEach(usuario => {
            const option = document.createElement('option')
            option.value = usuario.nome
            option.textContent = `${usuario.nome} (${usuario.tipo})`
            usuarioSelect.appendChild(option)
        })
    }
}

const saveEmprestimo = () => {
    const livroSelect = document.getElementById('m-livro-alug')
    const usuarioSelect = document.getElementById('m-usuario')
    const dataEmprestimo = document.getElementById('m-data-aluguel').value
    const dataDevolucao = document.getElementById('m-prev-data').value

    if (!livroSelect.value || !usuarioSelect.value || !dataEmprestimo || !dataDevolucao) {
        alert('Preencha todos os campos!')
        return
    }

    const emprestimos = getLocalStorage()
    ultimoCodigo = emprestimos.length > 0 ? Math.max(...emprestimos.map(e => e.codigo)) + 1 : 1

    const emprestimo = {
        codigo: ultimoCodigo,
        usuario: usuarioSelect.value,
        livro: livroSelect.value,
        dataEmprestimo: dataEmprestimo,
        dataDevolucao: dataDevolucao,
        status: 'Ativo'
    }
    createEmprestimo(emprestimo)
    updateTable()
    closeModal()
}

const createRow = (emprestimo, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td> ${emprestimo.codigo} </td>
        <td> ${emprestimo.usuario} </td>
        <td> ${emprestimo.livro} </td>
        <td> ${emprestimo.dataEmprestimo} </td>
        <td> ${emprestimo.dataDevolucao} </td>
        <td>
            <button type="button" class="button red delete-btn" data-index="${index}">Devolver</button>
        </td>
    `
    document.querySelector('#tableEmprestimos>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableEmprestimos>tbody tr')
    rows.forEach(row => row.remove())
}

const updateTable = () => {
    const dbEmprestimo = getLocalStorage()
    clearTable()
    dbEmprestimo.forEach(createRow)
}

const handleTableClick = (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const index = event.target.getAttribute('data-index')
        if (confirm('Deseja registrar a devolução deste livro?')) {
            deleteEmprestimo(parseInt(index))
        }
    }
}

// Eventos
document.getElementById('cadastrarCliente')?.addEventListener('click', () => {
    carregarSelects()
    openModal()
})
document.getElementById('modalClose')?.addEventListener('click', closeModal)
document.getElementById('cancelar')?.addEventListener('click', closeModal)
document.getElementById('salvar')?.addEventListener('click', saveEmprestimo)
document.querySelector('#tableEmprestimos>tbody')?.addEventListener('click', handleTableClick)

updateTable()