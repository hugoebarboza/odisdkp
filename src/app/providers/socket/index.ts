import { SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';


export const socketConfig: SocketIoConfig = { url: environment.wsUrl, options: {} };
