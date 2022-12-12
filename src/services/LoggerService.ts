import chalk from 'chalk';

export class LoggerService {
    info(message: string): void {
        console.log(chalk.green.bold(message));
    }

    warning(message: string): void {
        console.log(chalk.yellow.bold(message));
    }
}