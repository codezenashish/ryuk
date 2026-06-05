"use client";

interface DialogProps {
  isDialogOpen: boolean;
  onDialogClose: () => void;
}

export default function ImportDialog({ isDialogOpen, onDialogClose }: DialogProps) {
  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/8 bg-zinc-950 p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white">Import Bookmarks</h2>
        <button 
          onClick={onDialogClose}
          className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/20"
        >
          Close
        </button>
      </div>
    </div>
  );
}