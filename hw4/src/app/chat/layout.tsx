import Navbar from "./_components/Navbar";
import Roombar from "./_components/Roombar"

type Props = {
    children: React.ReactNode;
  };
  
  function DocsLayout({ children }: Props) {
    return (
      // overflow-hidden for parent to hide scrollbar
      <main className="flex-rows fixed top-0 flex h-screen w-full overflow-hidden">
        {/* overflow-y-scroll for child to show scrollbar */}
        <nav className="flex w-1/5 flex-cols border-r bg-slate-100 pb-10">
          <Navbar />
        </nav>
        {/* overflow-y-scroll for child to show scrollbar */}
        <div className="w-2/5 overflow-y-scroll">
          <Roombar />
        </div>
        <div className="w-2/5 ">
          {children}
        </div>
      </main>
    );
  }  
  
  export default DocsLayout;