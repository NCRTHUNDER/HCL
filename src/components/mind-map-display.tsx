"use client";

import type { MindMapNode } from "@/ai/flows/generate-mind-map";
import { cn } from "@/lib/utils";

interface MindMapNodeProps {
    node: MindMapNode;
    isRoot?: boolean;
    level?: number;
}

const MindMapNodeDisplay: React.FC<MindMapNodeProps> = ({ node, isRoot = false, level = 0 }) => {
    return (
        <div className={cn("flex items-start", !isRoot && "pl-6 pt-2")}>
             {!isRoot && <div className="w-4 h-px bg-muted-foreground/50 mr-2 mt-3" />}
            <div className="flex-1">
                <div className={cn(
                    "p-2 rounded-md inline-block",
                    isRoot ? "bg-primary text-primary-foreground text-base font-bold" : "bg-card text-card-foreground text-sm",
                    !isRoot && "border"
                )}>
                    {node.topic}
                </div>
                {node.children && node.children.length > 0 && (
                    <div className="mt-1">
                        {node.children.map((child, index) => (
                            <MindMapNodeDisplay key={index} node={child} level={level + 1}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

interface MindMapDisplayProps {
    node: MindMapNode;
}

export const MindMapDisplay: React.FC<MindMapDisplayProps> = ({ node }) => {
    return (
        <div className="p-2">
            <h4 className="font-bold mb-4 text-center text-lg">Mind Map</h4>
            <MindMapNodeDisplay node={node} isRoot={true} />
        </div>
    );
};
