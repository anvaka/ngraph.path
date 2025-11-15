// Type definitions for ngraph.path v1.0.2
// Project: https://github.com/anvaka/ngraph.path
// Definitions by: Nathan Westlake <https://github.com/CorayThan>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import { Graph, Link, Node, NodeId } from "ngraph.graph";

export interface PathFinderOptions<NodeData, LinkData> {
    oriented?: boolean;
    quitFast?: boolean;
    heuristic?: (from: Node<NodeData>, to: Node<NodeData>) => number;
    distance?: (from: Node<NodeData>, to: Node<NodeData>, link: Link<LinkData>) => number;
    blocked?: (from: Node<NodeData>, to: Node<NodeData>, link: Link<LinkData>) => boolean;
}

export interface PathFinder<NodeData> {
    find: (from: NodeId, to: NodeId) => Node<NodeData>[];
}

export function aStar<NodeData, LinkData>(graph: Graph<NodeData, LinkData>, options?: PathFinderOptions<NodeData, LinkData>): PathFinder<NodeData>;

export function aGreedy<NodeData, LinkData>(graph: Graph<NodeData, LinkData>, options?: PathFinderOptions<NodeData, LinkData>): PathFinder<NodeData>;

export function nba<NodeData, LinkData>(graph: Graph<NodeData, LinkData>, options?: PathFinderOptions<NodeData, LinkData>): PathFinder<NodeData>;

declare const ngraphPath: {
    aStar: typeof aStar;
    aGreedy: typeof aGreedy;
    nba: typeof nba;
};

export default ngraphPath;
