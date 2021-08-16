<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import checkAuthRoute from '../handlers/auth.filter';
    import VFormText from './base/VFormText.vue';
    
    const router = useRouter();
    
    onMounted(() => {
      checkAuthRoute(router, 'login');
    });
    
    const formData = ref({ login: '', password: '' });
    
    const onFormSubmit = () => {
      const authResult = formData.value.login === 'root' && formData.value.password === 'heka';
      if (!authResult) alert('Hatalı giriş.');
      else {
        localStorage.setItem('hn_user', '1');
        router.push({ name: 'logic' });
      }
    };

    const goToDashboard = () => {
      router.push({ name: 'dashboard' });
    }
    
    </script>
    <template>
      <div class="login-form">
        <div class="flex-col mx-auto w-25 space-y-2 mt-4 border-1 border-blue-300 p-2 rounded bg-blue-50">
          <div class="flex justify-start items-center">
            <img src="/heka.jpeg" class="h-20">
            <span class="w-full text-center font-bold text-size-xl text-shadow-sm">Nodes</span>
          </div>
          <VFormText v-model="formData.login" :label="'Login'" :required="true" />
          <VFormText v-model="formData.password" :label="'Password'" type="password" :required="true" />
          <button
            class="btn w-full"
            type="button"
            @click="onFormSubmit()"
          >
            Sign In
          </button>

          <button
            class="border-1 font-bold py-2 border-green-500 bg-green-50 text-green-500 w-full"
            type="button"
            @click="goToDashboard()"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </template>
    <style lang="postcss" scoped>
    .unfold-enter-start {
      max-height: 0
    }
    </style>
    