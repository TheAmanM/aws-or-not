import Logo from "../assets/Logo";

export default function Header() {
  return (
    <header className="border-b border-[#ccccd1]">
      <nav className="flex flex-row items-center justify-center py-2 gap-2">
        <Logo className="size-10 lg:size-12" />
        <h1 className="text-2xl lg:text-3xl font-medium">or Not</h1>
      </nav>
    </header>
  );
}
