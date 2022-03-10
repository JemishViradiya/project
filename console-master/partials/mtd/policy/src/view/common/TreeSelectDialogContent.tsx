/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import 'react-virtualized/styles.css'
import 'react-virtualized-tree/lib/main.css'

import { cloneDeep } from 'lodash-es'
import React, { useCallback } from 'react'
import type { Node, NodeId } from 'react-virtualized-tree'
import Tree from 'react-virtualized-tree'

import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core'

import { BasicCancel, BasicClose, BasicSearch, useCheckboxLabelStyles, useDialogStyles } from '@ues/assets'

import type { TreeSelectItem } from './TreeSelectRow'
import TreeSelectRow from './TreeSelectRow'

const useStyles = makeStyles(theme => ({
  contentRoot: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '60vh',
  },
  content: {
    maxHeight: '60vh',
    flex: 1,
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
  },
  list: {
    border: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(2),
    overflowY: 'auto',
    minWidth: '50vh',
    flexGrow: 1,
    '& .MuiListItem-theme': {
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  },
  virtualListContainer: {
    border: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(2),
    minWidth: '50vh',
    flexGrow: 1,
    overflow: 'hidden',
  },
}))

export type TreeSelectDialogProps = {
  labels: {
    title?: string
    description?: string
    searchText?: string
    cancel?: string
    close?: string
    submit?: string
    noModels?: string
    searchCancel?: string
  }
  variants: TreeSelectItem[]
  handleSearchChange: (s: string) => void
  closeHandler: () => void
  submitHandler: (selectedVariants: TreeSelectItem[]) => void
  selected?: any
  loading?: boolean
  allowEmpty?: boolean
  readOnly?: boolean
}

enum CheckedState {
  CLEAR,
  CHECKED,
  PARTIAL,
  NO_CHANGE,
}

