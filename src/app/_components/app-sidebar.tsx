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
import Image from 'next/image';
import logo from '../assets/logo_whitout_title.png';
import Link from 'next/link';
import { CertificateType, CertificateTypeLabels } from '@/src/core/enums/certificate-type.enum';
import {
  GraduationCap,
  FileText,
  Download,
  MessageSquare,
} from 'lucide-react';
import { UserViewModel } from '@/src/core/entities/user.entity';

export const data = {
  navMain: [
    {
      title: 'Emitir Certificado',
      icon: GraduationCap,
      items: (Object.entries(CertificateTypeLabels) as [CertificateType, string][]).map(
        ([type, label]) => ({
          title: label,
          url: `/dashboard/certificados/emitir?tipo=${type}`,
        }),
      ),
    },
    {
      title: 'Certificados Emitidos',
      url: '/dashboard/certificados',
      icon: FileText,
    },
    {
      title: 'Feedbacks de Alunos',
      url: '/dashboard/feedbacks',
      icon: MessageSquare,
    },
    {
      title: 'Baixar Planilha',
      url: 'https://docs.google.com/spreadsheets/d/14HgfhfrII_ydnz-WelCKMw4dS5UiRSAFwIXNqcr_KwY/export?format=xlsx',
      icon: Download,
    },
  ],

  navSecondary: [],
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
