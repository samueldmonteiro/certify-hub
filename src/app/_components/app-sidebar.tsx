'use client';

import * as React from 'react';

import { NavMain } from '@/src/app/_components/nav-main';
import { NavSecondary } from '@/src/app/_components/nav-secondary';
import { NavUser } from '@/src/app/_components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/src/app/_components/ui/sidebar';
import { UserViewModel } from '@/src/core/application/view-models/user.view-model';
import Image from 'next/image';
import logo from '../assets/logo_whitout_title.png';
import Link from 'next/link';
import {
  FilePlus,
  FileText,
} from 'lucide-react';

export const data = {
  navMain: [
    {
      title: 'Emitir Certificado',
      icon: FilePlus,
      url: '/dashboard/certificados/emitir',
    },
    {
      title: 'Certificados Emitidos',
      url: '/dashboard/certificados',
      icon: FileText,
    },
  ],

  navSecondary: [
  /**   {
      title: 'Configurações',
      url: '/dashboard/configuracoes',
      icon: Settings,
    },**/
  ],
};

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: UserViewModel
}

export function AppSidebar(props: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src={logo} alt='logo' />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Preservar</span>
                  <span className="truncate text-xs">Serviços e Treinamentos</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
