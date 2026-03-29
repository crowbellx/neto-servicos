import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | Neto Serviços',
  description: 'Painel administrativo Neto Serviços',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
