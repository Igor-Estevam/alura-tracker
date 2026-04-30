<template>
  <Formulario @aoSalvarTarefa="salvarTarefa" />
  <div class="lista">
    <Box v-if="listaEstaVazia">
      Você não está muito produtivo hoje :(
    </Box>
    <div class="field">
      <p class="control has-icons-left">
        <input class="input" type="text" placeholder="Digite para filtrar" v-model="filtro" />
        <span class="icon is-small is-left">
          <i class="fas fa-search"></i>
        </span>
      </p>
    </div>
    <Tarefa v-for="(tarefa, index) in tarefas" :key="index" :tarefa="tarefa" @aoTarefaClicada="selecionarTarefa" />
    <Modal :mostrar="tarefaSelecionada != null">
      <template v-slot:cabecalho>
        <p class="modal-card-title">Editar tarefa</p>
        <button @click="fecharModal" class="delete" aria-label="close"></button>
      </template>
      <template v-slot:corpo>
        <div class="field">
          <label for="descricaoDaTarefa" class="label">Descrição</label>
          <input type="text" class="input" v-model="tarefaSelecionada.descricao" id="descricaoDaTarefa" />
        </div>
      </template>
      <template v-slot:rodape>
        <div class="buttons">
          <button @click="alterarTarefa" class="button is-success">Salvar alterações</button>
          <button @click="fecharModal" class="button">Cancelar</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue';
import Formulario from '../components/Formulario.vue'
import Tarefa from '../components/Tarefa.vue'
import Box from '../components/Box.vue'
import { useStore } from '@/store';
import { ALTERAR_TAREFA, CADASTRAR_TAREFA, OBTER_PROJETOS, OBTER_TAREFAS } from '@/store/tipo-actions';
import ITarefa from '@/interfaces/ITarefa';
import Modal from '@/components/Modal.vue';

export default defineComponent({
  name: 'App',
  components: {
    Formulario,
    Tarefa,
    Box,
    Modal
  },
  data() {
    return {
      tarefaSelecionada: null as ITarefa | null
    }
  },
  computed: {
    listaEstaVazia(): boolean {
      return (this.tarefas as any).length === 0
    }
  },
  methods: {
    salvarTarefa(tarefa: ITarefa) {
      (this.store as any).dispatch(CADASTRAR_TAREFA, tarefa)
    },
    selecionarTarefa(tarefa: ITarefa) {
      this.tarefaSelecionada = tarefa
    },
    fecharModal() {
      this.tarefaSelecionada = null
    },
    alterarTarefa() {
      (this.store as any).dispatch(ALTERAR_TAREFA, this.tarefaSelecionada)
        .then(() => this.fecharModal())
    }
  },
  setup() {
    const store = useStore()
    store.dispatch(OBTER_TAREFAS)
    store.dispatch(OBTER_PROJETOS)

    const filtro = ref('') as any

    //const tarefas = computed(() => store.state.tarefa.tarefas.filter((t) => !filtro.value || t.descricao.includes(filtro.value)))

    watchEffect(() => {
      store.dispatch(OBTER_TAREFAS, filtro.value)
    })

    return {
      tarefas: computed(() => store.state.tarefa.tarefas),
      store,
      filtro
    }
  }
});
</script>