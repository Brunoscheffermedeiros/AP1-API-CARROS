/**
 * ============================================================================
 * GERENCIAMENTO DE CARROS - INTEGRAÇÃO COM A API REST
 * ============================================================================
 * Implementação cliente pura (Vanilla JS) para consumo dos endpoints da API:
 * - GET    /api/carros        -> Listar todos os carros (Status 200)
 * - GET    /api/carros/{id}   -> Buscar carro por ID (Status 200 / 404)
 * - POST   /api/carros        -> Cadastrar novo carro (Status 201)
 * - PUT    /api/carros/{id}   -> Atualizar carro existente (Status 200 / 404)
 * - DELETE /api/carros/{id}   -> Excluir carro (Status 204 / 404)
 * ============================================================================
 */

(function () {
    "use strict";

    // URL base da API compatível com a collection Bruno (porta padrão 5050)
    const API_BASE_URL = (window.location.protocol === "file:" || (window.location.port && window.location.port !== "5050"))
        ? "http://localhost:5050/api/carros"
        : "/api/carros";

    // Elementos do DOM
    const cardFormulario = document.getElementById("card-formulario");
    const formCarro = document.getElementById("form-carro");
    const formTitulo = document.getElementById("form-titulo");
    const badgeModo = document.getElementById("badge-modo");
    const campoId = document.getElementById("carro-id");
    const campoModelo = document.getElementById("campo-modelo");
    const campoAno = document.getElementById("campo-ano");
    const campoCor = document.getElementById("campo-cor");
    const btnSalvar = document.getElementById("btn-salvar");
    const btnCancelar = document.getElementById("btn-cancelar");
    const btnLimpar = document.getElementById("btn-limpar");
    const btnRecarregar = document.getElementById("btn-recarregar");

    const feedbackMsg = document.getElementById("mensagem-feedback");
    const erroConexao = document.getElementById("erro-conexao");
    const erroConexaoTitulo = document.getElementById("erro-conexao-titulo");
    const erroConexaoDetalhe = document.getElementById("erro-conexao-detalhe");

    const indicadorCarregando = document.getElementById("indicador-carregando");
    const textoCarregando = document.getElementById("texto-carregando");
    const tabelaCorpo = document.getElementById("tabela-corpo");
    const contadorCarros = document.getElementById("contador-carros");
    const listaVazia = document.getElementById("lista-vazia");

    // Estado da aplicação
    let carroEmEdicaoId = null;
    let operacaoEmAndamento = false;

    /**
     * Alterna o estado visual de carregamento.
     * @param {boolean} ativo
     * @param {string} [mensagem="Consultando API de carros..."]
     */
    function setCarregando(ativo, mensagem) {
        operacaoEmAndamento = ativo;
        if (ativo) {
            textoCarregando.textContent = mensagem || "Consultando API de carros...";
            indicadorCarregando.style.display = "flex";
            btnSalvar.disabled = true;
            btnRecarregar.disabled = true;
        } else {
            indicadorCarregando.style.display = "none";
            btnSalvar.disabled = false;
            btnRecarregar.disabled = false;
        }
    }

    /**
     * Exibe mensagem temporária de feedback no formulário usando textContent.
     * @param {string} texto
     * @param {"sucesso" | "erro"} tipo
     */
    function exibirFeedback(texto, tipo) {
        feedbackMsg.textContent = texto;
        feedbackMsg.className = `feedback-container feedback-msg feedback-${tipo === "sucesso" ? "success" : "error"}`;

        setTimeout(() => {
            if (feedbackMsg.textContent === texto) {
                feedbackMsg.textContent = "";
                feedbackMsg.className = "feedback-container";
            }
        }, 5000);
    }

    /**
     * Exibe erro de conexão persistente na área da listagem.
     * @param {string} titulo
     * @param {string} detalhe
     */
    function exibirErroConexao(titulo, detalhe) {
        erroConexaoTitulo.textContent = titulo;
        erroConexaoDetalhe.textContent = detalhe;
        erroConexao.style.display = "block";
    }

    /**
     * Limpa o aviso de erro de conexão.
     */
    function limparErroConexao() {
        erroConexao.style.display = "none";
        erroConexaoTitulo.textContent = "";
        erroConexaoDetalhe.textContent = "";
    }

    /**
     * Define o formulário no modo de Criação.
     */
    function definirModoCriacao() {
        carroEmEdicaoId = null;
        campoId.value = "";
        formTitulo.textContent = "Cadastrar Novo Carro";
        badgeModo.textContent = "Criação";
        badgeModo.className = "badge badge-create";
        btnSalvar.textContent = "Cadastrar";
        btnCancelar.style.display = "none";
        cardFormulario.classList.remove("modo-edicao-ativo");
        formCarro.reset();
        destacarLinhaEmEdicao(null);
    }

    /**
     * Define o formulário no modo de Edição com os dados do carro selecionado.
     * @param {{ id: number, modelo: string, ano: number, cor: string }} carro
     */
    function definirModoEdicao(carro) {
        carroEmEdicaoId = carro.id;
        campoId.value = carro.id;
        campoModelo.value = carro.modelo || "";
        campoAno.value = carro.ano || "";
        campoCor.value = carro.cor || "";

        formTitulo.textContent = `Editar Carro (ID #${carro.id})`;
        badgeModo.textContent = "Edição";
        badgeModo.className = "badge badge-edit";
        btnSalvar.textContent = "Salvar Alterações";
        btnCancelar.style.display = "inline-flex";
        cardFormulario.classList.add("modo-edicao-ativo");

        destacarLinhaEmEdicao(carro.id);
        campoModelo.focus();
        exibirFeedback(`Editando o carro #${carro.id}. Altere os valores e clique em Salvar.`, "sucesso");
    }

    /**
     * Aplica classe visual à linha da tabela que está atualmente em edição.
     * @param {number|null} id
     */
    function destacarLinhaEmEdicao(id) {
        const linhas = tabelaCorpo.querySelectorAll("tr");
        linhas.forEach((linha) => {
            if (id !== null && linha.getAttribute("data-id") === String(id)) {
                linha.classList.add("linha-em-edicao");
            } else {
                linha.classList.remove("linha-em-edicao");
            }
        });
    }

    /**
     * Renderiza a lista de carros na tabela utilizando textContent para todos os valores de texto.
     * @param {Array<{ id: number, modelo: string, ano: number, cor: string }>} carros
     */
    function renderizarTabela(carros) {
        tabelaCorpo.textContent = "";

        if (!Array.isArray(carros) || carros.length === 0) {
            listaVazia.style.display = "block";
            contadorCarros.textContent = "0 registros";
            return;
        }

        listaVazia.style.display = "none";
        contadorCarros.textContent = `${carros.length} ${carros.length === 1 ? "registro" : "registros"}`;

        carros.forEach((carro) => {
            const tr = document.createElement("tr");
            tr.setAttribute("data-id", String(carro.id));

            if (carroEmEdicaoId === carro.id) {
                tr.classList.add("linha-em-edicao");
            }

            // Coluna ID
            const tdId = document.createElement("td");
            const spanId = document.createElement("span");
            spanId.className = "badge-row-id";
            spanId.textContent = `#${carro.id}`;
            tdId.appendChild(spanId);

            // Coluna Modelo (inserção segura via textContent)
            const tdModelo = document.createElement("td");
            tdModelo.textContent = carro.modelo != null ? String(carro.modelo) : "";

            // Coluna Ano (inserção segura via textContent)
            const tdAno = document.createElement("td");
            tdAno.textContent = carro.ano != null ? String(carro.ano) : "";

            // Coluna Cor (inserção segura via textContent)
            const tdCor = document.createElement("td");
            tdCor.textContent = carro.cor != null ? String(carro.cor) : "";

            // Coluna Ações
            const tdAcoes = document.createElement("td");
            const containerAcoes = document.createElement("div");
            containerAcoes.className = "btn-group-actions";

            // Botão Editar
            const btnEditar = document.createElement("button");
            btnEditar.type = "button";
            btnEditar.className = "btn-edit-sm";
            btnEditar.textContent = "Editar";
            btnEditar.addEventListener("click", () => definirModoEdicao(carro));

            // Botão Excluir
            const btnExcluir = document.createElement("button");
            btnExcluir.type = "button";
            btnExcluir.className = "btn-danger-sm";
            btnExcluir.textContent = "Excluir";
            btnExcluir.addEventListener("click", () => solicitarExclusao(carro));

            containerAcoes.appendChild(btnEditar);
            containerAcoes.appendChild(btnExcluir);
            tdAcoes.appendChild(containerAcoes);

            tr.appendChild(tdId);
            tr.appendChild(tdModelo);
            tr.appendChild(tdAno);
            tr.appendChild(tdCor);
            tr.appendChild(tdAcoes);

            tabelaCorpo.appendChild(tr);
        });
    }

    // ========================================================================
    // REQUISIÇÕES À API (FETCH)
    // ========================================================================

    /**
     * GET /api/carros - Lista todos os carros da API.
     */
    async function listarCarros() {
        setCarregando(true, "Carregando carros da API...");
        limparErroConexao();

        try {
            const resposta = await fetch(API_BASE_URL, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });

            if (!resposta.ok) {
                throw new Error(`A API retornou status HTTP ${resposta.status} (${resposta.statusText})`);
            }

            const dados = await resposta.json();
            renderizarTabela(dados);
        } catch (erro) {
            console.error("Erro ao listar carros:", erro);
            exibirErroConexao(
                "Não foi possível obter a lista de carros da API",
                `Detalhe: ${erro.message}. Verifique se a aplicação está em execução em ${API_BASE_URL}.`
            );
            tabelaCorpo.textContent = "";
            listaVazia.style.display = "block";
            contadorCarros.textContent = "Erro";
        } finally {
            setCarregando(false);
        }
    }

    /**
     * POST /api/carros - Cadastra um novo carro.
     * @param {{ modelo: string, ano: number, cor: string }} dadosCarro
     */
    async function cadastrarCarro(dadosCarro) {
        setCarregando(true, "Gravando novo carro na API...");

        try {
            const resposta = await fetch(API_BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(dadosCarro)
            });

            if (resposta.status === 201) {
                const criado = await resposta.json();
                exibirFeedback(`Carro #${criado.id} (${criado.modelo}) cadastrado com sucesso! (HTTP 201)`, "sucesso");
                definirModoCriacao();
                await listarCarros();
            } else if (resposta.status === 400) {
                exibirFeedback("Dados inválidos fornecidos para cadastro (HTTP 400).", "erro");
            } else {
                throw new Error(`Falha ao cadastrar: HTTP ${resposta.status} (${resposta.statusText})`);
            }
        } catch (erro) {
            console.error("Erro ao cadastrar carro:", erro);
            exibirFeedback(`Erro ao salvar: ${erro.message}`, "erro");
        } finally {
            setCarregando(false);
        }
    }

    /**
     * PUT /api/carros/{id} - Atualiza um carro existente.
     * @param {number} id
     * @param {{ modelo: string, ano: number, cor: string }} dadosCarro
     */
    async function atualizarCarro(id, dadosCarro) {
        setCarregando(true, `Atualizando carro #${id} na API...`);

        try {
            const resposta = await fetch(`${API_BASE_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(dadosCarro)
            });

            if (resposta.status === 200) {
                const atualizado = await resposta.json();
                exibirFeedback(`Carro #${atualizado.id} atualizado com sucesso! (HTTP 200)`, "sucesso");
                definirModoCriacao();
                await listarCarros();
            } else if (resposta.status === 404) {
                exibirFeedback(`O carro com ID #${id} não foi encontrado na API (HTTP 404).`, "erro");
                definirModoCriacao();
                await listarCarros();
            } else if (resposta.status === 400) {
                exibirFeedback("Dados inválidos fornecidos para atualização (HTTP 400).", "erro");
            } else {
                throw new Error(`Falha ao atualizar: HTTP ${resposta.status} (${resposta.statusText})`);
            }
        } catch (erro) {
            console.error("Erro ao atualizar carro:", erro);
            exibirFeedback(`Erro ao atualizar: ${erro.message}`, "erro");
        } finally {
            setCarregando(false);
        }
    }

    /**
     * DELETE /api/carros/{id} - Remove um carro da API.
     * @param {{ id: number, modelo: string }} carro
     */
    async function solicitarExclusao(carro) {
        const confirmacao = window.confirm(
            `Deseja realmente excluir o carro #${carro.id} (${carro.modelo}) da API?`
        );
        if (!confirmacao) return;

        setCarregando(true, `Excluindo carro #${carro.id} da API...`);

        try {
            const resposta = await fetch(`${API_BASE_URL}/${carro.id}`, {
                method: "DELETE",
                headers: { "Accept": "*/*" }
            });

            if (resposta.status === 204) {
                exibirFeedback(`Carro #${carro.id} removido com sucesso! (HTTP 204)`, "sucesso");
                if (carroEmEdicaoId === carro.id) {
                    definirModoCriacao();
                }
                await listarCarros();
            } else if (resposta.status === 404) {
                exibirFeedback(`O carro #${carro.id} não foi encontrado na API para exclusão (HTTP 404).`, "erro");
                await listarCarros();
            } else {
                throw new Error(`Falha ao excluir: HTTP ${resposta.status} (${resposta.statusText})`);
            }
        } catch (erro) {
            console.error("Erro ao excluir carro:", erro);
            exibirFeedback(`Erro ao excluir: ${erro.message}`, "erro");
        } finally {
            setCarregando(false);
        }
    }

    /**
     * Processa o envio do formulário (decide entre cadastrar ou atualizar).
     */
    function handleFormSubmit(event) {
        event.preventDefault();

        if (operacaoEmAndamento) return;

        const modelo = campoModelo.value.trim();
        const anoValor = campoAno.value.trim();
        const cor = campoCor.value.trim();

        if (!modelo || !anoValor || !cor) {
            exibirFeedback("Preencha todos os campos obrigatórios (Modelo, Ano e Cor).", "erro");
            return;
        }

        const ano = parseInt(anoValor, 10);
        if (isNaN(ano) || ano < 1886 || ano > 2100) {
            exibirFeedback("Por favor, insira um ano válido entre 1886 e 2100.", "erro");
            return;
        }

        const payload = {
            modelo: modelo,
            ano: ano,
            cor: cor
        };

        if (carroEmEdicaoId !== null) {
            atualizarCarro(carroEmEdicaoId, payload);
        } else {
            cadastrarCarro(payload);
        }
    }

    // ========================================================================
    // REGISTRO DE EVENTOS
    // ========================================================================
    formCarro.addEventListener("submit", handleFormSubmit);

    btnLimpar.addEventListener("click", () => {
        formCarro.reset();
        campoModelo.focus();
    });

    btnCancelar.addEventListener("click", () => {
        definirModoCriacao();
        exibirFeedback("Edição cancelada. Retornado ao modo de cadastro.", "sucesso");
    });

    btnRecarregar.addEventListener("click", () => {
        listarCarros();
    });

    // Carga inicial dos carros ao abrir a interface
    listarCarros();
})();
