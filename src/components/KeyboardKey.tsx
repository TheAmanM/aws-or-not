export default function KeyboardKey({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <kbd className="ml-auto bg-[#e1e1e6] text-black pointer-events-none flex h-5 lg:h-6 items-center justify-center gap-1 rounded border border-[#d4d4d9] px-1 text-[0.7rem] font-medium select-none [&amp;_svg:not([class*='size-'])]:size-3 aspect-square">
      {children}
    </kbd>
  );
}
