import { TreeNode } from './tree/tree-node';
import { Topic } from './topic';

const radius = 60;
const horizontalGap = 40;
const verticalGap = 20;

export function getDepthCountMap(topics: Topic[]) {
  return topics.reduce((map, topic) => {
    map = new Map(map);
    const depth = topic.depth;
    const count = (map.get(depth) ?? 0) + 1;
    map.set(depth, count);
    return map;
  }, new Map<number, number>());
}

/**
 * Returns the width based after finding the row (depth) with the max topics.
 */
export function getTopicsTreeWidth(depthCountMap: Map<number, number>) {
  const maxCount = Array.from(depthCountMap.entries()).reduce(
    (max, [depth, count]) => {
      return Math.max(max, count);
    },
    0
  );

  return maxCount * radius * 2 + (maxCount + 1) * horizontalGap;
}

export function getTopicsTreeNodes(topics: Topic[]): TreeNode[] {
  const depthCountMap = getDepthCountMap(topics);
  const chartWidth = getTopicsTreeWidth(depthCountMap);
  return topics.map((topic) => {
    /* Topic's row. */
    const rowIndex = topic.depth;

    /* Get topic's column index. */
    const rowTopics = topics.filter(({ depth }) => depth === topic.depth);
    const rowTopicCount = rowTopics.length;
    const colIndex = rowTopics.indexOf(topic);

    return {
      id: topic.id,
      name: topic.name,
      x: ((colIndex + 1) * chartWidth) / (rowTopicCount + 1),
      y: radius + rowIndex * (2 * radius + verticalGap),
      linkWith: topic.nextTopics,
    };
  });
}
