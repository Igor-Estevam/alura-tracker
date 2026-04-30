import http from "@/http";
import { INotificacao } from "@/interfaces/INotificacao";
import ITarefa from "@/interfaces/ITarefa";
import { Estado } from "@/store";
import { OBTER_TAREFAS, CADASTRAR_TAREFA, ALTERAR_TAREFA } from "@/store/tipo-actions";
import { ADICIONA_TAREFA, ALTERA_TAREFA, REMOVE_TAREFA, DEFINIR_TAREFAS, NOTIFICAR } from "@/store/tipo-mutacoes";
import { Module } from "vuex";

export interface EstadoTarefa {
    tarefas: ITarefa[]
}

export const tarefa: Module<EstadoTarefa, Estado> = {
    mutations: {
        [ADICIONA_TAREFA](state, tarefa: ITarefa) {
            state.tarefas.push(tarefa)
        },
        [ALTERA_TAREFA](state, tarefa: ITarefa) {
            const indice = state.tarefas.findIndex(tar => tar.id == tarefa.id)
            state.tarefas[indice] = tarefa
        },
        [REMOVE_TAREFA](state, id: string) {
            state.tarefas = state.tarefas.filter(tar => !tar.id) //CUIDADO!!!!!!!!!
        },
        [DEFINIR_TAREFAS](state, tarefas: ITarefa[]) {
            state.tarefas = tarefas
        }
    },
    actions: {
        [OBTER_TAREFAS]({ commit }, filtro: string) {
            let url = 'tarefas'

            if(filtro){
                url += '?descricao=' + filtro
            }

            http.get(url)
                .then(resposta => commit(DEFINIR_TAREFAS, resposta.data))
        },
        [CADASTRAR_TAREFA]({ commit }, tarefa: ITarefa) {
            return http.post('/tarefas', tarefa)
                .then(resposta => commit(ADICIONA_TAREFA, resposta.data))
        },
        [ALTERAR_TAREFA]({ commit }, tarefa: ITarefa) {
            return http.put(`/tarefas/${tarefa.id}`, tarefa)
                .then(resposta => commit(ALTERA_TAREFA, tarefa))
        },
    }
}