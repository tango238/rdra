import select from '@inquirer/select'

export type MenuItem = {
  label: string
  action: () => void | Promise<void>
}

/**
 * Presents a `select` prompt built from `items` (in order) and runs the
 * matching item's action. Used by the interactive command menus, which
 * differ only in which items they offer and what each item does.
 */
export const runMenu = async (items: MenuItem[], pageSize = 5): Promise<void> => {
  const selected = await select({
      message: 'Please Select',
      choices: items.map(item => ({ name: item.label, value: item.label })),
      pageSize,
    },
    {
      clearPromptOnDone: true,
    })

  const item = items.find(it => it.label == selected)
  if (item) {
    await item.action()
  }
}
