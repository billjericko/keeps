<template>
  <q-page>
    <div class="q-pa-lg q-px-lg">
      <div class="q-pb-md text-center">
        <q-img class="q-pa-md" style="height: 40px; width: 150px;" src="@/assets/display.png"/>
      </div>
      <q-card class="my-card">
        <q-card-section>
          <q-editor 
            v-model="editor" 
            min-height="5rem" 
            toolbar-bg="primary"
            content-class="bg-cyan-1"
            toolbar-text-color="black"
            toolbar-toggle-color="white"
            placeholder="Enter your keeps here"/>
          <div class="text-right">
            <q-btn @click="addTask()" :disable="editor == ''" class="q-my-sm" color="primary" label="Add Task" icon="add" />
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="q-pa-sm q-px-lg">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-subtitle2 q-ml-lg"><b>ACTIVE KEEPS</b></div>
          <div class="text-overline q-ml-lg">STATUS: {{keeps.length - keeps.filter(e => e.done == 0).length}}/{{keeps.length}}</div>
          <div class="q-pa-md q-gutter-sm">
            <q-banner v-for="(keep,n) in keeps.filter(e => e.done == 0)" :key="n" inline-actions rounded :style="[{'background-color': keep.color},{'color': getBrightness(keep.color)}]" >
              <div v-html="keep.text" :class="[keep.done == 1 ? 'text-strike' : '']"></div>
              <template v-slot:action>
                <q-btn @click="markKeep(keep,1)" round class="q-mx-xs" size="sm" color="positive" icon="check">
                  <q-tooltip class="bg-positive">Mark as Done</q-tooltip>
                </q-btn>
                <q-btn @click="deleteKeep(keep)" round class="q-mx-xs" size="sm" color="red" icon="delete">
                  <q-tooltip class="bg-red" >Delete my keep</q-tooltip>
                </q-btn>
                <q-btn @click="openColorPicker(keep)" round class="q-mx-xs" size="sm" color="pink" icon="palette">
                  <q-tooltip class="bg-pink">Change color</q-tooltip>
                </q-btn>
              </template>
            </q-banner>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle2 q-ml-lg"><b>FINISHED KEEPS</b></div>
          <div class="q-pa-md q-gutter-sm">
            <q-banner v-for="(keep,n) in keeps.filter(e => e.done == 1)" :key="n" inline-actions rounded outline :style="[{'background-color': keep.color},{'color': getBrightness(keep.color)}]" >
              <div v-html="keep.text" :class="[keep.done == 1 ? 'text-strike' : '']"></div>
              <template v-slot:action>
                <q-btn @click="markKeep(keep,0)" round class="q-mx-xs" size="sm" color="positive" icon="close-box">
                  <q-tooltip class="bg-positive">Undone</q-tooltip>
                </q-btn>
                <q-btn @click="deleteKeep(keep)" round class="q-mx-xs" size="sm" color="red" icon="delete">
                  <q-tooltip class="bg-red" >Delete my keep</q-tooltip>
                </q-btn>
                <q-btn @click="openColorPicker(keep)" round class="q-mx-xs" size="sm" color="pink" icon="palette">
                  <q-tooltip class="bg-pink">Change color</q-tooltip>
                </q-btn>
              </template>
            </q-banner>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="colorpicker" seamless persistent position="right">
      <q-card>
        <q-card-section class="items-center no-wrap">
          <div class="text-subtitle2">Choose color</div>
          <q-color
            v-model="hex"
            no-header
            no-footer
            bordered
            default-view="palette"
            class="my-picker"
          />
          <q-badge class="q-mt-sm" rounded :style="[{'background-color': hex},{'color': getBrightness(hex)}]"  :label="hex" />
          <div class="row justify-end">
            <q-btn @click="saveColor()" rounded class="q-mx-xs" size="sm" color="primary" label="Save"></q-btn>
            <q-btn @click="colorpicker = false" rounded outline class="q-mx-xs" size="sm" color="primary" label="Cancel"></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { computed,onMounted, ref } from 'vue'
import { colors } from 'quasar'
import { useStore } from 'vuex'

export default {

  setup () {
    const store = useStore();

    let editor = ref('');
    let colorpicker = ref(false);
    let hex = ref('#006cd6');
    let activeKeep = ref('');
    let keeps = computed(function() { return store.state.keeps});

    function saveColor(){
      colorpicker.value = false;
      store.commit("updateColor",{ID: activeKeep.value,color : hex.value});
    }

    function openColorPicker(keep){
      activeKeep.value = keep.ID;
      hex.value = keep.color;
      colorpicker.value = true;
    }

    function getBrightness(color){
      if(colors.brightness(color) < 128){
        return '#ffffff';
      }
      else{
        return '#000000';
      }
    }

    function addTask(){
      let ID = keeps.value.length + 1;
      while(keeps.value.find(e => e.ID == ID) != undefined){
        ID = ID + 1;
      }
      
      let newData = {
        ID: ID,
        text: editor.value,
        color: '#006cd6',
        done: 0
      }
      editor.value = "";
      store.dispatch("addNew",newData)
    }

    function markKeep(keep,stat){
      colorpicker.value = false;
      store.dispatch("updateStatus",{ID : keep.ID, status: stat});
    }

    function deleteKeep(keep){
      colorpicker.value = false;
      store.dispatch("deleteKeep",{ID : keep.ID});
    }

    onMounted(async () => {document.title = 'KEEPS' ;store.commit("initializeKeep");});

    return {
      editor,
      colorpicker,
      hex,
      activeKeep,
      keeps,
      saveColor,
      openColorPicker,
      getBrightness,
      markKeep,
      addTask,
      deleteKeep
    }
  }
}
</script>