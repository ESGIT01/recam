<!-- src/components/header/MainNav.vue -->
<template>
    <nav class="main-nav">
      <ul class="nav-list">
        <li 
          v-for="(item, index) in menuItems" 
          :key="index" 
          class="nav-item"
          @mouseenter="handleMouseEnter(item.id)"
          :class="{ 'active': activeMenu === item.id }"
        >
          <router-link :to="item.path" class="nav-link">
            {{ item.title }}
          </router-link>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'MainNav',
    props: {
      menuItems: {
        type: Array,
        required: true
      },
      activeMenu: {
        type: String,
        default: null
      }
    },
    emits: ['menu-hover'],
    setup(props, { emit }) {
      const handleMouseEnter = (menuId) => {
        emit('menu-hover', menuId);
      };
  
      return {
        handleMouseEnter
      };
    }
  }
  </script>
  
  <style scoped>
  .main-nav {
    flex: 1;
  }
  
  .nav-list {
    display: flex;
    list-style: none;
  }
  
  .nav-item {
    position: relative;
    margin: 0 5px;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    color: var(--text-dark);
    text-decoration: none;
    font-size: 18px;
    font-weight: 600;
    transition: all 0.2s ease;
    position: relative;
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary);
    transition: width 0.3s ease;
  }
  
  .nav-item:hover .nav-link,
  .nav-item.active .nav-link {
    color: var(--primary-dark);
  }
  
  .nav-item:hover .nav-link::after,
  .nav-item.active .nav-link::after {
    width: 100%;
  }
  
  /* 반응형 */
  @media (max-width: 1199px) {
    .nav-link {
      padding: 10px 15px;
      font-size: 16px;
    }
  }
  
  @media (max-width: 991px) {
    .main-nav {
      display: none;
    }
  }
  </style>