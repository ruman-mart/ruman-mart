import Navbar from "./Navbar";
import Footer from "./Footer";

type LoadingScreenProps = {
  title: string;
  description: string;
};

export default function LoadingScreen({ title, description }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fb] text-slate-800">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4">
        <div role="status" aria-live="polite" className="w-full max-w-xl rounded-xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#0b75a5]" />
          <h1 className="mt-5 text-xl font-bold text-[#0b1d45]">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
