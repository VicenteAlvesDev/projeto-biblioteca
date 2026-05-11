'use strict'

const atualizarDashboard = () => {
    const numeroAlunos = document.getElementById('number-alunos')
    const numeroFuncionarios = document.getElementById('number-funcionario')
    const numeroEditoras = document.getElementById('number-editoras')
    const numeroLivros = document.getElementById('number-livros')
    const numeroEmprestimos = document.getElementById('number-emprestimo')
    
    if (numeroAlunos) {
        const alunos = JSON.parse(localStorage.getItem('db_aluno')) ?? []
        numeroAlunos.innerText = alunos.length
    }
    if (numeroFuncionarios) {
        const funcionarios = JSON.parse(localStorage.getItem('db_funcionario')) ?? []
        numeroFuncionarios.innerText = funcionarios.length
    }
    if (numeroEditoras) {
        const editoras = JSON.parse(localStorage.getItem('db_editora')) ?? []
        numeroEditoras.innerText = editoras.length
    }
    if (numeroLivros) {
        const livros = JSON.parse(localStorage.getItem('db_livro')) ?? []
        numeroLivros.innerText = livros.length
    }
    if (numeroEmprestimos) {
        const emprestimos = JSON.parse(localStorage.getItem('db_emprestimo')) ?? []
        numeroEmprestimos.innerText = emprestimos.length
    }
}

setInterval(atualizarDashboard, 1000)
atualizarDashboard()