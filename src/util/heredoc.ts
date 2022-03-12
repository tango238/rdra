export const heredoc = (strings:TemplateStringsArray, ...values: string[]) => {
  const lines = stripFirstAndLastBlankLines(
    makeString(strings, values).split('\n')
  )
  return stripIndent(lines, smallestIndent(lines)).join('\n')
}

const makeString = (literals:TemplateStringsArray, placeholders: string[]): string => {
  return literals.reduce((acc:string, val:string, i) => {
    return acc += val + (placeholders[i] ?? '')
  }, '')
}

const smallestIndent = (lines: string[]):number => {
  return lines.reduce((smallest:number, line:string):number => {
    const indent = line.search(/[^ ]/)
    if (indent !== -1 && (smallest == -1 || indent < smallest)) {
      return indent
    }
    return smallest
  }, -1)
}

const stripIndent = (lines: string[], spacesToStrip: number) => {
  const findIndent = new RegExp(`^ {${spacesToStrip}}`)
  return lines.map(line =>
    findIndent.test(line) ? line.replace(findIndent, '') : line
  )
}

const stripFirstAndLastBlankLines = (lines: string[]): string[] => {
  const isFirstLineBlank = isWhitespace(lines[0])
  const isLastLineBlank = isWhitespace(lines[lines.length - 1])
  if (isFirstLineBlank || isLastLineBlank) {
    return lines.slice(
      isFirstLineBlank ? 1 : 0,
      isLastLineBlank ? lines.length - 1 : lines.length
    )
  }
  return lines
}

const isWhitespace = (s:string): boolean => {
  return /^\s*$/.test(s)
}