export const TreeSelectDialogContent = ({
  labels,
  variants,
  handleSearchChange,
  closeHandler,
  submitHandler,
  selected,
  loading = false,
  allowEmpty = false,
  readOnly = false,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
TreeSelectDialogProps): JSX.Element => {
  const [checked, setChecked] = React.useState(selected ?? {})
  const [partialChecked, setPartialChecked] = React.useState(initPartialSelection(checked))
  const [expanded, setExpanded] = React.useState({})
  const [search, setSearch] = React.useState('')
  const classes = useStyles()
  const dialogClasses = useDialogStyles()
  const theme = useTheme()
  const labelClasses = useCheckboxLabelStyles(theme)

  const findTreeSelectItem = (id: string, item: TreeSelectItem) => {
    if (item.id === id) {
      return item
    }

    for (const child of item.children ?? []) {
      const result = findTreeSelectItem(id, child)
      if (result) {
        return result
      }
    }
  }

  const handleToggle = (id: string) => () => {
    let value: TreeSelectItem
    // find clicked node in variants array for parents information
    for (const variant of variants) {
      value = findTreeSelectItem(id, variant)
      if (value) {
        break
      }
    }

    if (!readOnly && value) {
      const newChecked = { ...checked }
      const newPartialChecked = { ...partialChecked }

      // unchecked => checked => partially checked
      let targetState = CheckedState.CHECKED
      if (checked[id]) {
        targetState = value.children ? CheckedState.PARTIAL : CheckedState.CLEAR
      } else if (partialChecked[id]) {
        targetState = CheckedState.CLEAR
      }
      const targetChildState = checked[id] ? CheckedState.NO_CHANGE : partialChecked[id] ? CheckedState.CLEAR : CheckedState.CHECKED
      cascadeCheckboxTreeToggle(id, value, targetState, targetChildState, newChecked, newPartialChecked)
      checkForPartiallySelectedNodes(value, checked[id] === undefined, newChecked, newPartialChecked)

      setChecked(newChecked)
      setPartialChecked(newPartialChecked)
    }
  }

  const shouldNodeBeVisible = useCallback(
    (node: Node, searchTerm: string) => {
      if (readOnly) {
        return checked[node.id] !== undefined || partialChecked[node.id] !== undefined
      } else {
        return searchTerm === '' || node.name.toLowerCase().includes(searchTerm.toLowerCase())
      }
    },
    [checked, partialChecked, readOnly],
  )

  // create the Node obj needed by react-virtualized-tree from our own TreeSelectItem
  const populateNodeState = useCallback(
    (variant: TreeSelectItem, parentVisible: boolean, searchTerm: string): Node => {
      const children = []
      for (const c of variant.children ?? []) {
        // we want to expand, and show everything when the user searches, all the way down to the models, hence why
        // parentVisible of the child is the parentVisible of the parent
        // alternatively, if the current node will be visible, all of its children should also be
        const result = populateNodeState(c, parentVisible || shouldNodeBeVisible(variant, searchTerm), searchTerm)
        if (result) {
          children.push(result)
        }
      }

      // gating condition so we don't show unselected brands/models in readOnly mode
      if ((parentVisible && !readOnly) || shouldNodeBeVisible(variant, searchTerm) || children.length > 0) {
        return {
          id: variant.id,
          name: variant.name,
          children,
          state: {
            expanded: readOnly || (!readOnly && searchTerm !== '') || (!readOnly && searchTerm === '' && expanded[variant.id]),
          },
        }
      }
    },
    [expanded, readOnly, shouldNodeBeVisible],
  )

  // create array of Node from our own variants array
  const initializeNodeState = React.useCallback(
    (variants: TreeSelectItem[], searchTerm: string): Node[] => {
      const result: Node[] = []
      for (const variant of variants) {
        const populatedNode = populateNodeState(variant, shouldNodeBeVisible(variant, searchTerm), searchTerm)
        if (populatedNode) {
          result.push(populatedNode)
        }
      }
      return result
    },
    [populateNodeState, shouldNodeBeVisible],
  )

  const [nodes, setNodes]: [Node[], React.Dispatch<React.SetStateAction<Node[]>>] = React.useState(() =>
    initializeNodeState(variants, ''),
  )
  const nothingToDisplay = nodes.length === 0

  const handleSearch = useCallback(
    (newSearchTerm: string) => {
      // tree initialization in search handler because having a useEffect for search would double the latency
      const newNodes = initializeNodeState(variants, newSearchTerm)
      handleSearchChange(newSearchTerm)
      setSearch(newSearchTerm)
      setNodes(newNodes)
    },
    [handleSearchChange, initializeNodeState, variants],
  )

  const onSubmit = useCallback(() => {
    submitHandler(Object.values(checked))
  }, [checked, submitHandler])

  // recursively search for the given node and toggle its dropdown state
  const toggleNodeDropdown = (nodeId: NodeId, curNode: Node) => {
    if (curNode.id !== nodeId) {
      // try to search for the specified node id
      for (const child of curNode.children) {
        toggleNodeDropdown(nodeId, child)
      }
    } else {
      // passed node id found
      const newExpanded = !curNode.state.expanded
      curNode.state.expanded = newExpanded
      setExpanded({ ...expanded, nodeId: newExpanded })
    }
  }

  return (
    <>
      {labels.title && (
        <DialogTitle disableTypography>
          <Typography variant="h2">{labels.title}</Typography>
          <IconButton size="small" onClick={closeHandler as React.MouseEventHandler} className={dialogClasses.closeButton}>
            <BasicClose />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent className={classes.contentRoot}>
        {!readOnly && (
          <Typography variant="body2" gutterBottom={true}>
            {labels.description}
          </Typography>
        )}
        <div className={classes.content}>
          {!readOnly && (
            <TextField
              label={labels.searchText}
              inputProps={{ title: labels.searchText }}
              id="standard-start-adornment"
              variant="filled"
              fullWidth
              value={search}
              onChange={e => handleSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <IconButton
                        title={search ? labels.searchCancel : labels.searchText}
                        onClick={() => {
                          handleSearch('')
                        }}
                      >
                        {search ? <BasicCancel /> : <BasicSearch />}
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          )}

          <div className={classes.virtualListContainer}>
            {nothingToDisplay ? (
              <Typography align="center">{labels.noModels}</Typography>
            ) : (
              <Tree
                nodes={nodes}
                onChange={() => {
                  // do nothing, dropdowns and checkboxes are handled by us above
                }}
              >
                {({ style, node }) => {
                  return (
                    <div style={{ ...style, paddingLeft: style.marginLeft, marginLeft: 0 }}>
                      <TreeSelectRow
                        item={node}
                        checked={checked[node.id] !== undefined}
                        indeterminate={partialChecked[node.id]}
                        readOnly={readOnly}
                        handleToggle={handleToggle}
                        dropdownClick={() => {
                          const newNodes = cloneDeep(nodes)
                          for (const newNode of newNodes) {
                            toggleNodeDropdown(node.id, newNode)
                          }
                          setNodes(newNodes)
                        }}
                        labelClasses={labelClasses}
                      />
                    </div>
                  )
                }}
              </Tree>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          title={labels.cancel}
          variant={readOnly ? 'contained' : 'outlined'}
          color={readOnly ? 'primary' : 'default'}
          onClick={closeHandler}
        >
          {readOnly ? labels.close : labels.cancel}
        </Button>

        {!readOnly && (
          <Button
            title={labels.submit}
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={!allowEmpty && Object.keys(checked).length === 0}
          >
            {labels.submit}
          </Button>
        )}
      </DialogActions>
    </>
  )
}

function cascadeCheckboxTreeToggle(id: string, value, targetState, targetChildrenState, checked, partialChecked) {
  if (targetState === CheckedState.CHECKED) {
    checked[id] = value
    delete partialChecked[id]
  } else if (targetState === CheckedState.PARTIAL) {
    delete checked[id]
    partialChecked[id] = value
  } else if (targetState === CheckedState.CLEAR) {
    delete checked[id]
    delete partialChecked[id]
  }
  if (value.children) {
    value.children.map(child => {
      cascadeCheckboxTreeToggle(child.id, child, targetChildrenState, targetChildrenState, checked, partialChecked)
    })
  }
}

function checkForPartiallySelectedNodes(startNode, enabling, checked, newPartialChecked) {
  if (startNode.parent && (!enabling || !checked[startNode.parent.id])) {
    let anySiblingChecked = false
    startNode.parent.children.map(sibling => {
      if (checked[sibling.id] || newPartialChecked[sibling.id]) {
        anySiblingChecked = true
      }
    })
    if (anySiblingChecked) {
      newPartialChecked[startNode.parent.id] = startNode.parent
      delete checked[startNode.parent.id]
      checkForPartiallySelectedNodes(startNode.parent, enabling, checked, newPartialChecked)
    } else {
      delete newPartialChecked[startNode.parent.id]
      delete checked[startNode.parent.id]
      checkForPartiallySelectedNodes(startNode.parent, enabling, checked, newPartialChecked)
    }
  }
}

function initPartialSelection(checked) {
  const newPartialChecked = {}
  for (const checkedId in checked) {
    checkForPartiallySelectedNodes(checked[checkedId], true, checked, newPartialChecked)
  }
  return newPartialChecked
}
