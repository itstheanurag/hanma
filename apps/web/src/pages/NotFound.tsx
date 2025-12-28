import { Link } from "react-router-dom";
import { LuHouse, LuArrowLeft } from "react-icons/lu";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* 404 Number */}
        <div className="relative mb-8">
          <span className="text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary/20 to-secondary/20 select-none leading-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-foreground">Oops!</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-semibold text-foreground mb-3">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            <LuHouse className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
          >
            <LuArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Decorative element */}
        <div className="mt-16 flex justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-secondary/40 animate-pulse delay-100" />
          <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse delay-200" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;