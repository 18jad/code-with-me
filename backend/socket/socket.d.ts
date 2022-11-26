export namespace Socket {
  export interface Controller {
    id: string;
    room: string;
    username: string;
    broadcast: { to: Controller["to"] };
    join: (arg1: string | number) => void;
    on: (arg1: string, arg2: (param: any) => void) => void;
    emit: (arg1: string, arg2: (param: any) => void) => void;
    to: (arg1: string | number) => any;
    once: (arg1: string, arg2: (param: any) => void) => void;
  }

  export interface Instance {
    init(): void;
    onConnection(): void;
    onJoin(socket: Controller): void;
    onSend(socket: Controller): void;
    onTyping(socket: Controller): void;
    onCreateFile(socket: Controller): void;
    onCodeEdit(socket: Controller): void;
    onDisconnect(socket: Controller): void;
  }
}
