const checkIsCompleteGraph = (node: AudioGraphNode): boolean => {
  if (node.isRoot) return true
  if (node.parents.length === 0) return false

  return node.parents.some((parent) => checkIsCompleteGraph(parent))
}

export class AudioGraphNode {
  children: readonly AudioGraphNode[] = []

  parents: readonly AudioGraphNode[] = []

  value: AudioNode | AudioParam

  constructor(value: AudioNode | AudioParam, public readonly isRoot = false) {
    this.value = value
  }

  addChild(child: AudioGraphNode) {
    this._addChild(child)
    child._addParent(this)
  }

  /** Returns true if node is connected to a root BaseAudioContext's destination node */
  get getIsInCompleteGraph() {
    return checkIsCompleteGraph(this)
  }

  removeChild(child: AudioGraphNode) {
    this._removeChild(child)
    child._removeParent(this)
  }

  protected _removeChild(child: AudioGraphNode) {
    const index = this.children.indexOf(child)

    if (index !== -1) {
      const newChildren = [...this.children]
      newChildren.splice(index, 1)

      this.children = newChildren
    }
  }

  protected _removeParent(parent: AudioGraphNode) {
    const index = this.parents.indexOf(parent)

    if (index !== -1) {
      const newParents = [...this.parents]
      newParents.splice(index, 1)

      this.parents = newParents
    }
  }

  protected _addChild(child: AudioGraphNode) {
    if (!this.children.includes(child) && child !== this) {
      this.children = [...this.children, child]
    }
  }

  protected _addParent(parent: AudioGraphNode) {
    if (!this.parents.includes(parent) && parent !== this) {
      this.parents = [...this.parents, parent]
    }
  }
}
