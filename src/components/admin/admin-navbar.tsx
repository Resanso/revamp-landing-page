import UserMenu from "./user-menu";

type AdminNavbarProps = {
  name: string;
  email: string;
  nim: string;
};

export default function AdminNavbar({ name, email, nim }: AdminNavbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-black/10 bg-white px-6">
      <p className="text-sm text-black/50">Panel Admin PRODIGI</p>
      <UserMenu name={name} email={email} nim={nim} />
    </header>
  );
}
