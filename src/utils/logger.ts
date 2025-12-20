import { Request, Response } from 'express';
import fs from 'fs';

export function logRoute(method: string, path: string, controller: string, handler: (req: Request, res: Response) => void | Promise<void>) {
  return (req: Request, res: Response) => {
    const fichierLog = './logs';
    if (!fs.existsSync(fichierLog)) {
      fs.mkdirSync(fichierLog, { recursive: true });
    }

    const startLog = `${new Date().toString()} ${method} ${path} / controller: ${controller} - debut\n`;
    fs.appendFile('./logs/logs.txt', startLog, () => {});

    res.on('fin', () => {
      const status = res.statusCode >= 400 ? 'Error' : 'Success';
      const endLog = `${new Date().toString()} ${method} ${path} / controller: ${controller} - ${status} - status: ${res.statusCode}\n`;
      fs.appendFile('./logs/logs.txt', endLog, () => {});
    });

    try {
      handler(req, res);
    } catch (err) {
      const errorLog = `${new Date().toString()} ${method} ${path} / controller: ${controller} - erreur: ${err}\n`;
      fs.appendFile('./logs/logs.txt', errorLog, () => {});
      throw err;
    }
  };
}