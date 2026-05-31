import UserMenu from "./user-menu";

type AdminNavbarProps = {
  name: string;
  email: string;
  nim: string;
};

export default function AdminNavbar({ name, email, nim }: AdminNavbarProps) {
  return (
    <header className="flex h-[100px] items-center justify-end border-b border-[#D9D9D9] bg-white px-6">
      <div className="flex items-center gap-2">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center justify-center bg-[#FFC917] hover:bg-[#ffb901] transition-colors rounded text-black text-base font-bold font-jakarta px-[var(--admin-btn-px)] py-[var(--admin-btn-py)] h-[var(--admin-btn-h)]">
          View Website
        </a>
        <UserMenu name={name} email={email} nim={nim} />
      </div>
    </header>
  );
}
