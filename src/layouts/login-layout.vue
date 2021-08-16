<script setup lang="ts">
    import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';
    import { useRouter } from 'vue-router';
    
    </script>
    <template>
      <main ref="main" class="h-full bg-gray-100 py-4">
        <router-view />
      </main>
    </template>
    
    <style lang="postcss" scoped>
    </style>
    