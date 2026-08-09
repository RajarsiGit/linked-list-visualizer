import { Link } from "react-router-dom";

const TOPICS = [
  {
    group: "data structures",
    items: [
      {
        path: "/linked-list",
        name: "linked_list",
        desc: "insert/delete/traverse a singly-linked list",
        ready: true,
      },
      { path: "/stack", name: "stack", desc: "push/pop/peek, LIFO order", ready: true },
      { path: "/queue", name: "queue", desc: "enqueue/dequeue, FIFO order", ready: true },
      {
        path: "/bst",
        name: "binary_search_tree",
        desc: "insert/delete/search + traversals",
        ready: true,
      },
      {
        path: "/hash-table",
        name: "hash_table",
        desc: "insert/get/delete with chaining",
        ready: true,
      },
      { path: "/heap", name: "min_heap", desc: "insert/extract-min, sift up/down", ready: true },
    ],
  },
  {
    group: "algorithms",
    items: [
      {
        path: "/sorting",
        name: "sorting",
        desc: "bubble · insertion · merge · quick",
        ready: true,
      },
      {
        path: "/graph",
        name: "graph_traversal",
        desc: "BFS · DFS · dijkstra",
        ready: true,
      },
    ],
  },
];

export default function HomePage() {
  return (
    <div>
      <p className="text-ink-mute text-sm mt-2 mb-8 max-w-2xl">
        pick a structure or algorithm below. each view animates its operations
        step by step and logs them like a running console.
      </p>

      <div className="space-y-8">
        {TOPICS.map((group) => (
          <section key={group.group}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] tracking-[0.15em] text-ink-mute uppercase">
                {group.group}
              </span>
              <div className="flex-1 h-px bg-line" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.items.map((topic) => (
                <TopicCard key={topic.name} {...topic} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function TopicCard({ path, name, desc, ready }) {
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-ink text-sm">
          <span className="text-accent">$</span> {name}
        </span>
        {!ready && (
          <span className="text-[9px] uppercase tracking-widest text-ink-faint border border-line-dashed rounded px-1.5 py-0.5">
            soon
          </span>
        )}
      </div>
      <p className="text-ink-mute text-xs mt-2">{desc}</p>
    </>
  );

  const base = "block rounded border p-4 transition-colors";

  if (!ready) {
    return (
      <div className={`${base} border-line bg-surface opacity-50 cursor-not-allowed`}>
        {inner}
      </div>
    );
  }

  return (
    <Link
      to={path}
      className={`${base} border-line bg-surface hover:border-line-hover hover:bg-surface-alt`}
    >
      {inner}
    </Link>
  );
}
