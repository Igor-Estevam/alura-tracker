<template>
    <section>
        <form @submit.prevent="salvar">
            <div class="field">
                <label for="nomeDoProjeto" class="label">Nome do Projeto</label>
                <input type="text" class="input" v-model="nomeDoProjeto" id="nomeDoProjeto" />
            </div>
            <div class="field">
                <button class="button" type="submit">Salvar</button>
            </div>
        </form>
    </section>
</template>

<script lang="ts">
import { TipoNotificacao } from '@/interfaces/INotificacao';
import IProjeto from '@/interfaces/IProjeto';
import { useStore } from '@/store';
import { ADICIONA_PROJETO, ALTERA_PROJETO, NOTIFICAR } from '@/store/tipo-mutacoes';
import { defineComponent } from 'vue';
import useNotificador from '@/hooks/notificador'

export default defineComponent({
    name: 'Formulário',
    props: {
        id: {
            type: String
        }
    },
    mounted() {
        if (this.id) {
            const projeto = (this.store as any).state.projetos.find((proj: IProjeto) => proj.id == this.id)
            this.nomeDoProjeto = projeto?.nome || ''
        }
    },
    data() {
        return {
            nomeDoProjeto: '',

        };
    },
    methods: {
        salvar() {
            if (this.id) {
                (this.store as any).commit(ALTERA_PROJETO, {
                    id: this.id,
                    nome: this.nomeDoProjeto
                });
            } else {
                (this.store as any).commit(ADICIONA_PROJETO, this.nomeDoProjeto);
            }
            this.nomeDoProjeto = '';
            (this.notificar as any)(TipoNotificacao.SUCESSO, 'Excelente!', 'Projeto cadastrado com sucesso!')
            this.$router.push('/projetos')
        }
    },
    setup() {
        const store = useStore()
        const { notificar } = useNotificador()
        return {
            store,
            notificar
        }
    }
})
</script>