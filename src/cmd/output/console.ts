import chalk from 'chalk'

const info = (message: string) => console.log(message)
const warn = (message: string) => console.log(chalk.yellow(message))
const error = (message: string) => console.log(chalk.red(message))

const title = (title: string) => console.log(chalk.yellow(`# ${title}`))
const subtitle = (title: string) => console.log(chalk.green(`# ${title}`))
const br = () => console.log()
const line = (str: string) => console.log("━".repeat(stringLength(str)))

const stringLength = (str: string): number => {
  const escapedStr = escape(str);
  let len = 0;
  for (let i = 0; i < escapedStr.length; i++, len++) {
    if (escapedStr.charAt(i) === '%') {
      if (escapedStr.charAt(++i) === 'u') {
        i += 3;
        len++;
      }
      i++;
    }
  }

  return len;}

export {
  info, warn, error,
  title, subtitle, br, line
}