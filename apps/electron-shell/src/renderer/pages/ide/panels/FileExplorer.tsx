import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  Plus,
  FolderPlus,
} from "lucide-react";
import { useI18n } from "../../../hooks/useI18n";
import { Tooltip } from "../../../components/ui/Tooltip";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  ext?: string;
}

const DEMO_FILES: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          { name: "App.tsx", type: "file", ext: "tsx" },
          { name: "Button.tsx", type: "file", ext: "tsx" },
          { name: "Input.tsx", type: "file", ext: "tsx" },
        ],
      },
      {
        name: "pages",
        type: "folder",
        children: [
          { name: "Home.tsx", type: "file", ext: "tsx" },
          { name: "About.tsx", type: "file", ext: "tsx" },
        ],
      },
      { name: "index.tsx", type: "file", ext: "tsx" },
      { name: "styles.css", type: "file", ext: "css" },
    ],
  },
  { name: "package.json", type: "file", ext: "json" },
  { name: "tsconfig.json", type: "file", ext: "json" },
  { name: "README.md", type: "file", ext: "md" },
];

const EXT_COLORS: Record<string, string> = {
  tsx: "#61afef",
  ts: "#61afef",
  jsx: "#e5c07b",
  js: "#e5c07b",
  css: "#56b6c2",
  json: "#98c379",
  md: "#abb2bf",
};

function FileItem({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const isFolder = node.type === "folder";
  const color = node.ext ? (EXT_COLORS[node.ext] ?? "var(--text-secondary)") : "var(--text-secondary)";

  return (
    <div>
      <button
        className="flex items-center gap-1 w-full text-left py-0.5 rounded transition-colors"
        style={{ paddingLeft: `${8 + depth * 12}px`, color: "var(--text-secondary)" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
        }
        onClick={() => isFolder && setOpen((o) => !o)}
      >
        {isFolder ? (
          <>
            <span style={{ color: "var(--text-muted)" }}>
              {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
            <span style={{ color: "#e5c07b" }}>
              {open ? <FolderOpen size={13} /> : <Folder size={13} />}
            </span>
          </>
        ) : (
          <>
            <span className="w-3" />
            <File size={13} style={{ color }} />
          </>
        )}
        <span className="text-xs truncate ml-0.5">{node.name}</span>
      </button>
      {isFolder &&
        open &&
        node.children?.map((child) => (
          <FileItem key={child.name} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

export function FileExplorer() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="flex items-center justify-between px-3 py-1.5 shrink-0"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          {t("fileExplorer.title")}
        </span>
        <div className="flex items-center gap-0.5">
          <Tooltip content={t("fileExplorer.newFile")} side="bottom">
            <button
              className="p-1 rounded"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <Plus size={14} />
            </button>
          </Tooltip>
          <Tooltip content={t("fileExplorer.newFolder")} side="bottom">
            <button
              className="p-1 rounded"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <FolderPlus size={14} />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {DEMO_FILES.map((node) => (
          <FileItem key={node.name} node={node} />
        ))}
      </div>
    </div>
  );
}
