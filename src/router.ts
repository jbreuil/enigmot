import { createRouter, createWebHistory } from 'vue-router'

import TheAppIndex from '@/pages/TheAppIndex.vue'
import ChallengeDaily from '@/pages/ChallengeDaily.vue'
import ChallengeEndless from '@/pages/ChallengeEndless.vue'
import ChallengeTimer from '@/pages/ChallengeTimer.vue'

const routes = [
  {
    path: '/',
    component: TheAppIndex,
    name: 'index',
    meta: {
      title: 'Enigmot',
    },
  },
  {
    path: '/daily',
    component: ChallengeDaily,
    name: 'daily',
    meta: {
      title: 'Enigmot',
    },
  },
  {
    path: '/timer',
    component: ChallengeTimer,
    name: 'timer',
    meta: {
      title: 'Enigmot',
    },
  },
  {
    path: '/endless',
    component: ChallengeEndless,
    name: 'endless',
    meta: {
      title: 'Enigmot',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router