import HomeIcon from '@/components/Icons/Circle';
import ShopIcon from '@/components/Icons/Shop';

type RoutePath = '/' | '/favourites' | '/profile' | '/groceries' | '/carts' | '/search';

export interface Route {
  name: string;
  path: RoutePath;
  icon: {
    size: number;
    name: string;
    set: string;
    component?: React.ComponentType<any> | null;
  };
}

export const ROUTES: Route[] = [
  {
    name: 'Еда',
    path: '/',
    icon: {
      size: 25,
      set: 'ion',
      name: 'fast-food-outline',
      component: null
    }
  },
  {
    name: 'Продукты',
    path: '/groceries',
    icon: {
      size: 26,
      set: 'materialCom',
      name: 'storefront-outline',
      component: ShopIcon
    }
  },
  {
    name: 'Корзина',
    path: '/carts',
    icon: {
      size: 23,
      set: 'feather',
      name: 'shopping-bag',
      component: null
    }
  },
  {
    name: 'Избранное',
    path: '/favourites',
    icon: {
      size: 24,
      set: 'feather',
      name: 'heart',
      component: null
    }
  }
  // {
  //   name: 'Профиль',
  //   path: '/profile',
  //   icon: {
  //     size: 25,
  //     set: 'feather',
  //     name: 'user'
  //   }
  // }
];
