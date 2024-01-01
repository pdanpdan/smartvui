import { reactive } from 'vue';

type SectionName = 'header' | 'footer' | 'asideBefore' | 'asideAfter' | 'main';

export const visibility = reactive<Record<SectionName, boolean>>({
  header: true,
  footer: true,
  asideBefore: true,
  asideAfter: false,
  main: true,
});
