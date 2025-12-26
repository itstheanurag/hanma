import { communityMeta, communityActions, communityMessages } from "@/data/community.data";
import { Link } from "react-router-dom";

const Community = () => {
  return (
    <section className="py-24 px-6 border-border bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="bg-surface border border-border rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-xs font-medium text-foreground mb-6 shadow-sm">
                <communityMeta.badge.icon
                  size={12}
                  className={communityMeta.badge.iconClass}
                />
                <span>{communityMeta.badge.label}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {communityMeta.heading}
              </h2>

              <p className="text-muted text-lg mb-8 leading-relaxed">
                {communityMeta.description}
              </p>

              <div className="flex flex-wrap gap-4">
                {communityActions.map((action) => {
                  const Wrapper = ({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) => 
                     // @ts-ignore
                    action.path ? (
                       // @ts-ignore
                      <Link to={action.path} className={className} {...props}>
                        {children}
                      </Link>
                    ) : (
                      <button className={className} {...props}>
                         {children}
                      </button>
                    );

                  return (
                    <Wrapper
                      key={action.id}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${action.className}`}
                    >
                      <action.icon size={18} />
                      <span>{action.label}</span>
                    </Wrapper>
                  );
                })}
              </div>
            </div>

            {/* Community messages */}
            <div className="bg-background border border-border rounded-xl p-6 shadow-xl max-w-md mx-auto w-full">
              <div className="space-y-4">
                {communityMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <div
                      className={`w-8 h-8 rounded-full ${msg.user.avatarColor} flex items-center justify-center text-xs text-white font-bold`}
                    >
                      {msg.user.initials}
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {msg.user.name}
                        </span>
                        <span className="text-[10px] text-muted">
                          {msg.time}
                        </span>
                      </div>

                      <p className="text-sm text-muted mt-1">
                        {msg.message}
                      </p>

                      {msg.reactions.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {msg.reactions.map((reaction, i) => (
                            <span
                              key={i}
                              className="text-[12px] bg-surface border border-border px-1.5 py-0.5 rounded text-foreground"
                            >
                              {reaction.label} · {reaction.count}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

               <div className="flex items-center gap-2 text-muted text-xs pt-2">
  <span className="flex-1 h-px bg-border" />
  <span className="whitespace-nowrap">New messages</span>
  <span className="flex-1 h-px bg-border" />
</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
