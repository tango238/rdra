export type NodeType = {
  shape: string,
  style: string,
  fillcolor: string
}

export const ViewType: NodeType = { shape: 'tab', style: 'filled', fillcolor: '#90ee90' }
export const InformationType: NodeType = { shape: 'note', style: 'filled', fillcolor: '#f5f5f5' }
export const ConditionType: NodeType = { shape: 'underline', style: 'filled', fillcolor: '#87cefa' }

export const node = (name: string, label: string, type: NodeType) =>
  `"${name}" [label = "${label}", shape = ${type.shape}, style="${type.style}", fillcolor = "${type.fillcolor}"];`