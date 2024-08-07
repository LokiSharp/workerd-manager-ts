'use client'

import { usePathname } from "next/navigation"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Sidebar, SidebarBody, SidebarItem, SidebarLabel, SidebarSection, SidebarSpacer } from "@/components/sidebar"

export function ApplicationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    let pathname = usePathname()

    return (
        <SidebarLayout
            sidebar={
                <Sidebar>
                    <SidebarBody>
                        <SidebarSection>
                            <SidebarItem href="/" current={pathname === '/'}>
                                <SidebarLabel>Home</SidebarLabel>
                            </SidebarItem>
                            <SidebarItem href="/workers" current={pathname.startsWith('/workers')}>
                                <SidebarLabel>Workers</SidebarLabel>
                            </SidebarItem>
                            <SidebarItem href="/settings" current={pathname.startsWith('/settings')}>
                                <SidebarLabel>Settings</SidebarLabel>
                            </SidebarItem>
                            <SidebarItem href="/login" current={pathname.startsWith('/login')}>
                                <SidebarLabel>Login</SidebarLabel>
                            </SidebarItem>
                            <SidebarItem href="/signup" current={pathname.startsWith('/signup')}>
                                <SidebarLabel>Signup</SidebarLabel>
                            </SidebarItem>
                        </SidebarSection>
                    </SidebarBody>
                </Sidebar>
            }
        >
            {children}
        </SidebarLayout>
    )
}