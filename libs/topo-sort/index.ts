export class SortTreeNode<T = any, N extends SortTreeNode<T> = any> {
  public deps: N[] = [];

  constructor(public value: T, deps: N[] = []) {
    this.addDeps(deps);
  }

  addDeps(deps: N[]) {
    deps?.forEach(dep => this.addDep(dep));
    return this;
  }

  addDep(dep: N) {
    if (this.deps.includes(dep)) return this;
    this.deps.push(dep);
    return this;
  }
}

class SortNodeCalculated<T extends SortTreeNode = any> {
  __degree = 0;
  __dependants: SortNodeCalculated<any>[] = [];
  deps: SortNodeCalculated[] = [];
  constructor(public readonly node: T) {}
}

function mapNodesToCalculated<T extends SortTreeNode>(nodes: T[]) {
  const nodesMap = new WeakMap<T, SortNodeCalculated<T>>();
  const calculatedNodes = nodes.map(node => {
    const calculated = new SortNodeCalculated(node);
    nodesMap.set(node, calculated);
    return calculated;
  });
  calculatedNodes.forEach(calculated => {
    calculated.deps = calculated.node.deps.map(dep => {
      const calculatedDep = nodesMap.get(dep);
      calculatedDep.__dependants.push(calculated);
      calculated.__degree++;
      return calculatedDep;
    });
  });
  return calculatedNodes;
}

export class CycleDepsError<T extends SortNodeCalculated> extends Error {
  constructor(lefts: T[]) {
    const first = lefts[0];
    const visited = [first];
    const cycled: Array<T[]> = [];

    function visit(node, paths: Array<T[]>) {
      node.__dependants.forEach(next => {
        const nextPaths = paths.map(path => path.slice(0).concat([next]));

        if (visited.includes(next)) {
          cycled.push(...nextPaths);
          return;
        }

        visit(next, nextPaths);
      });
    }

    visit(first, [[first]]);

    super(
      'Cycled paths: \n' +
        cycled
          .map(path => path.map(item => item.node.value).join('->'))
          .join(';\n')
    );
  }
}

export function topologicalGroupedSort<T extends SortTreeNode>(
  nodes: T[]
): Array<T[]> {
  if (!nodes.length) return [];

  const calculatedNodes = mapNodesToCalculated(nodes);

  let round = [...calculatedNodes];
  let nextRound: SortNodeCalculated[] = [];
  const sorted: Array<T[]> = [];
  let roundIndex = 0;

  while (nextRound.length || round.length) {
    const roundSorted: SortNodeCalculated[] = [];

    while (round.length) {
      const node = round.shift();
      if (node.__degree > 0) {
        nextRound.push(node);
        continue;
      }

      roundSorted.push(node);
    }

    if (!roundSorted.length) {
      throw new CycleDepsError(nextRound);
    }

    roundSorted.forEach(node => {
      node.__dependants.forEach(dependant => dependant.__degree--);
    });

    sorted[roundIndex] = roundSorted.map(calcNode => calcNode.node as T);
    round = nextRound;
    nextRound = [];
    roundIndex++;
  }

  return sorted;
}
