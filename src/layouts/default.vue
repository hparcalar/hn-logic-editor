<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { SidebarMenu } from 'vue-sidebar-menu'
import checkAuthRoute from '../handlers/auth.filter';

const router = useRouter();
onMounted(() => {
  checkAuthRoute(router, 'logic/programmer')
});

/* sidebar-menu configuration */
const asideEllapsed = ref(true);
const onToggleCollapse = (collapsed) => {
  asideEllapsed.value = !collapsed;
};

const menu = reactive([
  {
    header: 'Heka Logic Editor',
    hiddenOnCollapse: true,
  },
  // {
  //   href: '/logic/designer',
  //   title: 'Logic Designer',
  //   icon: 'fa fa-sitemap',
  // },
  {
    href: '/logic/programmer',
    title: 'Logic Programmer',
    icon: 'fa fa-edit',
  },
  // {
  //   href: '/logic/list',
  //   title: 'Templates',
  //   icon: 'fa fa-list-alt',
  // },
  // {
  //   href: '/settings',
  //   title: 'Settings',
  //   icon: 'fa fa-wrench',
  // },
  {
    href: '/signout',
    title: 'Sign Out',
    icon: 'fa fa-sign-out'
  }
])
</script>
<template>
     <sidebar-menu :menu="menu" @update:collapsed="onToggleCollapse" />
     <div :class="{ 'main-collapsed': asideEllapsed, 'main': !asideEllapsed }">
         <main>
            <router-view />
         </main>
     </div>
</template>

<style lang="postcss" scoped>
.main-collapsed{
  padding-left:290px;
}
.main{
  padding-left: 65px;
}
</style>