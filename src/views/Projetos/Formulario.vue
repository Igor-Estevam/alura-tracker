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
import { defineComponent, ref } from 'vue';
import useNotificador from '@/hooks/notificador'
import { ALTERAR_PROJETO, CADASTRAR_PROJETO } from '@/store/tipo-actions';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'Formulário',
    props: {
        id: {
            type: String
        }
    },
    setup(props) {

        const router = useRouter()

        const store = useStore()
        const { notificar } = useNotificador()

        const nomeDoProjeto = ref('') as any;
        if (props.id) {
            const projeto = (store as any).state.projeto.projetos.find((proj: IProjeto) => proj.id == props.id);
            nomeDoProjeto.value = projeto?.nome || ''
        }

        const lidarComSucesso = () => {
            nomeDoProjeto.value = '';
            (notificar as any)(TipoNotificacao.SUCESSO, 'Excelente!', 'Projeto cadastrado com sucesso!')
            router.push('/projetos')
        }

        const salvar = () => {
            if (props.id) {
                (store as any).dispatch(ALTERAR_PROJETO, {
                    id: props.id,
                    nome: nomeDoProjeto.value
                }).then(() => lidarComSucesso());
            } else {
                (store as any)
                    .dispatch(CADASTRAR_PROJETO, nomeDoProjeto.value)
                    .then(() => lidarComSucesso())
            }
        }
        return {
            nomeDoProjeto,
            salvar
        }
    }
})
</script>