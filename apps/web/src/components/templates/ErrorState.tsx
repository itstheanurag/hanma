import { FiAlertTriangle } from "react-icons/fi";


export default function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[50vh] text-center">
      <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
        <FiAlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="text-muted-foreground max-w-md mb-6">{message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        Reload Page
      </button>
    </div>
  );
}
