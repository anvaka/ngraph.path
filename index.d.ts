// Type definitions for ngraph.path v1.0.2
// Project: https://github.com/anvaka/ngraph.path
// Definitions by: Nathan Westlake <https://github.com/CorayThan>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "ngraph.path" {

    import { Graph, Link, Node, NodeId } from "ngraph.graph"

    interface PathFinderOptions {
        oriented?: boolean
        quitFast?: boolean
        heuristic?: (from: NodeId, to: NodeId) => number
        distance?: (from: NodeId, to: NodeId, link: Link) => number
    }

    interface PathFinder {
        find: (from: NodeId, to: NodeId) => Node[]
    }

    export function aStar(graph: Graph, options?: PathFinderOptions): PathFinder

    export function aGreedy(graph: Graph, options?: PathFinderOptions): PathFinder

    export function nba(graph: Graph, options?: PathFinderOptions): PathFinder

}
